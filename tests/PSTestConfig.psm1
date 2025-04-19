# CyberCore PowerShell Test Configuration

# Import the QuantumFunctions module at the beginning
if (Test-Path "$PSScriptRoot\..\QuantumFunctions.psm1") {
    Import-Module "$PSScriptRoot\..\QuantumFunctions.psm1" -Force
}

# Function to initialize test configuration
function Initialize-PSTestConfiguration {
    [CmdletBinding()]
    param (
        [string[]]$TestPaths = @('./tests'),
        [string[]]$Tags = @(),
        [string[]]$ExcludeTags = @('Skip'),
        [string]$OutputPath = './test-results',
        [bool]$CodeCoverage = $true,
        [string[]]$CodeCoveragePaths = @('./*.ps1'),  # Changed from './src' to all PowerShell scripts in the root
        [bool]$VerboseOutput = $false
    )

    # Create configuration object
    $config = @{
        TestPaths = $TestPaths
        Tags = @{
            Include = $Tags
            Exclude = $ExcludeTags
        }
        OutputPath = $OutputPath
        CodeCoverage = @{
            Enabled = $CodeCoverage
            Path = $CodeCoveragePaths
        }
        VerboseOutput = $VerboseOutput -or $PSCmdlet.MyInvocation.BoundParameters.ContainsKey('Verbose')
    }

    return $config
}

# Function to run PowerShell tests
function Invoke-PSTests {
    [CmdletBinding()]
    param (
        [hashtable]$PSTestConfiguration
    )

    # Ensure Pester v5+ is available
    $pesterModule = Get-Module -ListAvailable -Name Pester | 
                    Where-Object { $_.Version.Major -ge 5 } | 
                    Sort-Object Version -Descending | 
                    Select-Object -First 1
    
    if (-not $pesterModule) {
        Write-Error "Pester v5+ is required but not installed. Run Install-TestDependencies.ps1 first."
        return $null
    }
    
    # Import Pester module
    Import-Module Pester -MinimumVersion 5.0.0 -Force
    
    # Create configuration
    $PesterConfig = New-PesterConfiguration
    
    # Configure test discovery
    $PesterConfig.Run.Path = $PSTestConfiguration.TestPaths
    
    # Configure test filtering
    if ($PSTestConfiguration.Tags.Include.Count -gt 0) {
        $PesterConfig.Filter.Tag = $PSTestConfiguration.Tags.Include
    }
    
    if ($PSTestConfiguration.Tags.Exclude.Count -gt 0) {
        $PesterConfig.Filter.ExcludeTag = $PSTestConfiguration.Tags.Exclude
    }
    
    # Configure test output
    $PesterConfig.TestResult.Enabled = $true
    $PesterConfig.TestResult.OutputPath = "$($PSTestConfiguration.OutputPath)/pester-results.xml"
    
    # Configure verbosity
    if ($PSTestConfiguration.VerboseOutput -or $PSCmdlet.MyInvocation.BoundParameters.ContainsKey('Verbose')) {
        $PesterConfig.Output.Verbosity = 'Detailed'
    } else {
        $PesterConfig.Output.Verbosity = 'Normal'
    }
    
    # Configure code coverage with error handling for paths
    if ($PSTestConfiguration.CodeCoverage.Enabled) {
        # Verify that the code coverage paths exist
        $validCoveragePaths = @()
        
        foreach ($path in $PSTestConfiguration.CodeCoverage.Path) {
            # Handle wildcards by resolving them first
            if ($path -match '\*') {
                $resolvedPaths = Resolve-Path -Path $path -ErrorAction SilentlyContinue
                if ($resolvedPaths) {
                    $validCoveragePaths += $resolvedPaths.Path
                }
                else {
                    Write-Warning "Code coverage path pattern '$path' did not match any files. Skipping."
                }
            }
            # Handle exact paths
            elseif (Test-Path -Path $path) {
                $validCoveragePaths += (Resolve-Path -Path $path).Path
            }
            else {
                Write-Warning "Code coverage path '$path' does not exist. Skipping."
            }
        }
        
        # Only enable code coverage if we found valid paths
        if ($validCoveragePaths.Count -gt 0) {
            Write-Host "Enabling code coverage for $($validCoveragePaths.Count) files/paths" -ForegroundColor Yellow
            $PesterConfig.CodeCoverage.Enabled = $true
            $PesterConfig.CodeCoverage.Path = $validCoveragePaths
            $PesterConfig.CodeCoverage.OutputPath = "$($PSTestConfiguration.OutputPath)/coverage.xml"
        }
        else {
            Write-Warning "No valid code coverage paths found. Code coverage will be disabled."
            $PesterConfig.CodeCoverage.Enabled = $false
        }
    }
    
    # IMPORTANT: Enable PassThru in the configuration object instead of using the parameter
    $PesterConfig.Run.PassThru = $true
    
    # Execute tests - only use the Configuration parameter without any other conflicting parameters
    Write-Host "Running PowerShell tests..." -ForegroundColor Cyan
    try {
        Write-Host "Using Pester v$($pesterModule.Version) with Configuration object" -ForegroundColor Yellow
        $Results = Invoke-Pester -Configuration $PesterConfig
        return $Results
    }
    catch {
        Write-Host "Error running Pester tests: $_" -ForegroundColor Red
        Write-Host "Trying legacy invocation method..." -ForegroundColor Yellow
        
        # Try legacy method as absolute last resort
        try {
            Write-Host "Using legacy parameter method" -ForegroundColor Yellow
            # Use legacy parameter format for older Pester versions
            $Results = Invoke-Pester -Path $PSTestConfiguration.TestPaths -PassThru
            return $Results
        }
        catch {
            Write-Host "All Pester invocation methods failed. Please check your Pester installation." -ForegroundColor Red
            throw "Failed to execute Pester tests: $_"
        }
    }
}

# Make functions available to other scripts
Export-ModuleMember -Function Initialize-PSTestConfiguration, Invoke-PSTests