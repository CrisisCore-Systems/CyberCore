# CYBERCORE QUANTUM MUTATION TESTER v1.1
# Tests component compatibility with different mutation profiles
# Added support for quantum state persistence and temporal transitions

param(
    [Parameter(Mandatory)]
    [ValidateSet("CyberLotus", "ObsidianBloom", "VoidBloom", "NeonVortex")]
    [string]$Profile,
    
    [ValidateSet("Lenient", "Strict")]
    [string]$Validation = "Strict",
    
    [string]$TargetDir = "./mutation-test",
    
    [switch]$SkipCleanup,
    
    [switch]$EnableStateMemory,
    
    [int]$TemporalDepth = 3,
    
    [ValidateSet("None", "Echo", "Shadow", "Recursive")]
    [string]$MemoryType = "None"
)

# Import shared registry class
class QuantumRegistry {
    static [hashtable] $Artifacts = @{}
    static [string] $RegistryPath = "./config/quantum-registry.json"
}

# Mutation profiles configuration
$MutationProfiles = @{
    CyberLotus = @{
        StyleVariables = @{
            "--quantum-hue" = "240deg"
            "--glitch-intensity" = "0.7"
            "--neural-boost" = "enabled"
        }
        FeatureFlags = @{
            "EnableNeuralTransitions" = $true
            "UseQuantumParallax" = $true
            "EnableGlitchEffects" = $true
        }
    }
    ObsidianBloom = @{
        StyleVariables = @{
            "--quantum-hue" = "310deg"
            "--glitch-intensity" = "0.4"
            "--neural-boost" = "partial"
        }
        FeatureFlags = @{
            "EnableNeuralTransitions" = $true
            "UseQuantumParallax" = $false
            "EnableGlitchEffects" = $true
        }
    }
    VoidBloom = @{
        StyleVariables = @{
            "--quantum-hue" = "165deg"
            "--glitch-intensity" = "0.85"
            "--neural-boost" = "recursive"
            "--temporal-echo" = "0.6"
        }
        FeatureFlags = @{
            "EnableNeuralTransitions" = $true
            "UseQuantumParallax" = $true
            "EnableGlitchEffects" = $true
            "EnableTemporalEcho" = $true
            "EnableRecursivePatterns" = $true
        }
    }
    NeonVortex = @{
        StyleVariables = @{
            "--quantum-hue" = "85deg"
            "--glitch-intensity" = "0.6"
            "--neural-boost" = "amplified"
            "--vortex-strength" = "0.8"
        }
        FeatureFlags = @{
            "EnableNeuralTransitions" = $true
            "UseQuantumParallax" = $true
            "EnableGlitchEffects" = $true
            "EnableVortexField" = $true
        }
    }
}

# Initialize test environment
Write-Host "`n===== QUANTUM MUTATION TEST - $Profile =====" -ForegroundColor Cyan
Write-Host "[Validation Level: $Validation]" -ForegroundColor Yellow
Write-Host "[State Memory: $(if ($EnableStateMemory) { 'Enabled' } else { 'Disabled' })]" -ForegroundColor Yellow
if ($EnableStateMemory) {
    Write-Host "[Memory Type: $MemoryType | Temporal Depth: $TemporalDepth]" -ForegroundColor Yellow
}

# Create test directory
if (Test-Path $TargetDir) {
    Remove-Item $TargetDir -Recurse -Force
}
New-Item -Path $TargetDir -ItemType Directory -Force | Out-Null

# Load registry
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

# Filter compatible artifacts
$compatibleArtifacts = @()
$incompatibleArtifacts = @()

foreach ($artifact in [QuantumRegistry]::Artifacts.Keys) {
    $entry = [QuantumRegistry]::Artifacts[$artifact]
    
    if ($entry.MutationCompatible -contains $Profile) {
        $compatibleArtifacts += $artifact
    } else {
        $incompatibleArtifacts += $artifact
    }
}

Write-Host "`n[Mutation Compatibility Analysis]" -ForegroundColor Yellow
Write-Host "Compatible: $($compatibleArtifacts.Count)" -ForegroundColor Green
Write-Host "Incompatible: $($incompatibleArtifacts.Count)" -ForegroundColor $(if ($incompatibleArtifacts.Count -gt 0) { "Yellow" } else { "Green" })

if ($incompatibleArtifacts.Count -gt 0 -and $Validation -eq "Strict") {
    Write-Host "`n[MUTATION TEST BLOCKED: Incompatible artifacts detected]" -ForegroundColor Red
    $incompatibleArtifacts | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
    exit 1
}

# Prepare test environment
Write-Host "`n[Preparing mutation test environment...]" -ForegroundColor Yellow

# Copy all compatible artifacts
foreach ($artifact in $compatibleArtifacts) {
    $destPath = Join-Path $TargetDir $artifact
    $destDir = Split-Path $destPath -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -Path $destDir -ItemType Directory -Force | Out-Null
    }
    
    Copy-Item $artifact $destPath -Force
}

# Create profile-specific configuration
$profileConfig = @{
    MutationProfile = $Profile
    StyleVariables = $MutationProfiles[$Profile].StyleVariables
    FeatureFlags = $MutationProfiles[$Profile].FeatureFlags
    TestTimestamp = Get-Date -Format "o"
    StateMemory = @{
        Enabled = $EnableStateMemory
        Type = $MemoryType
        TemporalDepth = $TemporalDepth
        PreviousStates = @()
    }
}

# Check for previous mutation states if state memory is enabled
if ($EnableStateMemory) {
    # Path to store mutation state history
    $stateHistoryPath = "./config/mutation-state-history.json"
    
    if (Test-Path $stateHistoryPath) {
        try {
            $stateHistory = Get-Content $stateHistoryPath -Raw | ConvertFrom-Json
            
            # Add previous states up to the temporal depth
            $previousStates = @()
            for ($i = 0; $i -lt [Math]::Min($TemporalDepth, $stateHistory.Length); $i++) {
                $previousStates += $stateHistory[$i]
            }
            
            $profileConfig.StateMemory.PreviousStates = $previousStates
            Write-Host "[Loaded $($previousStates.Count) previous mutation states]" -ForegroundColor Green
        }
        catch {
            Write-Host "[Failed to load mutation state history: $($_.Exception.Message)]" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "[No previous mutation states found]" -ForegroundColor Yellow
    }
}

$configPath = Join-Path $TargetDir "config/mutation-profile.json"
$configDir = Split-Path $configPath -Parent

if (-not (Test-Path $configDir)) {
    New-Item -Path $configDir -ItemType Directory -Force | Out-Null
}

$profileConfig | ConvertTo-Json -Depth 5 | Set-Content $configPath

# Apply mutations to copied files
Write-Host "`n[Applying $Profile mutations...]" -ForegroundColor Yellow

$liquidFiles = Get-ChildItem -Path $TargetDir -Recurse -Include "*.liquid"
$jsFiles = Get-ChildItem -Path $TargetDir -Recurse -Include "*.js"
$mutationCount = 0

# Function to apply state memory effects
function Apply-StateMemoryEffects {
    param (
        [string]$content,
        [string]$memoryType,
        [array]$previousStates,
        [string]$fileExtension
    )
    
    if ($previousStates.Count -eq 0) {
        return $content
    }
    
    $modifiedContent = $content
    
    switch ($memoryType) {
        "Echo" {
            # Echo effect: Add comments with previous states
            if ($fileExtension -eq "liquid") {
                $echoComment = "{% comment %}`n/* TEMPORAL ECHO FROM PREVIOUS STATES */`n"
                foreach ($state in $previousStates) {
                    $echoComment += "/* $($state.Profile) at $($state.Timestamp) */`n"
                }
                $echoComment += "{% endcomment %}`n"
                $modifiedContent = $echoComment + $modifiedContent
            }
            elseif ($fileExtension -eq "js") {
                $echoComment = "/**`n * TEMPORAL ECHO FROM PREVIOUS STATES`n"
                foreach ($state in $previousStates) {
                    $echoComment += " * $($state.Profile) at $($state.Timestamp)`n"
                }
                $echoComment += " */`n"
                $modifiedContent = $echoComment + $modifiedContent
            }
        }
        "Shadow" {
            # Shadow effect: Add ghost variables from previous states
            foreach ($state in $previousStates) {
                $profile = $state.Profile
                
                if ($fileExtension -eq "liquid") {
                    # Add shadow CSS variables from previous states with reduced opacity
                    $shadowStyles = "`n{% if EnableTemporalEcho %}`n<style>`n"
                    $shadowStyles += "/* Shadow from $profile */`n"
                    $shadowStyles += ".quantum-shadow-$($profile.ToLower()) {`n"
                    foreach ($var in $MutationProfiles[$profile].StyleVariables.Keys) {
                        $value = $MutationProfiles[$profile].StyleVariables[$var]
                        $shadowStyles += "  $var-shadow: $value;`n"
                    }
                    $shadowStyles += "  opacity: calc(var(--temporal-echo, 0.3) * " + [math]::Pow(0.7, $previousStates.IndexOf($state)) + ");`n"
                    $shadowStyles += "}`n</style>`n{% endif %}`n"
                    
                    # Insert shadow styles near the top of the file
                    $modifiedContent = $modifiedContent -replace "(<body[^>]*>)", "`$1$shadowStyles"
                }
                elseif ($fileExtension -eq "js") {
                    # Add shadow properties for JS files
                    $shadowJS = "`n// Shadow state from $profile`n"
                    $shadowJS += "const ${profile}Shadow = " + ($state | ConvertTo-Json -Compress) + ";`n"
                    $shadowJS += "if (typeof window.quantumShadows === 'undefined') { window.quantumShadows = []; }`n"
                    $shadowJS += "window.quantumShadows.push(${profile}Shadow);`n"
                    
                    # Insert near the top of the file
                    $modifiedContent = $modifiedContent -replace "^((?:[^\n]*\n){5})", "`$1$shadowJS"
                }
            }
        }
        "Recursive" {
            # Recursive effect: Create nested pattern that changes based on previous states
            $patterns = @()
            foreach ($state in $previousStates) {
                $profile = $state.Profile
                $patterns += $profile.Substring(0, 3).ToLower()
            }
            
            if ($patterns.Count -gt 0) {
                $patternStr = $patterns -join "-"
                
                if ($fileExtension -eq "liquid") {
                    $recursivePattern = "`n{% if EnableRecursivePatterns %}`n"
                    $recursivePattern += "<div class='quantum-recursive-$patternStr' data-temporal-pattern='$patternStr'>`n"
                    $recursivePattern += "  <span class='quantum-echo'>Echo from $($previousStates.Count) previous states</span>`n"
                    $recursivePattern += "</div>`n{% endif %}`n"
                    
                    # Add pattern near the end of file but before closing tags
                    $modifiedContent = $modifiedContent -replace "(<\/body>)", "$recursivePattern`$1"
                }
                elseif ($fileExtension -eq "js") {
                    $recursiveJS = "`n// Recursive temporal pattern: $patternStr`n"
                    $recursiveJS += "function applyRecursivePattern() {`n"
                    $recursiveJS += "  const pattern = '$patternStr';`n"
                    $recursiveJS += "  const elements = document.querySelectorAll('.quantum-recursive-' + pattern);`n"
                    $recursiveJS += "  if (elements.length === 0 && document.body) {`n"
                    $recursiveJS += "    const div = document.createElement('div');`n"
                    $recursiveJS += "    div.className = 'quantum-recursive-' + pattern;`n"
                    $recursiveJS += "    div.dataset.temporalPattern = pattern;`n"
                    $recursiveJS += "    document.body.appendChild(div);`n"
                    $recursiveJS += "  }`n"
                    $recursiveJS += "}`n"
                    $recursiveJS += "if (document.readyState === 'complete') applyRecursivePattern();`n"
                    $recursiveJS += "else window.addEventListener('DOMContentLoaded', applyRecursivePattern);`n"
                    
                    # Add near end of file
                    $modifiedContent += $recursiveJS
                }
            }
        }
        default {
            # No memory effects
        }
    }
    
    return $modifiedContent
}

# Process Liquid files
foreach ($file in $liquidFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Detect mutation markers in files
    if ($content -match "@MutationCompatible:.*$Profile") {
        # Apply mutation-specific modifications
        $modifiedContent = $content
        
        # Replace mutation placeholders based on profile
        foreach ($var in $MutationProfiles[$Profile].StyleVariables.Keys) {
            $value = $MutationProfiles[$Profile].StyleVariables[$var]
            $modifiedContent = $modifiedContent -replace "{{$var}}", $value
        }
        
        # Apply feature flag conditional sections
        foreach ($flag in $MutationProfiles[$Profile].FeatureFlags.Keys) {
            $enabled = $MutationProfiles[$Profile].FeatureFlags[$flag]
            
            if ($enabled) {
                # Enable sections marked with this feature flag
                $modifiedContent = $modifiedContent -replace "{% if $flag %}(.*?){% endif %}", '$1'
            }
            else {
                # Remove sections marked with this feature flag
                $modifiedContent = $modifiedContent -replace "{% if $flag %}.*?{% endif %}", ''
            }
        }
        
        # Apply state memory effects if enabled
        if ($EnableStateMemory) {
            $modifiedContent = Apply-StateMemoryEffects -content $modifiedContent -memoryType $MemoryType `
                -previousStates $profileConfig.StateMemory.PreviousStates -fileExtension "liquid"
        }
        
        # Write modified content back
        Set-Content -Path $file.FullName -Value $modifiedContent -NoNewline
        $mutationCount++
    }
}

# Process JavaScript files
foreach ($file in $jsFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Detect mutation markers in files - JS files use /* @MutationCompatible: profiles */ format
    if ($content -match "/\*.*@MutationCompatible:.*$Profile") {
        # Apply mutation-specific modifications
        $modifiedContent = $content
        
        # Replace any mutation placeholders
        foreach ($var in $MutationProfiles[$Profile].StyleVariables.Keys) {
            $value = $MutationProfiles[$Profile].StyleVariables[$var]
            $modifiedContent = $modifiedContent -replace "{{$var}}", $value
        }
        
        # Apply feature flags as conditional code sections for JS
        foreach ($flag in $MutationProfiles[$Profile].FeatureFlags.Keys) {
            $enabled = $MutationProfiles[$Profile].FeatureFlags[$flag]
            
            # Enable or disable feature flag code blocks
            if ($enabled) {
                # Enable sections marked with this feature flag (using JS-style comments)
                $modifiedContent = $modifiedContent -replace "(/\* IF $flag \*/)([^\0]*?)(/\* END $flag \*/)", '$2'
            }
            else {
                # Remove sections marked with this feature flag
                $modifiedContent = $modifiedContent -replace "(/\* IF $flag \*/)([^\0]*?)(/\* END $flag \*/)", ''
            }
        }
        
        # Apply state memory effects if enabled
        if ($EnableStateMemory) {
            $modifiedContent = Apply-StateMemoryEffects -content $modifiedContent -memoryType $MemoryType `
                -previousStates $profileConfig.StateMemory.PreviousStates -fileExtension "js"
        }
        
        # Write modified content back
        Set-Content -Path $file.FullName -Value $modifiedContent -NoNewline
        $mutationCount++
    }
}

# Copy nonce registry
Copy-Item "./config/nonce-registry.json" -Destination (Join-Path $TargetDir "config/nonce-registry.json") -Force

# Update mutation state history if state memory is enabled
if ($EnableStateMemory) {
    $stateHistoryPath = "./config/mutation-state-history.json"
    $newState = @{
        Profile = $Profile
        Timestamp = Get-Date -Format "o"
        StyleVariables = $MutationProfiles[$Profile].StyleVariables
        FeatureFlags = $MutationProfiles[$Profile].FeatureFlags
    }
    
    $stateHistory = @()
    if (Test-Path $stateHistoryPath) {
        try {
            $stateHistory = Get-Content $stateHistoryPath -Raw | ConvertFrom-Json
            # Convert to array if it's not already
            if ($stateHistory -isnot [array]) {
                $stateHistory = @($stateHistory)
            }
        }
        catch {
            Write-Host "[Creating new mutation state history]" -ForegroundColor Yellow
            $stateHistory = @()
        }
    }
    
    # Add new state at beginning of array
    $stateHistory = @($newState) + $stateHistory
    
    # Keep only most recent states up to a maximum
    if ($stateHistory.Count -gt 10) {
        $stateHistory = $stateHistory[0..9]
    }
    
    # Save updated history
    $stateHistory | ConvertTo-Json -Depth 5 | Set-Content $stateHistoryPath
    Write-Host "[Updated mutation state history with $Profile]" -ForegroundColor Green
}

# Create test report
$testReport = @{
    Profile = $Profile
    TestedAt = Get-Date -Format "o"
    CompatibleArtifacts = $compatibleArtifacts.Count
    IncompatibleArtifacts = $incompatibleArtifacts.Count
    MutationsApplied = $mutationCount
    ValidationLevel = $Validation
    FeatureFlags = $MutationProfiles[$Profile].FeatureFlags
    StateMemory = if ($EnableStateMemory) {
        @{
            Enabled = $true
            Type = $MemoryType
            TemporalDepth = $TemporalDepth
            PreviousStatesCount = $profileConfig.StateMemory.PreviousStates.Count
        }
    } else {
        @{ Enabled = $false }
    }
}

$reportPath = Join-Path $TargetDir "mutation-test-report.json"
$testReport | ConvertTo-Json -Depth 5 | Set-Content $reportPath

# Test complete
Write-Host "`n[QUANTUM MUTATION TEST COMPLETE]" -ForegroundColor Green
Write-Host "[Profile: $Profile]" -ForegroundColor Cyan
Write-Host "[Mutations Applied: $mutationCount]" -ForegroundColor Cyan
Write-Host "[Test Environment: $TargetDir]" -ForegroundColor Cyan
Write-Host "[Test Report: $reportPath]" -ForegroundColor Cyan

# Suggest next steps
Write-Host "`n[Next Steps]" -ForegroundColor Yellow
Write-Host "- Verify mutation visually using test environment" -ForegroundColor White
Write-Host "- Run validation tests on mutated components" -ForegroundColor White
Write-Host "- Check feature flag behavior matches expectations" -ForegroundColor White

if ($EnableStateMemory) {
    Write-Host "- Verify state memory effects ($MemoryType) from previous profiles" -ForegroundColor White
}

if ($Profile -ne "VoidBloom") {
    Write-Host "- Try VoidBloom mutation profile with state memory:" -ForegroundColor White
    Write-Host "  ./Invoke-QuantumMutation.ps1 -Profile VoidBloom -EnableStateMemory -MemoryType Echo" -ForegroundColor White
}

# Cleanup
if (-not $SkipCleanup) {
    Write-Host "`n[Test environment will be removed on next run]" -ForegroundColor Yellow
    Write-Host "[Use -SkipCleanup to preserve test environment]" -ForegroundColor Yellow
}

exit 0