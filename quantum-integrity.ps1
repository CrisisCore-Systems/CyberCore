# CYBERCORE QUANTUM INTEGRITY v1.0
# Validates quantum integrity of files against registry data

param(
    [string]$TargetDir = ".",
    
    [ValidateSet("All", "CyberLotus", "ObsidianBloom", "VoidBloom", "NeonVortex")]
    [string]$MutationProfile = "All",
    
    [switch]$Force,
    
    [switch]$CreateBackups,
    
    [string]$BackupDir = "./quantum-backups"
)

# Create QuantumRegistry class directly
class QuantumRegistry {
    static [hashtable] $Artifacts = @{}
    static [string] $RegistryPath = "./config/quantum-registry.json"
    
    static [void] UpdateRegistry([string]$file, [string]$hash, [string]$type, [string[]]$mutationCompatible) {
        [QuantumRegistry]::Artifacts[$file] = @{
            Hash = $hash
            Type = $type
            Created = [DateTime]::Now.ToString("o")
            MutationCompatible = $mutationCompatible
        }
        
        # Save registry
        $regPath = [QuantumRegistry]::RegistryPath 
        [QuantumRegistry]::Artifacts | ConvertTo-Json -Depth 3 | Set-Content $regPath
    }
}

# Define patterns for files to exclude from unregistered reporting
$excludedPatterns = @('*.ps1','*.json','config/*')

# Define mutation markers
$MutationMarkers = @{
    CyberLotus = "// CyberLotus Quantum Profile //"
    ObsidianBloom = "// ObsidianBloom Quantum Profile //"
    VoidBloom = "// VoidBloom Quantum Profile //"
    NeonVortex = "// NeonVortex Quantum Profile //"
}

# Initialize environment
Write-Host "`n===== QUANTUM INTEGRITY CHECK v1.0 =====" -ForegroundColor Cyan
Write-Host "[Target Directory: $TargetDir]" -ForegroundColor Yellow
Write-Host "[Mutation Profile: $MutationProfile]" -ForegroundColor Yellow
Write-Host "[Force Mode: $(if ($Force) { 'Enabled' } else { 'Disabled' })]" -ForegroundColor Yellow
Write-Host "[Backups: $(if ($CreateBackups) { 'Enabled' } else { 'Disabled' })]" -ForegroundColor Yellow

# Ensure backup directory exists if needed
if ($CreateBackups) {
    if (!(Test-Path $BackupDir)) {
        New-Item -Path $BackupDir -ItemType Directory -Force | Out-Null
        Write-Host "[Created backup directory: $BackupDir]" -ForegroundColor Green
    }
    
    # Create timestamped backup folder
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupTimestampDir = Join-Path $BackupDir $timestamp
    New-Item -Path $backupTimestampDir -ItemType Directory -Force | Out-Null
    Write-Host "[Backup will be stored in: $backupTimestampDir]" -ForegroundColor Green
}

# Load artifact registry from file
if (Test-Path "./config/quantum-registry.json") {
    try {
        $registryData = Get-Content "./config/quantum-registry.json" -Raw | ConvertFrom-Json
        [QuantumRegistry]::Artifacts = @{}
        
        foreach ($prop in $registryData.PSObject.Properties) {
            [QuantumRegistry]::Artifacts[$prop.Name] = @{
                Hash = $prop.Value.Hash
                Type = $prop.Value.Type
                Created = $prop.Value.Created
                MutationCompatible = $prop.Value.MutationCompatible
            }
        }
        
        Write-Host "[Registry loaded with $([QuantumRegistry]::Artifacts.Count) artifacts]" -ForegroundColor Green
    }
    catch {
        Write-Host "[Failed to load quantum registry: $($_.Exception.Message)]" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "[Quantum registry not found at ./config/quantum-registry.json]" -ForegroundColor Red
    exit 1
}

# Load nonce registry
$nonceRegistry = $null
if (Test-Path "./config/nonce-registry.json") {
    try {
        $nonceRegistry = Get-Content "./config/nonce-registry.json" -Raw | ConvertFrom-Json
        Write-Host "[Nonce registry loaded]" -ForegroundColor Green
    }
    catch {
        Write-Host "[Failed to load nonce registry: $($_.Exception.Message)]" -ForegroundColor Red
    }
}

# Determine which mode to run in
if ($Force) {
    # Repair mode - check files against registry and repair
    $filesToCheck = @()
    if ($MutationProfile -eq "All") {
        $filesToCheck = [QuantumRegistry]::Artifacts.Keys
    }
    else {
        # Filter by mutation profile
        foreach ($file in [QuantumRegistry]::Artifacts.Keys) {
            $compatible = [QuantumRegistry]::Artifacts[$file].MutationCompatible
            if ($compatible -contains $MutationProfile) {
                $filesToCheck += $file
            }
        }
    }
    
    Write-Host "`n[Found $($filesToCheck.Count) files to check]" -ForegroundColor Green

    # Initialize repair report
    $repairReport = @{
        Summary = @{
            FilesChecked = 0
            FilesRepaired = 0
            FilesBackedUp = 0
            IntegrityErrors = 0
            TimeStamp = Get-Date -Format "o"
        }
        Actions = @()
        RepairActions = @{
            SignatureFixed = 0
            MutationMarkerAdded = 0
            NonceAdded = 0
            ContentRestored = 0
            FileRecreated = 0
        }
    }
    
    # Process files
    $fileCount = 0
    $progressParams = @{
        Activity = "Quantum Integrity Repair"
        Status = "Processing files"
        PercentComplete = 0
    }
    
    foreach ($file in $filesToCheck) {
        $fileCount++
        $progressParams.PercentComplete = [math]::Min(100, [math]::Floor(($fileCount / $filesToCheck.Count) * 100))
        $progressParams.Status = "Processing file $fileCount of $($filesToCheck.Count): $file"
        Write-Progress @progressParams
        
        $repairReport.Summary.FilesChecked++
        $repaired = $false
        $fileType = [System.IO.Path]::GetExtension($file).TrimStart('.').ToLower()
        $isRegistered = $true
        
        # Check if file exists
        if (-not (Test-Path $file)) {
            Write-Host "[Missing] $file" -ForegroundColor Red
            $repairReport.Summary.IntegrityErrors++
            
            # Recreate file if it's a known template
            $templateContent = $null
            
            # Try to determine the basic content type
            switch ($fileType) {
                "liquid" {
                    if ($file -match '/snippets/') {
                        $profileValue = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'All' }
                        $profileMarker = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'CyberLotus' }
                        $templateContent = "{% comment %}`n@MutationCompatible: $profileValue`n@StrategyProfile: quantum-entangled`n{% endcomment %}`n`n// Generated by CyberCore Quantum Forge v3.0.0 //`n// Reconstructed by Quantum Integrity v1.0 //`n`n{% if EnableGlitchEffects %}`n<div class='quantum-wrapper' data-mutation-profile='$profileMarker'>`n  <!-- Quantum element reconstructed -->`n</div>`n{% endif %}"
                    }
                    elseif ($file -match '/sections/') {
                        $profileValue = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'All' }
                        $profileMarker = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'CyberLotus' }
                        $schemaContent = @'
{% schema %}
{
  "name": "Quantum Section",
  "settings": [
    {
      "type": "checkbox",
      "id": "enable_glitch",
      "label": "Enable Glitch Effects",
      "default": true
    }
  ]
}
{% endschema %}
'@
                        $templateContent = "{% comment %}`n@MutationCompatible: $profileValue`n@StrategyProfile: quantum-entangled`n{% endcomment %}`n`n// Generated by CyberCore Quantum Forge v3.0.0 //`n// Reconstructed by Quantum Integrity v1.0 //`n`n<section class='quantum-section' data-mutation-profile='$profileMarker'>`n  <!-- Quantum section reconstructed -->`n</section>`n`n$schemaContent"
                    }
                }
                "js" {
                    $profileValue = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'All' }
                    $templateContent = "/**`n * Reconstructed JavaScript file`n * @MutationCompatible: $profileValue`n * @StrategyProfile: quantum-entangled`n */`n// Generated by CyberCore Quantum Forge v3.0.0 //`n// Reconstructed by Quantum Integrity v1.0 //`n`n// Base reconstruction - implement functionality`n"
                    
                    if ($file -match 'neural-bus\.js') {
                        $templateContent += "`nexport class NeuralBus {`n  static #subscribers = new Map();`n  static #nonce = null;`n  `n  static initialize(options = {}) {`n    console.log('NeuralBus initialized');`n    return true;`n  }`n  `n  static publish(event, data) {`n    const subscribers = this.#subscribers.get(event) || [];`n    subscribers.forEach(callback => {`n      try {`n        callback(data);`n      } catch (e) {`n        console.error('NeuralBus subscriber error:', e);`n      }`n    });`n  }`n  `n  static subscribe(event, callback) {`n    if (!this.#subscribers.has(event)) {`n      this.#subscribers.set(event, []);`n    }`n    this.#subscribers.get(event).push(callback);`n    `n    return {`n      unsubscribe: () => {`n        const subs = this.#subscribers.get(event) || [];`n        const index = subs.indexOf(callback);`n        if (index !== -1) {`n          subs.splice(index, 1);`n        }`n      }`n    };`n  }`n}`n"
                    }
                }
                "css" {
                    $profileValue = if ($MutationProfile -ne 'All') { $MutationProfile } else { 'All' }
                    $templateContent = "/**`n * Reconstructed CSS file`n * @MutationCompatible: $profileValue`n * @StrategyProfile: quantum-entangled`n */`n/* Generated by CyberCore Quantum Forge v3.0.0 */`n/* Reconstructed by Quantum Integrity v1.0 */`n`n:root {`n  --glitch-intensity: 0.5;`n  --quantum-hue: 240deg;`n}`n`n/* Base reconstruction - implement styles */`n"
                }
                default {
                    $templateContent = "// Reconstructed file ($fileType)`n// Generated by Quantum Integrity v1.0`n// WARNING: This is a placeholder. Manual reconstruction required.`n"
                }
            }
            
            if ($templateContent -ne $null) {
                # Ensure parent directory exists
                $parentDir = Split-Path $file -Parent
                if (-not (Test-Path $parentDir)) {
                    New-Item -Path $parentDir -ItemType Directory -Force | Out-Null
                }
                
                # Create file
                Set-Content -Path $file -Value $templateContent -Encoding UTF8 -NoNewline
                
                # Update registry
                $newHash = (Get-FileHash $file -Algorithm SHA256).Hash
                $mutationList = if ($MutationProfile -ne 'All') { @($MutationProfile) } else { @('CyberLotus') }
                [QuantumRegistry]::UpdateRegistry($file, $newHash, $fileType, $mutationList)
                
                $repairReport.Actions += @{
                    File = $file
                    Action = "Recreated"
                    Details = "File was missing and has been recreated with a basic template"
                }
                
                $repairReport.RepairActions.FileRecreated++
                $repaired = $true
                Write-Host "[Recreated] $file" -ForegroundColor Green
            }
            else {
                Write-Host "[Cannot Recreate] $file - No template available" -ForegroundColor Yellow
            }
            
            continue
        }
        
        # Backup file if needed
        if ($CreateBackups) {
            $relativePath = $file.TrimStart('.').TrimStart('/')
            $backupFile = Join-Path $backupTimestampDir $relativePath
            $backupDir = Split-Path $backupFile -Parent
            
            if (!(Test-Path $backupDir)) {
                New-Item -Path $backupDir -ItemType Directory -Force | Out-Null
            }
            
            Copy-Item $file $backupFile -Force
            $repairReport.Summary.FilesBackedUp++
        }
        
        # Check file integrity
        $currentHash = (Get-FileHash $file -Algorithm SHA256).Hash
        $registeredHash = [QuantumRegistry]::Artifacts[$file].Hash
        $compatible = [QuantumRegistry]::Artifacts[$file].MutationCompatible
        
        if ($currentHash -ne $registeredHash) {
            Write-Host "[Integrity Error] $file" -ForegroundColor Red
            $repairReport.Summary.IntegrityErrors++
            
            # Read file content
            $content = Get-Content $file -Raw
            $modified = $false
            
            # Check and fix signature
            if (-not ($content -match "// Generated by")) {
                $signature = "// Generated by CyberCore Quantum Forge v3.0.0 //"
                
                if ($fileType -eq "liquid") {
                    if ($content -match "{% comment %}") {
                        $content = $content -replace "{% comment %}", "{% comment %}`n$signature"
                    }
                    else {
                        $content = "{% comment %}`n$signature`n{% endcomment %}`n`n$content"
                    }
                }
                elseif ($fileType -eq "js") {
                    if ($content -match "/\*\*") {
                        $content = $content -replace "/\*\*", "/**`n$signature"
                    }
                    else {
                        $content = "/**`n * $signature`n */`n$content"
                    }
                }
                else {
                    $content = "$signature`n$content"
                }
                
                $modified = $true
                $repairReport.RepairActions.SignatureFixed++
                $repairReport.Actions += @{
                    File = $file
                    Action = "SignatureFixed"
                    Details = "Added missing quantum signature"
                }
            }
            
            # Check and fix mutation compatibility markers
            if (-not ($content -match "@MutationCompatible:")) {
                $compatibilityStr = "@MutationCompatible: " + ($compatible -join ", ")
                
                if ($fileType -eq "liquid") {
                    if ($content -match "{% comment %}") {
                        $content = $content -replace "{% comment %}", "{% comment %}`n$compatibilityStr"
                    }
                    else {
                        $content = "{% comment %}`n$compatibilityStr`n{% endcomment %}`n`n$content"
                    }
                }
                elseif ($fileType -eq "js") {
                    if ($content -match "/\*\*") {
                        $content = $content -replace "/\*\*", "/**`n * $compatibilityStr"
                    }
                    else {
                        $content = "/**`n * $compatibilityStr`n */`n$content"
                    }
                }
                else {
                    $content = "// $compatibilityStr`n$content"
                }
                
                $modified = $true
                $repairReport.RepairActions.MutationMarkerAdded++
                $repairReport.Actions += @{
                    File = $file
                    Action = "MutationMarkerAdded"
                    Details = "Added mutation compatibility marker"
                }
            }
            
            # Check and fix CSP nonce in script tags for liquid files
            if ($fileType -eq "liquid" -and $content -match "<script" -and -not ($content -match "nonce=")) {
                # Default nonce placeholder
                $noncePlaceholder = "{{ csp_nonce }}"
                
                # Try to detect if a different nonce variable is used in the theme
                if ($content -match 'nonce=["'']{{([^}]+)}}["'']') {
                    $noncePlaceholder = "{{ $($matches[1]) }}"
                }
                
                # Replace script tags without nonce
                $content = $content -replace "<script([^>]*)>", "<script`$1 nonce='$noncePlaceholder'>"
                
                $modified = $true
                $repairReport.RepairActions.NonceAdded++
                $repairReport.Actions += @{
                    File = $file
                    Action = "NonceAdded"
                    Details = "Added CSP nonce to script tags"
                }
            }
            
            # Apply mutation profile marker if needed
            if ($MutationProfile -ne "All" -and $compatible -contains $MutationProfile) {
                $marker = $MutationMarkers[$MutationProfile]
                
                if ($marker -and -not ($content -match [regex]::Escape($marker))) {
                    # Add mutation marker based on file type
                    if ($fileType -eq "liquid") {
                        $content = "$content`n`n$marker"
                    }
                    elseif ($fileType -eq "js") {
                        $content = "$content`n`n$marker"
                    }
                    else {
                        $content = "$content`n$marker"
                    }
                    
                    $modified = $true
                    $repairReport.Actions += @{
                        File = $file
                        Action = "MutationMarkerAdded"
                        Details = "Added $MutationProfile mutation marker"
                    }
                }
            }
            
            # Save changes if modified
            if ($modified) {
                Set-Content -Path $file -Value $content -Encoding UTF8 -NoNewline
                
                # Update hash in registry
                $newHash = (Get-FileHash $file -Algorithm SHA256).Hash
                [QuantumRegistry]::UpdateRegistry($file, $newHash, $fileType, $compatible)
                
                $repaired = $true
                $repairReport.Summary.FilesRepaired++
                Write-Host "[Repaired] $file" -ForegroundColor Green
            }
        }
        
        if (-not $repaired) {
            Write-Host "[OK] $file" -ForegroundColor Green
        }
    }
    
    Write-Progress -Activity "Quantum Integrity Repair" -Completed
    
    # Save registry changes
    $registryPath = "./config/quantum-registry.json"
    [QuantumRegistry]::Artifacts | ConvertTo-Json -Depth 3 | Set-Content $registryPath
    
    # Display repair summary
    Write-Host "`n[QUANTUM INTEGRITY REPAIR COMPLETE]" -ForegroundColor Green
    Write-Host "`nSummary:" -ForegroundColor Cyan
    Write-Host "- Files Checked: $($repairReport.Summary.FilesChecked)" -ForegroundColor White
    Write-Host "- Files Repaired: $($repairReport.Summary.FilesRepaired)" -ForegroundColor $(if ($repairReport.Summary.FilesRepaired -gt 0) { "Yellow" } else { "Green" })
    Write-Host "- Files Backed Up: $($repairReport.Summary.FilesBackedUp)" -ForegroundColor White
    Write-Host "- Integrity Errors: $($repairReport.Summary.IntegrityErrors)" -ForegroundColor $(if ($repairReport.Summary.IntegrityErrors -gt 0) { "Red" } else { "Green" })
    
    if ($repairReport.RepairActions.SignatureFixed -gt 0 -or 
        $repairReport.RepairActions.MutationMarkerAdded -gt 0 -or
        $repairReport.RepairActions.NonceAdded -gt 0 -or
        $repairReport.RepairActions.ContentRestored -gt 0 -or
        $repairReport.RepairActions.FileRecreated -gt 0) {
        
        Write-Host "`nRepair Actions:" -ForegroundColor Cyan
        
        if ($repairReport.RepairActions.SignatureFixed -gt 0) {
            Write-Host "- Fixed Missing Signatures: $($repairReport.RepairActions.SignatureFixed)" -ForegroundColor Yellow
        }
        
        if ($repairReport.RepairActions.MutationMarkerAdded -gt 0) {
            Write-Host "- Added Mutation Markers: $($repairReport.RepairActions.MutationMarkerAdded)" -ForegroundColor Yellow
        }
        
        if ($repairReport.RepairActions.NonceAdded -gt 0) {
            Write-Host "- Added CSP Nonce: $($repairReport.RepairActions.NonceAdded)" -ForegroundColor Yellow
        }
        
        if ($repairReport.RepairActions.ContentRestored -gt 0) {
            Write-Host "- Restored Content: $($repairReport.RepairActions.ContentRestored)" -ForegroundColor Yellow
        }
        
        if ($repairReport.RepairActions.FileRecreated -gt 0) {
            Write-Host "- Recreated Files: $($repairReport.RepairActions.FileRecreated)" -ForegroundColor Yellow
        }
    }
    
    # Provide recommendations
    Write-Host "`nNext Steps:" -ForegroundColor Yellow
    Write-Host "- Run 'quantum-inspector.ps1' to verify repairs" -ForegroundColor White
    Write-Host "- Run 'Invoke-QuantumMutation.ps1' to test with repaired components" -ForegroundColor White
    
    if ($repairReport.RepairActions.FileRecreated -gt 0) {
        Write-Host "- Review and update recreated files with proper content" -ForegroundColor White
    }
}
else {
    # Check mode - only validate file integrity
    # Run the integrity check
    $breaches = @()
    $verifiedCount = 0
    $unregisteredCount = 0
    $unregisteredFiles = @()
    
    Get-ChildItem -Recurse -File | ForEach-Object {
        # Skip the integrity check script itself
        if ($_.Name -eq "quantum-integrity.ps1") { return }
    
        $fullPath = $_.FullName
        $relativePath = "./$($_.FullName.Substring($PWD.Path.Length + 1).Replace('\', '/'))"
        
        # Check if file is in registry
        if ([QuantumRegistry]::Artifacts.ContainsKey($relativePath)) {
            $storedHash = [QuantumRegistry]::Artifacts[$relativePath].Hash
            $currentHash = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
            
            if ($storedHash -ne $currentHash) {
                Write-Host "[Quantum breach detected in $($_.Name)!]" -ForegroundColor Red
                $breaches += @{
                    Name = $_.Name
                    Path = $relativePath
                    StoredHash = $storedHash
                    CurrentHash = $currentHash
                }
            }
            else {
                $verifiedCount++
            }
        }
        else {
            # Check if file matches any excluded pattern
            $excluded = $false
            foreach ($pattern in $excludedPatterns) {
                if ($relativePath -like $pattern) {
                    $excluded = $true
                    break
                }
            }
            
            if (-not $excluded) {
                # File exists but not in registry - could be new or unauthorized
                $unregisteredCount++
                $unregisteredFiles += $relativePath
                Write-Host "[Unregistered quantum file: $($_.Name)]" -ForegroundColor Yellow
            }
        }
    }
    
    # Report results
    Write-Host "`n===== QUANTUM INTEGRITY REPORT =====" -ForegroundColor Cyan
    Write-Host "[Verified Files: $verifiedCount]" -ForegroundColor Green
    Write-Host "[Quantum Breaches: $($breaches.Count)]" -ForegroundColor $(if ($breaches.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "[Unregistered Files: $unregisteredCount]" -ForegroundColor Yellow
    
    if ($breaches.Count -gt 0) {
        Write-Host "`n[Breached files:]" -ForegroundColor Red
        $breaches | ForEach-Object { 
            Write-Host "  - $($_.Name)" -ForegroundColor Red
            Write-Host "    Expected: $($_.StoredHash.Substring(0, 10))..." -ForegroundColor DarkGray
            Write-Host "    Actual:   $($_.CurrentHash.Substring(0, 10))..." -ForegroundColor DarkGray
        }
        
        Write-Host "`n[Recommendation: Run quantum-integrity.ps1 -Force to repair breaches]" -ForegroundColor Yellow
    }
    else {
        # Show unregistered files if there are any
        if ($unregisteredFiles.Count -gt 0) {
            Write-Host "`n[Unregistered files:]" -ForegroundColor Yellow
            $unregisteredFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
        }
        
        Write-Host "`n[QUANTUM MATRIX INTEGRITY VERIFIED]" -ForegroundColor Green
    }
}

exit 0