# CYBERCORE QUANTUM INSPECTOR v1.0
# Analyzes components for proper quantum integration and compatibility

param(
    [Parameter()]
    [string]$TargetDir = ".",
    
    [Parameter()]
    [ValidateSet("All", "CyberLotus", "ObsidianBloom", "VoidBloom", "NeonVortex")]
    [string]$MutationProfile = "All",
    
    [Parameter()]
    [switch]$DeepScan,
    
    [Parameter()]
    [switch]$PerformMutationCheck,
    
    [Parameter()]
    [switch]$GenerateReport,
    
    [Parameter()]
    [string]$OutputPath = "./quantum-inspection-report.json"
)

# Initialize inspector environment
Write-Host "`n===== QUANTUM INSPECTOR v1.0 =====" -ForegroundColor Cyan
Write-Host "[Target Directory: $TargetDir]" -ForegroundColor Yellow
Write-Host "[Mutation Profile: $MutationProfile]" -ForegroundColor Yellow
Write-Host "[Deep Scan: $(if ($DeepScan) { 'Enabled' } else { 'Disabled' })]" -ForegroundColor Yellow
Write-Host "[Mutation Check: $(if ($PerformMutationCheck) { 'Enabled' } else { 'Disabled' })]" -ForegroundColor Yellow

# Define component requirements
$componentRequirements = @{
    "hologram-component.js" = @{
        Required = $true
        Dependencies = @("hologram-renderer.js", "neural-bus.js")
        MutationCompatible = @("CyberLotus", "VoidBloom")
    }
    "hologram-renderer.js" = @{
        Required = $true
        Dependencies = @("neural-bus.js")
        MutationCompatible = @("CyberLotus", "VoidBloom", "ObsidianBloom")
    }
    "glitch-engine.js" = @{
        Required = $false
        Dependencies = @("neural-bus.js")
        MutationCompatible = @("CyberLotus", "VoidBloom", "NeonVortex")
    }
    "neural-bus.js" = @{
        Required = $true
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "VoidBloom", "ObsidianBloom", "NeonVortex")
    }
    "quantum-visualizer.js" = @{
        Required = $false
        Dependencies = @("neural-bus.js", "hologram-renderer.js")
        MutationCompatible = @("CyberLotus", "VoidBloom")
    }
    "cart-system.js" = @{
        Required = $true
        Dependencies = @("neural-bus.js")
        MutationCompatible = @("CyberLotus", "VoidBloom", "ObsidianBloom", "NeonVortex")
    }
    "header.liquid" = @{
        Required = $true
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "ObsidianBloom")
    }
    "header-voidbloom.liquid" = @{
        Required = $false
        Dependencies = @()
        MutationCompatible = @("VoidBloom")
    }
    "quantum-header.liquid" = @{
        Required = $false
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "VoidBloom", "NeonVortex")
    }
    "footer.liquid" = @{
        Required = $true
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "ObsidianBloom", "VoidBloom", "NeonVortex")
    }
    "product-hologram.liquid" = @{
        Required = $false
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "VoidBloom")
    }
    "quantum-dashboard.liquid" = @{
        Required = $false
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "VoidBloom", "NeonVortex")
    }
    "quantum-layer.liquid" = @{
        Required = $false
        Dependencies = @()
        MutationCompatible = @("CyberLotus", "VoidBloom", "NeonVortex")
    }
}

# Import shared registry class
class QuantumRegistry {
    static [hashtable] $Artifacts = @{}
    static [string] $RegistryPath = "./config/quantum-registry.json"
}

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

# Load blueprints
$blueprints = @()
$blueprintFiles = Get-ChildItem -Path "./blueprints" -Filter "*.json" -File
foreach ($file in $blueprintFiles) {
    try {
        $blueprint = Get-Content $file.FullName -Raw | ConvertFrom-Json
        $blueprints += @{
            Name = $file.BaseName
            Path = $file.FullName
            Data = $blueprint
        }
    }
    catch {
        Write-Host "[Failed to load blueprint $($file.Name): $($_.Exception.Message)]" -ForegroundColor Red
    }
}

Write-Host "[Loaded $($blueprints.Count) blueprints]" -ForegroundColor Green

# Initialize inspection report
$inspectionReport = @{
    Summary = @{
        TotalComponents = 0
        MissingComponents = 0
        IncompatibleComponents = 0
        CompatibilityIssues = 0
        MutationIssues = 0
        TimeStamp = Get-Date -Format "o"
    }
    Components = @{}
    MutationCompatibility = @{
        CyberLotus = @{
            Compatible = 0
            Incompatible = 0
        }
        VoidBloom = @{
            Compatible = 0
            Incompatible = 0
        }
        ObsidianBloom = @{
            Compatible = 0
            Incompatible = 0
        }
        NeonVortex = @{
            Compatible = 0
            Incompatible = 0
        }
    }
    Issues = @()
}

# Check for required components and their dependencies
foreach ($component in $componentRequirements.Keys) {
    $required = $componentRequirements[$component].Required
    $dependencies = $componentRequirements[$component].Dependencies
    $compatible = $componentRequirements[$component].MutationCompatible
    
    $inspectionReport.Summary.TotalComponents++
    $componentBaseName = Split-Path $component -Leaf
    
    # Look for the component in various directories
    $foundPaths = @()
    foreach ($artifact in [QuantumRegistry]::Artifacts.Keys) {
        if ($artifact -match $componentBaseName) {
            $foundPaths += $artifact
        }
    }
    
    # If multiple matches found, prioritize exact match
    if ($foundPaths.Count -gt 1) {
        foreach ($path in $foundPaths) {
            if (Split-Path $path -Leaf -eq $componentBaseName) {
                $foundPaths = @($path)
                break
            }
        }
    }
    
    # Check if component exists
    if ($foundPaths.Count -eq 0) {
        if ($required) {
            $issue = @{
                Component = $component
                IssueType = "Missing"
                Severity = "Critical"
                Description = "Required component is missing"
                Resolution = "Install the component from the quantum forge"
            }
            
            $inspectionReport.Issues += $issue
            $inspectionReport.Summary.MissingComponents++
            
            $inspectionReport.Components[$component] = @{
                Status = "Missing"
                Dependencies = @()
                MutationCompatible = @()
                Issues = @("Missing required component")
            }
            
            Write-Host "[MISSING] $component" -ForegroundColor Red
        }
        else {
            $inspectionReport.Components[$component] = @{
                Status = "Optional (Missing)"
                Dependencies = @()
                MutationCompatible = @()
                Issues = @()
            }
            
            Write-Host "[OPTIONAL] $component" -ForegroundColor Yellow
        }
        
        continue
    }
    
    # Component found
    $componentPath = $foundPaths[0]
    $componentStatus = "OK"
    $componentIssues = @()
    
    # Check all dependencies
    $dependencyStatus = @{}
    foreach ($dependency in $dependencies) {
        $depBaseName = Split-Path $dependency -Leaf
        $depFound = $false
        
        foreach ($artifact in [QuantumRegistry]::Artifacts.Keys) {
            if ($artifact -match $depBaseName) {
                $depFound = $true
                $dependencyStatus[$dependency] = "OK"
                break
            }
        }
        
        if (-not $depFound) {
            $dependencyStatus[$dependency] = "Missing"
            $componentStatus = "Incomplete"
            $componentIssues += "Dependency $dependency is missing"
            
            $issue = @{
                Component = $component
                IssueType = "DependencyMissing"
                Severity = "High"
                Description = "Dependency $dependency is missing"
                Resolution = "Install the missing dependency"
            }
            
            $inspectionReport.Issues += $issue
            $inspectionReport.Summary.CompatibilityIssues++
        }
    }
    
    # Check mutation compatibility
    $mutationStatusActive = @{}
    if ($MutationProfile -ne "All") {
        if ($compatible -contains $MutationProfile) {
            $mutationStatusActive[$MutationProfile] = "Compatible"
            $inspectionReport.MutationCompatibility[$MutationProfile].Compatible++
        }
        else {
            $mutationStatusActive[$MutationProfile] = "Incompatible"
            $componentStatus = "Incompatible"
            $componentIssues += "Incompatible with $MutationProfile mutation profile"
            
            $issue = @{
                Component = $component
                IssueType = "MutationIncompatible"
                Severity = "Medium"
                Description = "Component is incompatible with $MutationProfile mutation profile"
                Resolution = "Replace with a compatible component or adapt for this profile"
            }
            
            $inspectionReport.Issues += $issue
            $inspectionReport.Summary.IncompatibleComponents++
            $inspectionReport.MutationCompatibility[$MutationProfile].Incompatible++
        }
    }
    else {
        # Check all mutation profiles
        foreach ($profile in @("CyberLotus", "VoidBloom", "ObsidianBloom", "NeonVortex")) {
            if ($compatible -contains $profile) {
                $mutationStatusActive[$profile] = "Compatible"
                $inspectionReport.MutationCompatibility[$profile].Compatible++
            }
            else {
                $mutationStatusActive[$profile] = "Incompatible"
                $inspectionReport.MutationCompatibility[$profile].Incompatible++
            }
        }
    }
    
    # If deep scan is enabled, check for code quality issues
    $deepScanIssues = @()
    if ($DeepScan -and (Test-Path $componentPath)) {
        $content = Get-Content $componentPath -Raw
        
        # Check for template conventions
        $fileExtension = [System.IO.Path]::GetExtension($componentPath).TrimStart('.')
        if ($fileExtension -eq "liquid") {
            # Check for missing comment headers
            if (-not ($content -match "{% comment %}")) {
                $deepScanIssues += "Missing liquid comment header"
            }
            
            # Check for missing schema if it's a section
            if ($componentPath -match "/sections/" -and -not ($content -match "{% schema %}")) {
                $deepScanIssues += "Missing schema in section file"
            }
            
            # Check for CSS class naming conventions
            if (-not ($content -match "quantum-" -or $content -match "cybercore-")) {
                $deepScanIssues += "Missing standard CSS class naming conventions"
            }
        }
        elseif ($fileExtension -eq "js") {
            # Check for proper module format
            if (-not ($content -match "export " -or $content -match "import ")) {
                $deepScanIssues += "Not using ES module format"
            }
            
            # Check for neural bus integration
            if ($dependencies -contains "neural-bus.js" -and -not ($content -match "NeuralBus\.")) {
                $deepScanIssues += "Missing NeuralBus integration"
            }
            
            # Check for error handling
            if (-not ($content -match "try\s*{" -and $content -match "catch\s*\(")) {
                $deepScanIssues += "Missing proper error handling"
            }
        }
        
        # Add deep scan issues to component issues
        foreach ($issue in $deepScanIssues) {
            $componentIssues += $issue
            
            $inspectionReport.Issues += @{
                Component = $component
                IssueType = "CodeQuality"
                Severity = "Low"
                Description = $issue
                Resolution = "Refactor component to follow best practices"
            }
            
            $inspectionReport.Summary.CompatibilityIssues++
        }
    }
    
    # Perform mutation checks if enabled
    if ($PerformMutationCheck -and (Test-Path $componentPath) -and $MutationProfile -ne "All") {
        $content = Get-Content $componentPath -Raw
        $mutationMarkers = @{
            CyberLotus = "// CyberLotus Quantum Profile //"
            ObsidianBloom = "// ObsidianBloom Quantum Profile //"
            VoidBloom = "// VoidBloom Quantum Profile //"
            NeonVortex = "// NeonVortex Quantum Profile //"
        }
        
        # Check if component has the appropriate mutation marker
        if ($compatible -contains $MutationProfile -and -not ($content -match [regex]::Escape($mutationMarkers[$MutationProfile]))) {
            $mutationIssue = "Missing $MutationProfile mutation marker"
            $componentIssues += $mutationIssue
            
            $inspectionReport.Issues += @{
                Component = $component
                IssueType = "MutationMarker"
                Severity = "Low"
                Description = $mutationIssue
                Resolution = "Add '$($mutationMarkers[$MutationProfile])' to the component"
            }
            
            $inspectionReport.Summary.MutationIssues++
        }
    }
    
    # Record component status
    $inspectionReport.Components[$component] = @{
        Status = $componentStatus
        Dependencies = $dependencyStatus
        MutationCompatible = $mutationStatusActive
        Issues = $componentIssues
    }
    
    # Display status
    $statusColor = if ($componentStatus -eq "OK") { "Green" } elseif ($componentStatus -eq "Incomplete") { "Yellow" } else { "Red" }
    Write-Host "[$componentStatus] $component" -ForegroundColor $statusColor
    
    if ($componentIssues.Count -gt 0) {
        foreach ($issue in $componentIssues) {
            Write-Host "  - $issue" -ForegroundColor Yellow
        }
    }
}

# Check blueprints for integration with components
Write-Host "`n[Checking blueprints...]" -ForegroundColor Cyan
foreach ($blueprint in $blueprints) {
    try {
        $name = $blueprint.Name
        $data = $blueprint.Data
        
        # Check if the blueprint references existing components
        if ($data.components) {
            foreach ($comp in $data.components) {
                $compName = $comp.name
                $found = $false
                
                foreach ($registeredComp in $componentRequirements.Keys) {
                    if ($registeredComp -match $compName) {
                        $found = $true
                        break
                    }
                }
                
                if (-not $found) {
                    $issue = @{
                        Blueprint = $name
                        Component = $compName
                        IssueType = "UnknownComponent"
                        Severity = "Medium"
                        Description = "Blueprint references unknown component '$compName'"
                        Resolution = "Register or create the missing component"
                    }
                    
                    $inspectionReport.Issues += $issue
                    Write-Host "[WARNING] Blueprint '$name' references unknown component '$compName'" -ForegroundColor Yellow
                }
            }
        }
        
        # Check mutation profile compatibility
        if ($data.mutationProfile -and $data.mutationProfile -ne "All") {
            $compatible = $true
            $incompatibleComponents = @()
            
            foreach ($comp in $data.components) {
                $compName = $comp.name
                $found = $false
                
                foreach ($registeredComp in $componentRequirements.Keys) {
                    if ($registeredComp -match $compName) {
                        if (-not ($componentRequirements[$registeredComp].MutationCompatible -contains $data.mutationProfile)) {
                            $compatible = $false
                            $incompatibleComponents += $compName
                        }
                        $found = $true
                        break
                    }
                }
            }
            
            if (-not $compatible) {
                $issue = @{
                    Blueprint = $name
                    IssueType = "BlueprintIncompatible"
                    Severity = "High"
                    Description = "Blueprint '$name' is not compatible with its mutation profile '$($data.mutationProfile)'"
                    Resolution = "Replace incompatible components: $($incompatibleComponents -join ', ')"
                }
                
                $inspectionReport.Issues += $issue
                Write-Host "[ERROR] Blueprint '$name' has incompatible components: $($incompatibleComponents -join ', ')" -ForegroundColor Red
            }
            else {
                Write-Host "[OK] Blueprint '$name' is compatible with mutation profile '$($data.mutationProfile)'" -ForegroundColor Green
            }
        }
    }
    catch {
        Write-Host "[ERROR] Failed to process blueprint $($blueprint.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Generate health score (0-100)
$healthDeductions = @{
    MissingComponents = 20
    IncompatibleComponents = 15
    CompatibilityIssues = 5
    MutationIssues = 2
}

$deductions = 0
$deductions += [Math]::Min(80, $inspectionReport.Summary.MissingComponents * $healthDeductions.MissingComponents)
$deductions += [Math]::Min(60, $inspectionReport.Summary.IncompatibleComponents * $healthDeductions.IncompatibleComponents)
$deductions += [Math]::Min(40, $inspectionReport.Summary.CompatibilityIssues * $healthDeductions.CompatibilityIssues)
$deductions += [Math]::Min(20, $inspectionReport.Summary.MutationIssues * $healthDeductions.MutationIssues)

$healthScore = 100 - $deductions

# Display summary
Write-Host "`n[QUANTUM INSPECTION COMPLETE]" -ForegroundColor Green
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "- Total Components: $($inspectionReport.Summary.TotalComponents)" -ForegroundColor White
Write-Host "- Missing Components: $($inspectionReport.Summary.MissingComponents)" -ForegroundColor $(if ($inspectionReport.Summary.MissingComponents -gt 0) { "Red" } else { "Green" })
Write-Host "- Incompatible Components: $($inspectionReport.Summary.IncompatibleComponents)" -ForegroundColor $(if ($inspectionReport.Summary.IncompatibleComponents -gt 0) { "Yellow" } else { "Green" })
Write-Host "- Compatibility Issues: $($inspectionReport.Summary.CompatibilityIssues)" -ForegroundColor $(if ($inspectionReport.Summary.CompatibilityIssues -gt 0) { "Yellow" } else { "Green" })
Write-Host "- Mutation Issues: $($inspectionReport.Summary.MutationIssues)" -ForegroundColor $(if ($inspectionReport.Summary.MutationIssues -gt 0) { "Yellow" } else { "Green" })

Write-Host "`nQuantum Health Score: $healthScore/100" -ForegroundColor $(
    if ($healthScore -ge 90) { "Green" }
    elseif ($healthScore -ge 70) { "Yellow" }
    else { "Red" }
)

# Display mutation compatibility
if ($MutationProfile -ne "All") {
    Write-Host "`nMutation Compatibility ($MutationProfile):" -ForegroundColor Cyan
    Write-Host "- Compatible Components: $($inspectionReport.MutationCompatibility[$MutationProfile].Compatible)" -ForegroundColor Green
    Write-Host "- Incompatible Components: $($inspectionReport.MutationCompatibility[$MutationProfile].Incompatible)" -ForegroundColor Red
}
else {
    Write-Host "`nMutation Compatibility:" -ForegroundColor Cyan
    foreach ($profile in @("CyberLotus", "VoidBloom", "ObsidianBloom", "NeonVortex")) {
        $compatible = $inspectionReport.MutationCompatibility[$profile].Compatible
        $incompatible = $inspectionReport.MutationCompatibility[$profile].Incompatible
        $total = $compatible + $incompatible
        $percentage = if ($total -gt 0) { [Math]::Round(($compatible / $total) * 100) } else { 0 }
        
        Write-Host "- $profile`: $compatible/$total ($percentage% compatible)" -ForegroundColor $(
            if ($percentage -ge 90) { "Green" }
            elseif ($percentage -ge 70) { "Yellow" }
            else { "Red" }
        )
    }
}

# Display critical issues
$criticalIssues = $inspectionReport.Issues | Where-Object { $_.Severity -eq "Critical" }
if ($criticalIssues.Count -gt 0) {
    Write-Host "`nCritical Issues:" -ForegroundColor Red
    foreach ($issue in $criticalIssues) {
        Write-Host "- $($issue.Component): $($issue.Description)" -ForegroundColor Red
        Write-Host "  Solution: $($issue.Resolution)" -ForegroundColor White
    }
}

# Generate report if requested
if ($GenerateReport) {
    $inspectionReport | ConvertTo-Json -Depth 5 | Set-Content $OutputPath
    Write-Host "`n[Inspection report saved to $OutputPath]" -ForegroundColor Green
}

# Provide next steps recommendations
Write-Host "`nNext Steps:" -ForegroundColor Yellow

if ($inspectionReport.Summary.MissingComponents -gt 0) {
    Write-Host "- Run 'quantum-forge.ps1' to generate missing components" -ForegroundColor White
}

if ($inspectionReport.Summary.CompatibilityIssues -gt 0) {
    Write-Host "- Run 'Invoke-QuantumMutation.ps1' to test component compatibility" -ForegroundColor White
}

if ($inspectionReport.Summary.MutationIssues -gt 0) {
    Write-Host "- Run 'quantum-integrity.ps1' to add missing mutation markers" -ForegroundColor White
}

if ($healthScore -lt 70) {
    Write-Host "- Run 'Get-QuantumVulnerability.ps1' to check for security issues" -ForegroundColor White
}

exit 0