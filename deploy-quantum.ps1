# CYBERCORE QUANTUM DEPLOYMENT v1.0
# Secure deployment pipeline for CyberCore components

param(
    [Parameter(Mandatory)]
    [ValidateSet("Development", "Staging", "Production")]
    [string]$Env,
    
    [ValidateSet("Strict", "Lenient")]
    [string]$ConfirmPolicy = "Strict",
    
    [ValidateSet("Auto", "Manual")]
    [string]$NoncePolicy = "Auto",
    
    [switch]$ForceRebuild
)

# Import shared registry class
class QuantumRegistry {
    static [hashtable] $Artifacts = @{}
    static [string] $RegistryPath = "./config/quantum-registry.json"
}

# Deployment configuration
$DeploymentConfig = @{
    Development = @{
        TargetPath = "./deploy/dev"
        SecurityLevel = "Low"
        RequireIntegrityCheck = $false
    }
    Staging = @{
        TargetPath = "./deploy/staging"
        SecurityLevel = "Medium"
        RequireIntegrityCheck = $true
    }
    Production = @{
        TargetPath = "./deploy/prod"
        SecurityLevel = "High"
        RequireIntegrityCheck = $true
    }
}

# Initialize deployment
Write-Host "`n===== QUANTUM DEPLOYMENT - $Env =====" -ForegroundColor Cyan
Write-Host "[Configuration: $ConfirmPolicy confirmation, $NoncePolicy nonce rotation]" -ForegroundColor Yellow

# Verify deployment prerequisites
$prerequisites = @(
    @{ Check = { Test-Path './config/quantum-registry.json' }; Message = 'Missing quantum registry' },
    @{ Check = { Test-Path './config/nonce-registry.json' }; Message = 'Missing nonce registry' },
    @{ Check = { (Get-ChildItem -Path "./blueprints/*.json").Count -gt 0 }; Message = 'No blueprints found' },
    @{ Check = { Test-Path './quantum-forge.ps1' }; Message = 'Missing quantum forge script' }
)

$prerequisiteFailures = $prerequisites | Where-Object { -not (& $_.Check) } | ForEach-Object { $_.Message }
if ($prerequisiteFailures) {
    Write-Host "`n[DEPLOYMENT BLOCKED]" -ForegroundColor Red
    $prerequisiteFailures | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
    exit 1
}

# Run integrity check if required
if ($DeploymentConfig[$Env].RequireIntegrityCheck) {
    Write-Host "`n[Running quantum integrity check...]" -ForegroundColor Yellow
    & ./quantum-integrity.ps1
    
    if ($LASTEXITCODE -ne 0) {
        if ($ConfirmPolicy -eq "Strict") {
            Write-Host "`n[DEPLOYMENT BLOCKED: Integrity check failed]" -ForegroundColor Red
            exit 1
        } else {
            Write-Host "`n[WARNING: Proceeding despite integrity check failure]" -ForegroundColor Yellow
            
            $confirmation = Read-Host "Continue deployment with integrity issues? (y/N)"
            if ($confirmation -ne "y") {
                Write-Host "[Deployment aborted by user]" -ForegroundColor Red
                exit 1
            }
        }
    } else {
        Write-Host "[Integrity check passed]" -ForegroundColor Green
    }
}

# Rebuild if requested
if ($ForceRebuild) {
    Write-Host "`n[Rebuilding artifacts...]" -ForegroundColor Yellow
    & ./quantum-forge.ps1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[DEPLOYMENT BLOCKED: Rebuild failed]" -ForegroundColor Red
        exit 1
    }
}

# Handle nonce rotation
if ($NoncePolicy -eq "Auto") {
    Write-Host "`n[Rotating security nonces...]" -ForegroundColor Yellow
    $nonceRegistry = Get-Content "./config/nonce-registry.json" -Raw | ConvertFrom-Json
    
    if ($Env -ne "Development") {
        # Generate new nonce for target environment
        $newNonce = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 255 }))
        
        # Clone the PSCustomObject to a new mutable object
        $updatedRegistry = @{
            Development = $nonceRegistry.Development
            Staging = $nonceRegistry.Staging
            Production = $nonceRegistry.Production
        }
        
        # Update the appropriate environment
        $updatedRegistry[$Env] = $newNonce
        
        # Save updated registry
        $updatedRegistry | ConvertTo-Json | Set-Content "./config/nonce-registry.json"
        
        Write-Host "[Security nonce rotated for $Env environment]" -ForegroundColor Green
    } else {
        Write-Host "[Development environment uses static nonce - no rotation needed]" -ForegroundColor Yellow
    }
}

# Create deployment directory
$deployPath = $DeploymentConfig[$Env].TargetPath
if (-not (Test-Path $deployPath)) {
    New-Item -Path $deployPath -ItemType Directory -Force | Out-Null
}

# Create config directory in deployment path
$deployConfigPath = Join-Path $deployPath "config"
if (-not (Test-Path $deployConfigPath)) {
    New-Item -Path $deployConfigPath -ItemType Directory -Force | Out-Null
}

# Deploy artifacts
Write-Host "`n[Deploying quantum artifacts to $deployPath...]" -ForegroundColor Yellow

# Load registry
$registryData = Get-Content "./config/quantum-registry.json" -Raw | ConvertFrom-Json

# Copy artifacts to deployment directory
$deployedFiles = 0
$registryData.PSObject.Properties | ForEach-Object {
    $sourcePath = $_.Name
    $destPath = Join-Path $deployPath $sourcePath
    
    # Create directory structure
    $destDir = Split-Path $destPath -Parent
    if (-not (Test-Path $destDir)) {
        New-Item -Path $destDir -ItemType Directory -Force | Out-Null
    }
    
    # Copy file
    Copy-Item $sourcePath $destPath -Force
    $deployedFiles++
}

# Create deployment manifest
$manifestPath = Join-Path $deployPath "deployment-manifest.json"
$manifest = @{
    Environment = $Env
    DeployedAt = Get-Date -Format "o"
    SecurityLevel = $DeploymentConfig[$Env].SecurityLevel
    FileCount = $deployedFiles
    NoncePolicy = $NoncePolicy
    IntegrityVerified = ($DeploymentConfig[$Env].RequireIntegrityCheck -and $LASTEXITCODE -eq 0)
}

$manifest | ConvertTo-Json | Set-Content $manifestPath

# Copy configuration files
Copy-Item "./config/nonce-registry.json" -Destination (Join-Path $deployConfigPath "nonce-registry.json") -Force

# Deployment complete
Write-Host "`n[QUANTUM DEPLOYMENT COMPLETE]" -ForegroundColor Green
Write-Host "[Environment: $Env]" -ForegroundColor Cyan
Write-Host "[Files Deployed: $deployedFiles]" -ForegroundColor Cyan
Write-Host "[Security Level: $($DeploymentConfig[$Env].SecurityLevel)]" -ForegroundColor Cyan
Write-Host "[Deployment Manifest: $manifestPath]" -ForegroundColor Cyan

# Suggest next steps
Write-Host "`n[Next Steps]" -ForegroundColor Yellow
if ($Env -eq "Development") {
    Write-Host "- Preview the components using the development server" -ForegroundColor White
    Write-Host "- Once verified, deploy to staging: ./deploy-quantum.ps1 -Env Staging" -ForegroundColor White
} elseif ($Env -eq "Staging") {
    Write-Host "- Validate components in staging environment" -ForegroundColor White
    Write-Host "- Run mutation tests: Invoke-QuantumMutation -Profile CyberLotus" -ForegroundColor White
    Write-Host "- Once verified, deploy to production: ./deploy-quantum.ps1 -Env Production -ConfirmPolicy Strict" -ForegroundColor White
} else {
    Write-Host "- Verify deployment in production environment" -ForegroundColor White
    Write-Host "- Run security audit: Get-QuantumVulnerability -Checklist @('NonceEntropy','CSPDirectives')" -ForegroundColor White
}

exit 0