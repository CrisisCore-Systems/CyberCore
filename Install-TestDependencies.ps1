# Node ecosystem dependencies
function Install-NodeDependencies {
    Write-Host "█ Installing Node test dependencies..." -ForegroundColor Cyan
    
    # Install required packages with exact versions for deterministic builds
    npm install --save-dev jest@29.7.0 @babel/core@7.24.0 @babel/preset-env@7.24.0 babel-jest@29.7.0 chai@4.3.4 sinon@17.0.1 sinon-chai@3.7.0
    
    # Install plugins for private class fields and methods
    npm install --save-dev @babel/plugin-proposal-private-methods@7.18.6 @babel/plugin-proposal-class-properties@7.18.6 @babel/plugin-proposal-private-property-in-object@7.21.0 --legacy-peer-deps
    
    Write-Host "█ Node dependencies installed successfully." -ForegroundColor Green
}

# PowerShell ecosystem dependencies
function Install-PSModules {
    Write-Host "█ Installing PowerShell test dependencies..." -ForegroundColor Cyan
    
    # Check if Pester v5 is already installed
    $pesterModule = Get-Module -ListAvailable -Name Pester | 
                    Where-Object { $_.Version.Major -ge 5 } | 
                    Sort-Object Version -Descending | 
                    Select-Object -First 1
    
    if (-not $pesterModule) {
        Write-Host "█ Installing Pester v5..." -ForegroundColor Yellow
        Install-Module -Name Pester -Force -SkipPublisherCheck -MinimumVersion 5.0.0
        Import-Module Pester -MinimumVersion 5.0.0 -Force
    } else {
        Write-Host "█ Pester v$($pesterModule.Version) is already installed." -ForegroundColor Green
        Import-Module Pester -MinimumVersion 5.0.0 -Force
    }
    
    Write-Host "█ PowerShell dependencies installed successfully." -ForegroundColor Green
}

# Execute installations
Install-NodeDependencies
Install-PSModules