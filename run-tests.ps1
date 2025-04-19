<#
.SYNOPSIS
    Master test runner for CyberCore project
.DESCRIPTION
    Executes PowerShell and JavaScript tests with proper configuration
.NOTES
    Created for CyberCore VoidBloom project
#>
[CmdletBinding()]
param(
    [switch]$PSOnly,
    [switch]$JSOnly,
    [switch]$SkipCoverage,
    [switch]$NoVisuals
    # Verbose is provided automatically by CmdletBinding()
)

# Ensure we stop on errors
$ErrorActionPreference = 'Stop'

# Source directory structure
$scriptPath = $PSScriptRoot
$testPaths = @(
    Join-Path -Path $scriptPath -ChildPath "tests"
)
$outputPath = Join-Path -Path $scriptPath -ChildPath "test-results"

# Create output directory if it doesn't exist
if (-not (Test-Path -Path $outputPath)) {
    New-Item -Path $outputPath -ItemType Directory -Force | Out-Null
}

# Import visual progress module if visuals are enabled
$useVisuals = -not $NoVisuals
$visualProgress = $null

if ($useVisuals) {
    # Import the visual progress module
    try {
        Import-Module -Name (Join-Path -Path $scriptPath -ChildPath "tests\VisualTestProgress.psm1") -Force
        $visualProgress = Initialize-VisualProgress
    }
    catch {
        Write-Warning "Could not initialize visual progress display: $_"
        $useVisuals = $false
    }
}

# Function to show summary of test results
function Show-Summary {
    [CmdletBinding()]
    param(
        [bool]$PSTestsSuccess,
        [bool]$JSTestsSuccess,
        [int]$PSTestCount = 0,
        [int]$PSTestsPassed = 0,
        [int]$PSTestsFailed = 0,
        [int]$JSTestCount = 0,
        [int]$JSTestsPassed = 0,
        [int]$JSTestsFailed = 0
    )

    if ($useVisuals) {
        # Use enhanced visual summary
        Show-VisualTestSummary -PSTestsSuccess $PSTestsSuccess -JSTestsSuccess $JSTestsSuccess `
                              -PSTestCount $PSTestCount -PSTestsPassed $PSTestsPassed -PSTestsFailed $PSTestsFailed `
                              -JSTestCount $JSTestCount -JSTestsPassed $JSTestsPassed -JSTestsFailed $JSTestsFailed `
                              -OutputPath $outputPath
    }
    else {
        # Use original text-based summary
        Write-Host "`n====== CyberCore Test Results ======" -ForegroundColor Cyan
        
        if (-not $JSOnly) {
            Write-Host "`nPowerShell Tests:" -ForegroundColor Cyan
            Write-Host "  Total: $PSTestCount" -ForegroundColor White
            Write-Host "  Passed: $PSTestsPassed" -ForegroundColor Green
            Write-Host "  Failed: $PSTestsFailed" -ForegroundColor $(if ($PSTestsFailed -gt 0) { "Red" } else { "Green" })
            Write-Host "  Status: " -NoNewline
            if ($PSTestsSuccess) {
                Write-Host "PASSED" -ForegroundColor Green
            } else {
                Write-Host "FAILED" -ForegroundColor Red
            }
        }
        
        if (-not $PSOnly) {
            Write-Host "`nJavaScript Tests:" -ForegroundColor Cyan
            Write-Host "  Total: $JSTestCount" -ForegroundColor White
            Write-Host "  Passed: $JSTestsPassed" -ForegroundColor Green
            Write-Host "  Failed: $JSTestsFailed" -ForegroundColor $(if ($JSTestsFailed -gt 0) { "Red" } else { "Green" })
            Write-Host "  Status: " -NoNewline
            if ($JSTestsSuccess) {
                Write-Host "PASSED" -ForegroundColor Green
            } else {
                Write-Host "FAILED" -ForegroundColor Red
            }
        }
        
        Write-Host "`nOverall Status: " -NoNewline
        $overallSuccess = ($PSOnly -or $JSTestsSuccess) -and ($JSOnly -or $PSTestsSuccess)
        if ($overallSuccess) {
            Write-Host "PASSED" -ForegroundColor Green
        } else {
            Write-Host "FAILED" -ForegroundColor Red
        }
        
        Write-Host "`nDetailed test results available in: $outputPath" -ForegroundColor Yellow
        Write-Host "======================================`n" -ForegroundColor Cyan
    }
}

# Check if Verbose parameter was provided
$isVerbose = $PSCmdlet.MyInvocation.BoundParameters.ContainsKey('Verbose')

# Run PowerShell tests
$psSuccess = $true
$psResults = $null
$psTestCount = 0
$psTestsPassed = 0
$psTestsFailed = 0

if (-not $JSOnly) {
    if ($useVisuals) {
        Update-TestProgress -TestType PS -TotalTests 0 -CompletedTests 0 -PassedTests 0 -FailedTests 0
    } else {
        Write-Host "`n========== Running PowerShell Tests ==========" -ForegroundColor Cyan
    }
    
    # Import quantum functions module first
    Import-Module -Name (Join-Path -Path $scriptPath -ChildPath "QuantumFunctions.psm1") -Force
    
    # Import test configuration module
    Import-Module -Name (Join-Path -Path $scriptPath -ChildPath "tests\PSTestConfig.psm1") -Force
    
    # Initialize test configuration - now using VerboseOutput instead of Verbose
    $psTestConfig = Initialize-PSTestConfiguration -TestPaths $testPaths -OutputPath $outputPath -VerboseOutput:$isVerbose
    
    # Create a special event subscriber to monitor test progress if visuals are enabled
    if ($useVisuals) {
        # Create a custom event to track test progress
        # Instead of using PSSerializer events which don't exist
        try {
            # Use a script scope variable to track progress
            $script:testProgressData = @{
                TotalCount = 0
                Completed = 0
                Passed = 0
                Failed = 0
                Skipped = 0
            }
            
            # We'll leverage our existing visual progress module instead of event subscribers
            Write-Host "PowerShell tests starting..." -ForegroundColor Cyan
        }
        catch {
            Write-Warning "Could not initialize test progress tracking: $_"
        }
    }
    
    # Run tests
    try {
        if (-not $useVisuals) {
            Write-Host "Running CyberCore PowerShell tests..." -ForegroundColor Yellow
        }
        $psResults = Invoke-PSTests -PSTestConfiguration $psTestConfig
        $psSuccess = $psResults.FailedCount -eq 0
        
        # Update visual progress with final results if needed
        if ($useVisuals) {
            $psTestCount = $psResults.TotalCount
            $psTestsPassed = $psResults.PassedCount
            $psTestsFailed = $psResults.FailedCount
            Update-TestProgress -TestType PS -TotalTests $psTestCount -CompletedTests $psTestCount -PassedTests $psTestsPassed -FailedTests $psTestsFailed -Complete
        }
    }
    catch {
        Write-Host "Error running PowerShell tests: $_" -ForegroundColor Red
        $psSuccess = $false
    }
}

# Run JavaScript tests
$jsSuccess = $true
$jsTestCount = 0
$jsTestsPassed = 0
$jsTestsFailed = 0

if (-not $PSOnly) {
    if ($useVisuals) {
        Update-TestProgress -TestType JS -TotalTests 0 -CompletedTests 0 -PassedTests 0 -FailedTests 0
    } else {
        Write-Host "`n========== Running JavaScript Tests ==========" -ForegroundColor Cyan
    }
    
    # Check npm version
    $npmVersion = npm --version
    if (-not $useVisuals) {
        Write-Host "npm version: $npmVersion" -ForegroundColor Yellow
    }
    
    # Run Jest tests
    try {
        if (-not $useVisuals) {
            Write-Host "Running Jest tests..." -ForegroundColor Yellow
        }
        
        $jestArgs = @()
        if (-not $SkipCoverage) {
            $jestArgs += "--coverage"
        }
        
        # Add json output to parse progress
        if ($useVisuals) {
            $jestArgs += "--json"
        }
        
        if (-not $useVisuals) {
            Write-Host "Executing: npx jest $jestArgs" -ForegroundColor Yellow
        }
        
        # Execute Jest in a background job to capture output progressively
        $job = Start-Job -ScriptBlock {
            param($workingDir, $jestArgs)
            Set-Location $workingDir
            # Capture stderr too
            $output = & npx jest $jestArgs 2>&1
            return $output
        } -ArgumentList $PWD, $jestArgs
        
        # Poll the job for output to update progress
        $jestOutput = @()
        $completeOutput = $false
        
        while (-not $completeOutput) {
            $jobStatus = $job | Get-Job
            
            if ($jobStatus.State -eq "Completed") {
                $newOutput = $job | Receive-Job
                $jestOutput += $newOutput
                $completeOutput = $true
            }
            else {
                $newOutput = $job | Receive-Job
                if ($newOutput) {
                    $jestOutput += $newOutput
                    
                    # Parse the output for progress information if visuals are enabled
                    if ($useVisuals) {
                        try {
                            # First try to parse JSON output
                            $jsonOutput = $newOutput | Where-Object { $_ -match '^\s*{' } | ForEach-Object { $_ | ConvertFrom-Json -ErrorAction SilentlyContinue }
                            
                            if ($jsonOutput -and $jsonOutput.numTotalTests) {
                                $jsTestCount = $jsonOutput.numTotalTests
                                $jsTestsPassed = $jsonOutput.numPassedTests
                                $jsTestsFailed = $jsonOutput.numFailedTests
                                $jsTestsCompleted = $jsTestsPassed + $jsTestsFailed
                                
                                Update-TestProgress -TestType JS -TotalTests $jsTestCount -CompletedTests $jsTestsCompleted -PassedTests $jsTestsPassed -FailedTests $jsTestsFailed
                            }
                        }
                        catch {
                            # Fallback to regex parsing if JSON parsing fails
                            $parsedResults = Parse-JestOutput -JestOutput $newOutput
                            
                            if ($parsedResults.TestsTotal -gt 0) {
                                $jsTestCount = $parsedResults.TestsTotal
                                $jsTestsPassed = $parsedResults.TestsPassed
                                $jsTestsFailed = $parsedResults.TestsFailed
                                $jsTestsCompleted = $jsTestsPassed + $jsTestsFailed
                                
                                Update-TestProgress -TestType JS -TotalTests $jsTestCount -CompletedTests $jsTestsCompleted -PassedTests $jsTestsPassed -FailedTests $jsTestsFailed
                            }
                        }
                    }
                }
                
                # Small delay to prevent hammering the CPU
                Start-Sleep -Milliseconds 100
            }
        }
        
        # Remove the job
        $job | Remove-Job -Force
        
        # Parse final output for test results
        if ($jestOutput -match "Test Suites:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $jsTestsFailed = [int]$Matches[1]
            $jsTestsPassed = [int]$Matches[2]
            $jsTestCount = [int]$Matches[3]
        }
        elseif ($jestOutput -match "Test Suites:\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $jsTestsFailed = 0
            $jsTestsPassed = [int]$Matches[1]
            $jsTestCount = [int]$Matches[2]
        }
        
        # Update counts based on test data parsing
        if ($jestOutput -match "Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $jsTestsFailed = [int]$Matches[1]
            $jsTestsPassed = [int]$Matches[2]
            $jsTestCount = [int]$Matches[3]
        }
        elseif ($jestOutput -match "Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $jsTestsFailed = 0
            $jsTestsPassed = [int]$Matches[1]
            $jsTestCount = [int]$Matches[2]
        }
        
        $jsSuccess = $jsTestsFailed -eq 0
        
        # Update visual progress with final results if needed
        if ($useVisuals) {
            Update-TestProgress -TestType JS -TotalTests $jsTestCount -CompletedTests $jsTestCount -PassedTests $jsTestsPassed -FailedTests $jsTestsFailed -Complete
        }
        else {
            # Echo the output
            $jestOutput | ForEach-Object { Write-Host $_ }
        }
    }
    catch {
        Write-Host "Error running JavaScript tests: $_" -ForegroundColor Red
        $jsSuccess = $false
    }
}

# Show summary
if (-not $JSOnly -and $psResults) {
    $psTestCount = $psResults.TotalCount
    $psTestsPassed = $psResults.PassedCount
    $psTestsFailed = $psResults.FailedCount
} 

Show-Summary -PSTestsSuccess $psSuccess -JSTestsSuccess $jsSuccess -PSTestCount $psTestCount -PSTestsPassed $psTestsPassed -PSTestsFailed $psTestsFailed -JSTestCount $jsTestCount -JSTestsPassed $jsTestsPassed -JSTestsFailed $jsTestsFailed

# Determine exit code based on test results
$exitCode = 0
if (-not (($PSOnly -or $jsSuccess) -and ($JSOnly -or $psSuccess))) {
    $exitCode = 1
}

exit $exitCode