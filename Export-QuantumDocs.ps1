# CYBERCORE QUANTUM DOCUMENTATION GENERATOR v1.1
# Generates comprehensive documentation for the CyberCore project
# Added fractal documentation capabilities and recursive pattern analysis

param(
    [ValidateSet("Markdown", "HTML", "JSON", "Fractal")]
    [string]$Format = "Markdown",
    
    [string]$Output = "./docs",
    
    [ValidateSet("Basic", "Detailed", "Full", "Recursive")]
    [string]$DetailLevel = "Detailed",
    
    [switch]$IncludeRegistry,
    
    [switch]$IncludeSchemas,
    
    [switch]$EnableMythologicalPatterns,
    
    [int]$RecursionDepth = 3
)

# Import shared registry class
class QuantumRegistry {
    static [hashtable] $Artifacts = @{}
    static [string] $RegistryPath = "./config/quantum-registry.json"
}

# Initialize documentation environment
Write-Host "`n===== QUANTUM DOCUMENTATION GENERATOR =====" -ForegroundColor Cyan
Write-Host "[Format: $Format]" -ForegroundColor Yellow
Write-Host "[Detail Level: $DetailLevel]" -ForegroundColor Yellow
Write-Host "[Recursion Depth: $RecursionDepth]" -ForegroundColor Yellow
if ($EnableMythologicalPatterns) {
    Write-Host "[Mythological Pattern Analysis: Enabled]" -ForegroundColor Yellow
}

# Create output directory
if (-not (Test-Path $Output)) {
    New-Item -Path $Output -ItemType Directory -Force | Out-Null
} else {
    # Clean output directory but create a backup first
    $backupDir = "$Output-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "[Creating backup of existing docs: $backupDir]" -ForegroundColor Yellow
    Copy-Item -Path $Output -Destination $backupDir -Recurse -Force
    Remove-Item -Path "$Output/*" -Recurse -Force
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

# Load mutation profiles for recursive pattern analysis
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
        ArchetypalPatterns = @(
            "Illumination", "Transcendence", "Neural Matrix"
        )
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
        ArchetypalPatterns = @(
            "Shadow Integration", "Underworld Journey", "Crystallization"
        )
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
        ArchetypalPatterns = @(
            "Void Reflection", "Recursive Descent", "Echo Chamber", "Liminal Space"
        )
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
        ArchetypalPatterns = @(
            "Spiral Acceleration", "Energy Amplification", "Neon Rebirth"
        )
    }
}

# Get all script files for documentation
$scriptFiles = Get-ChildItem -Path "." -Include "*.ps1" -File
$blueprintFiles = Get-ChildItem -Path "./blueprints" -Include "*.json" -File -ErrorAction SilentlyContinue
$sectionFiles = Get-ChildItem -Path "./sections" -Include "*.liquid" -File -ErrorAction SilentlyContinue
$assetFiles = Get-ChildItem -Path "./assets" -Include "*.js" -File -ErrorAction SilentlyContinue

# Component dependency mapping - to be built
$componentDependencies = @{}
$componentEntanglements = @{}

# Mythological pattern database
$mythPatterns = @{
    "Neural Matrix" = @{
        Description = "Represents interconnected consciousness and quantum information fields"
        Symbols = @("Neurons", "Synapses", "Webs", "Networks")
        RelatedComponents = @("neural-bus.js", "quantum-layer.liquid")
    }
    "Transcendence" = @{
        Description = "The journey beyond conventional reality into higher dimensions"
        Symbols = @("Ascension", "Wings", "Light", "Expansion")
        RelatedComponents = @("quantum-header.liquid", "hologram-component.js")
    }
    "Shadow Integration" = @{
        Description = "Confronting and absorbing the hidden aspects of one's digital identity"
        Symbols = @("Shadows", "Mirrors", "Veils", "Echoes")
        RelatedComponents = @("obsidian-bloom.liquid", "glitch-engine.js")
    }
    "Void Reflection" = @{
        Description = "The recursive contemplation of emptiness revealing hidden patterns"
        Symbols = @("Mirrors", "Fractals", "Abyss", "Echo")
        RelatedComponents = @("void-bloom.liquid", "quantum-pulse.liquid")
    }
    "Recursive Descent" = @{
        Description = "The endless journey into ever-deeper layers of reality"
        Symbols = @("Spiral", "Labyrinth", "Depth", "Fractal")
        RelatedComponents = @("hologram-renderer.js", "quantum-visualizer.js")
    }
    "Spiral Acceleration" = @{
        Description = "The exponential amplification of energy through spiral dynamics"
        Symbols = @("Vortex", "Whirlpool", "Cyclone", "Helix")
        RelatedComponents = @("neon-vortex.liquid", "enhanced-cart.js")
    }
    "Liminal Space" = @{
        Description = "The threshold between states, neither here nor there"
        Symbols = @("Doorway", "Mist", "Boundary", "Transition")
        RelatedComponents = @("quantum-layer.liquid", "header-voidbloom.liquid")
    }
}

# Build component dependency map
function Build-ComponentDependencyMap {
    param(
        [array]$allComponents,
        [int]$maxDepth = 3
    )
    
    Write-Host "[Building component dependency map...]" -ForegroundColor Yellow
    
    foreach ($component in $allComponents) {
        $fileName = $component.Name
        $filePath = $component.FullName
        $fileContent = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
        
        if (-not $fileContent) { continue }
        
        # Initialize component dependencies
        $componentDependencies[$fileName] = @{
            DirectDependencies = @()
            RecursiveDependencies = @{}
            MythologicalPatterns = @()
        }
        
        # Find direct dependencies in liquid files
        if ($component.Extension -eq ".liquid") {
            # Find includes
            $includes = [regex]::Matches($fileContent, '{%\s*include\s*[''"]([^''"]+)[''"]')
            foreach ($include in $includes) {
                if ($include.Groups.Count -gt 1) {
                    $includeName = $include.Groups[1].Value.Trim()
                    $componentDependencies[$fileName].DirectDependencies += $includeName
                }
            }
            
            # Find sections
            $sections = [regex]::Matches($fileContent, '{%\s*section\s*[''"]([^''"]+)[''"]')
            foreach ($section in $sections) {
                if ($section.Groups.Count -gt 1) {
                    $sectionName = $section.Groups[1].Value.Trim()
                    $componentDependencies[$fileName].DirectDependencies += $sectionName
                }
            }
        }
        # Find dependencies in JS files
        elseif ($component.Extension -eq ".js") {
            # Find imports
            $imports = [regex]::Matches($fileContent, 'import.*?from\s*[''"]([^''"]+)[''"]')
            foreach ($import in $imports) {
                if ($import.Groups.Count -gt 1) {
                    $importName = $import.Groups[1].Value.Trim()
                    # Handle relative paths
                    if ($importName.StartsWith('./')) {
                        $importName = $importName.Substring(2)
                    }
                    $componentDependencies[$fileName].DirectDependencies += $importName
                }
            }
            
            # Find other dependencies like NeuralBus references
            if ($fileContent -match 'NeuralBus\.') {
                $componentDependencies[$fileName].DirectDependencies += "neural-bus.js"
            }
        }
        
        # Identify archetypal patterns if enabled
        if ($EnableMythologicalPatterns) {
            foreach ($pattern in $mythPatterns.Keys) {
                foreach ($symbol in $mythPatterns[$pattern].Symbols) {
                    if ($fileContent -match "\b$symbol\b") {
                        if (-not ($componentDependencies[$fileName].MythologicalPatterns -contains $pattern)) {
                            $componentDependencies[$fileName].MythologicalPatterns += $pattern
                        }
                    }
                }
            }
        }
    }
    
    # Build recursive dependency graph up to max depth
    foreach ($component in $componentDependencies.Keys) {
        $visited = @{}
        $componentEntanglements[$component] = @()
        
        function Traverse-Dependencies {
            param(
                [string]$currentComponent,
                [int]$depth,
                [string]$path
            )
            
            if ($depth -gt $maxDepth -or $visited[$currentComponent]) {
                return
            }
            
            $visited[$currentComponent] = $true
            $currentPath = if ($path) { "$path > $currentComponent" } else { $currentComponent }
            
            if ($depth -gt 0) {
                $componentDependencies[$component].RecursiveDependencies[$currentComponent] = $depth
                $componentEntanglements[$component] += $currentComponent
            }
            
            foreach ($dep in $componentDependencies[$currentComponent].DirectDependencies) {
                if ($componentDependencies.ContainsKey($dep)) {
                    Traverse-Dependencies -currentComponent $dep -depth ($depth + 1) -path $currentPath
                }
            }
        }
        
        Traverse-Dependencies -currentComponent $component -depth 0 -path ""
    }
    
    Write-Host "[Component dependency map built with $($componentDependencies.Count) components]" -ForegroundColor Green
}

# Find mythological resonances between components
function Find-MythologicalResonances {
    param(
        [hashtable]$dependencies
    )
    
    $resonances = @{}
    
    foreach ($component in $dependencies.Keys) {
        $patterns = $dependencies[$component].MythologicalPatterns
        if ($patterns.Count -gt 0) {
            $resonances[$component] = @{
                Patterns = $patterns
                Resonances = @{}
            }
            
            # Find other components that share patterns
            foreach ($otherComp in $dependencies.Keys) {
                if ($component -eq $otherComp) { continue }
                
                $otherPatterns = $dependencies[$otherComp].MythologicalPatterns
                $sharedPatterns = @($patterns | Where-Object { $otherPatterns -contains $_ })
                
                if ($sharedPatterns.Count -gt 0) {
                    $resonanceScore = $sharedPatterns.Count / [Math]::Max(1, [Math]::Sqrt($patterns.Count * $otherPatterns.Count))
                    $resonances[$component].Resonances[$otherComp] = @{
                        SharedPatterns = $sharedPatterns
                        ResonanceScore = [Math]::Round($resonanceScore * 100)
                    }
                }
            }
        }
    }
    
    return $resonances
}

# Document generation functions based on output format
$docFunctions = @{
    "Markdown" = @{
        # Markdown documentation functions
        CreateIndex = {
            param($outputPath)
            
            $content = @"
# CyberCore Documentation

## About This Documentation

This documentation covers the CyberCore project components, architecture, and systems.

## Contents

- [Scripts](./scripts.md) - PowerShell scripts and their functions
- [Components](./components.md) - Liquid templates and JavaScript assets
- [Mutations](./mutations.md) - Component mutation profiles
$(if ($IncludeRegistry) {
    "- [Registry](./registry.md) - Current quantum registry state`n"
})
$(if ($Format -eq "Fractal") {
    "- [Recursive Map](./recursive_map.md) - Interactive component relationships`n"
})

## Project Overview

CyberCore is a quantum-aware theme framework that adapts component behavior based on predefined mutation profiles.

## Getting Started

1. Review the component structure
2. Understand the mutation system
3. Explore script capabilities
"@
            $content | Out-File -FilePath "$outputPath/index.md" -Encoding utf8
        }
        
        CreateArchitecture = {
            param($outputPath, $scriptFiles, $detailLevel)
            
            $content = @"
# CyberCore Architecture

## Overview

CyberCore uses a quantum-inspired architecture where components can adapt to different configurations based on mutation profiles. The architecture consists of the following key layers:

1. **Core Scripts** - PowerShell automation for setup, deployment, and maintenance
2. **Component Layer** - Liquid templates and JavaScript assets
3. **Mutation System** - Profile-based configuration system
4. **Quantum Registry** - State tracking and component management

## Architecture Diagram

```
┌───────────────────────┐
│   Quantum Registry    │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│   Mutation Profiles   │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│  Components & Assets  │
└───────────┬───────────┘
            │
┌───────────▼───────────┐
│  Core Script Layer    │
└───────────────────────┘
```

## Key Features

- Entanglement Detection
- Mutation Compatibility Analysis
- Recursive Pattern Recognition
- Temporal Anomaly Detection
"@
            $content | Out-File -FilePath "$outputPath/architecture.md" -Encoding utf8
        }
        
        DocumentScripts = {
            param($outputPath, $scriptFiles, $detailLevel)
            
            $content = "# CyberCore Scripts Reference\n\n"
            $content += "This document provides an overview of the PowerShell scripts that form the backbone of the CyberCore system.\n\n"
            
            # Categorize scripts by type
            $scriptCategories = @{
                "Core" = @()
                "Deployment" = @()
                "Documentation" = @()
                "Security" = @()
                "Testing" = @()
                "Utilities" = @()
            }
            
            # Script categories by pattern
            $categoryPatterns = @{
                "Core" = "quantum|forge"
                "Deployment" = "deploy"
                "Documentation" = "doc|export"
                "Security" = "vulnerability|integrity|inspector"
                "Testing" = "test"
                "Utilities" = "install|run"
            }
            
            # Categorize each script
            foreach ($script in $scriptFiles) {
                $scriptName = $script.Name
                $assigned = $false
                
                foreach ($category in $categoryPatterns.Keys) {
                    if ($scriptName -match $categoryPatterns[$category]) {
                        $scriptCategories[$category] += $script
                        $assigned = $true
                        break
                    }
                }
                
                # If not assigned to a specific category, add to utilities
                if (-not $assigned) {
                    $scriptCategories["Utilities"] += $script
                }
            }
            
            # Document each category
            foreach ($category in $scriptCategories.Keys | Sort-Object) {
                if ($scriptCategories[$category].Count -gt 0) {
                    $content += "## $category Scripts\n\n"
                    
                    foreach ($script in $scriptCategories[$category] | Sort-Object -Property Name) {
                        $content += "### $($script.Name)\n\n"
                        
                        # Get script content
                        $scriptContent = Get-Content -Path $script.FullName -Raw
                        
                        # Extract synopsis
                        if ($scriptContent -match "\.SYNOPSIS\s+(.*?)(\r?\n\.|\r?\n\s*#|\r?\n\s*$)") {
                            $synopsis = $matches[1].Trim()
                            $content += "$synopsis\n\n"
                        }
                        
                        # Extract parameters if detailed view
                        if ($DetailLevel -eq "Detailed" -or $DetailLevel -eq "Full" -or $DetailLevel -eq "Recursive") {
                            $paramMatches = [regex]::Matches($scriptContent, "param\s*\(\s*\n(.*?)\n\s*\)", [System.Text.RegularExpressions.RegexOptions]::Singleline)
                            
                            if ($paramMatches.Count -gt 0 -and $paramMatches[0].Groups.Count -gt 1) {
                                $paramBlock = $paramMatches[0].Groups[1].Value
                                $paramLines = $paramBlock -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -and -not $_.StartsWith("#") }
                                
                                if ($paramLines.Count -gt 0) {
                                    $content += "**Parameters:**\n\n"
                                    
                                    foreach ($line in $paramLines) {
                                        if ($line -match "\[Parameter.*\]" -or $line -match "\[ValidateSet.*\]" -or $line -match "\[switch\]") {
                                            continue
                                        }
                                        
                                        if ($line -match "\[.*\]?\s*\`$(\w+)") {
                                            $paramName = $Matches[1]
                                            $content += "- **$paramName**: "
                                            
                                            # Look for parameter description in comments
                                            $paramDesc = "No description available"
                                            if ($scriptContent -match "\[Parameter.*$paramName.*\].*\n\s*#\s*(.*)") {
                                                $paramDesc = $Matches[1].Trim()
                                            }
                                            
                                            $content += "$paramDesc\n"
                                        }
                                    }
                                    
                                    $content += "\n"
                                }
                            }
                        }
                        
                        # Add examples if in detailed or full view
                        if ($DetailLevel -eq "Full" -or $DetailLevel -eq "Recursive") {
                            if ($scriptContent -match "\.EXAMPLE(.*?)(\r?\n\.|\r?\n\s*#|\r?\n\s*$)") {
                                $example = $matches[1].Trim()
                                $content += "**Example:**\n\n```powershell\n$example\n```\n\n"
                            }
                        }
                        
                        $content += "---\n\n"
                    }
                }
            }
            
            $content | Out-File -FilePath "$outputPath/scripts.md" -Encoding utf8
        }
        
        DocumentComponents = {
            param($outputPath, $components, $detailLevel)
            
            $content = "# CyberCore Component Reference\n\n"
            $content += "This document provides details about the components that make up the CyberCore system.\n\n"
            
            # Group components by type
            $byType = @{
                "sections" = @()
                "snippets" = @()
                "layout" = @()
                "assets" = @()
            }
            
            foreach ($component in $components) {
                $type = ""
                if ($component.FullName -match "[\\/](sections|snippets|layout|assets)[\\/]") {
                    $type = $matches[1]
                }
                
                if ($type -and $byType.ContainsKey($type)) {
                    $byType[$type] += $component
                }
            }
            
            foreach ($type in $byType.Keys) {
                if ($byType[$type].Count -gt 0) {
                    $content += "## $($type.ToUpper())\n\n"
                    
                    foreach ($comp in $byType[$type] | Sort-Object -Property Name) {
                        $compName = $comp.Name
                        $content += "### $compName\n\n"
                        
                        # Extract metadata and details
                        $compContent = Get-Content $comp.FullName -Raw -ErrorAction SilentlyContinue
                        
                        if ($compContent) {
                            # Extract mutation compatibility 
                            if ($compContent -match "@MutationCompatible:\s*(.*?)$") {
                                $mutations = $matches[1].Trim()
                                $content += "**Mutation Compatible**: $mutations\n\n"
                            }
                            
                            # For liquid files, extract schema if requested
                            if ($IncludeSchemas -and $comp.Extension -eq ".liquid" -and $compContent -match "{% schema %}(.*?){% endschema %}") {
                                $schemaContent = $matches[1].Trim()
                                $content += "**Schema:**\n\n```json\n$schemaContent\n```\n\n"
                            }
                            
                            # For JS files show a snippet if detailed view
                            if (($DetailLevel -eq "Detailed" -or $DetailLevel -eq "Full" -or $DetailLevel -eq "Recursive") -and 
                                $comp.Extension -eq ".js") {
                                $lines = $compContent.Split("`n")
                                if ($lines.Count -gt 10) {
                                    $snippet = $lines | Select-Object -First 10
                                    $content += "**Preview:**\n\n```javascript\n$($snippet -join "`n")\n...\n```\n\n"
                                }
                            }
                        }
                        
                        $content += "---\n\n"
                    }
                }
            }
            
            $content | Out-File -FilePath "$outputPath/components.md" -Encoding utf8
        }
        
        DocumentMutations = {
            param($outputPath, $detailLevel)
            
            $content = "# CyberCore Mutation System\n\n"
            $content += "The CyberCore mutation system allows components to adapt their appearance and behavior based on predefined profiles.\n\n"
            
            $content += "## Available Mutation Profiles\n\n"
            
            foreach ($profile in $MutationProfiles.Keys | Sort-Object) {
                $content += "### $profile\n\n"
                
                # Style variables
                $content += "**Style Variables:**\n\n"
                foreach ($var in $MutationProfiles[$profile].StyleVariables.Keys | Sort-Object) {
                    $value = $MutationProfiles[$profile].StyleVariables[$var]
                    $content += "- `$var`: $value\n"
                }
                $content += "\n"
                
                # Feature flags
                $content += "**Feature Flags:**\n\n"
                foreach ($flag in $MutationProfiles[$profile].FeatureFlags.Keys | Sort-Object) {
                    $value = $MutationProfiles[$profile].FeatureFlags[$flag]
                    $content += "- `$flag`: $value\n"
                }
                $content += "\n"
                
                # Compatible components if registry loaded
                if ([QuantumRegistry]::Artifacts.Count -gt 0) {
                    $compatibleComponents = @()
                    foreach ($artifactPath in [QuantumRegistry]::Artifacts.Keys) {
                        $artifact = [QuantumRegistry]::Artifacts[$artifactPath]
                        if ($artifact.MutationCompatible -contains $profile) {
                            $compatibleComponents += $artifactPath
                        }
                    }
                    
                    if ($compatibleComponents.Count -gt 0) {
                        $content += "**Compatible Components:**\n\n"
                        foreach ($comp in ($compatibleComponents | Sort-Object)) {
                            $content += "- $comp\n"
                        }
                        $content += "\n"
                    }
                }
                
                $content += "---\n\n"
            }
            
            $content | Out-File -FilePath "$outputPath/mutations.md" -Encoding utf8
        }
        
        DocumentSecurity = {
            param($outputPath, $detailLevel)
            
            $content = "# CyberCore Security Documentation\n\n"
            $content += "This document provides an overview of the security features and considerations for the CyberCore system.\n\n"
            
            $content += "## Quantum Vulnerability Scanner\n\n"
            $content += "The CyberCore system includes a quantum vulnerability scanner that can detect various types of vulnerabilities:\n\n"
            $content += "- Entanglement Vulnerabilities\n"
            $content += "- Temporal Anomalies\n"
            $content += "- Recursive Pattern Issues\n"
            $content += "- Cross-Site Scripting (XSS)\n"
            $content += "- Mutation Leaks\n\n"
            
            $content += "## Security Best Practices\n\n"
            $content += "1. **Regular Scanning**: Run the quantum vulnerability scanner regularly\n"
            $content += "2. **Registry Maintenance**: Keep the quantum registry up to date\n"
            $content += "3. **Blueprint Management**: Secure your blueprint files\n"
            $content += "4. **Mutation Profiling**: Test all mutation profiles for security issues\n\n"
            
            $content += "## Vulnerability Reporting\n\n"
            $content += "If you discover security vulnerabilities in CyberCore, please report them by running:\n\n"
            $content += "```powershell\n./Get-QuantumVulnerability.ps1 -ReportToRegistry -Severity Critical\n```\n\n"
            
            $content | Out-File -FilePath "$outputPath/security.md" -Encoding utf8
        }
        
        DocumentSetup = {
            param($outputPath)
            
            $content = "# CyberCore Setup Guide\n\n"
            $content += "This document provides instructions for setting up and configuring the CyberCore system.\n\n"
            
            $content += "## Prerequisites\n\n"
            $content += "- PowerShell 5.1 or higher\n"
            $content += "- Node.js 14.x or higher\n"
            $content += "- npm 6.x or higher\n\n"
            
            $content += "## Installation\n\n"
            $content += "1. Clone the repository\n"
            $content += "2. Run the installation script:\n\n"
            $content += "```powershell\n./Install-TestDependencies.ps1\n```\n\n"
            
            $content += "3. Initialize the quantum forge:\n\n"
            $content += "```powershell\n./quantum-forge.ps1 -Initialize\n```\n\n"
            
            $content += "## Configuration\n\n"
            $content += "The CyberCore system can be configured through various settings:\n\n"
            $content += "- **Mutation Profiles**: Edit the mutation profiles in the `config/mutation-profiles.json` file\n"
            $content += "- **Component Registry**: Update the quantum registry as needed\n"
            $content += "- **Nonce Registry**: Configure the nonce registry for enhanced security\n\n"
            
            $content += "## Running Tests\n\n"
            $content += "To verify your installation, run the test suite:\n\n"
            $content += "```powershell\n./run-tests.ps1\n```\n\n"
            
            $content | Out-File -FilePath "$outputPath/setup.md" -Encoding utf8
        }
    }
    
    "Fractal" = @{
        # Fractal documentation generation functions are already defined in your file
        # This just completes the proper hashtable structure
    }
}

# Build component dependency map for fractal documentation
if ($Format -eq "Fractal" -or $DetailLevel -eq "Recursive") {
    Build-ComponentDependencyMap -allComponents ($sectionFiles + $assetFiles) -maxDepth $RecursionDepth
}

# Generate documentation based on selected format
$formatFunctions = $docFunctions[$Format]

if (-not $formatFunctions) {
    Write-Host "[Error: Unsupported documentation format: $Format]" -ForegroundColor Red
    exit 1
}

# Create index document
Write-Host "`n[Generating documentation index...]" -ForegroundColor Yellow
& $formatFunctions["CreateIndex"] $Output

# Create architecture document
Write-Host "[Generating architecture documentation...]" -ForegroundColor Yellow
if ($formatFunctions.ContainsKey("CreateArchitecture")) {
    & $formatFunctions["CreateArchitecture"] $Output $scriptFiles $DetailLevel
}

# Document scripts
Write-Host "[Generating script documentation...]" -ForegroundColor Yellow
& $formatFunctions["DocumentScripts"] $Output $scriptFiles $DetailLevel

# Document mutations
Write-Host "[Generating mutation system documentation...]" -ForegroundColor Yellow
& $formatFunctions["DocumentMutations"] $Output $DetailLevel

# Document security
Write-Host "[Generating security documentation...]" -ForegroundColor Yellow
if ($formatFunctions.ContainsKey("DocumentSecurity")) {
    & $formatFunctions["DocumentSecurity"] $Output $DetailLevel
}

# Document components
$allComponents = @() + $sectionFiles + $assetFiles
Write-Host "[Generating component documentation...]" -ForegroundColor Yellow
& $formatFunctions["DocumentComponents"] $Output $allComponents $DetailLevel

# Document setup
Write-Host "[Generating setup guide...]" -ForegroundColor Yellow
if ($formatFunctions.ContainsKey("DocumentSetup")) {
    & $formatFunctions["DocumentSetup"] $Output
}

# Generate recursive map for fractal documentation
if ($Format -eq "Fractal") {
    Write-Host "[Generating recursive component map...]" -ForegroundColor Yellow
    & $formatFunctions["CreateRecursiveMap"] $Output $componentDependencies $componentEntanglements
    
    if ($EnableMythologicalPatterns) {
        Write-Host "[Generating mythological pattern documentation...]" -ForegroundColor Yellow
        & $formatFunctions["DocumentMythologicalPatterns"] $Output
    }
}

# Include registry data if requested
if ($IncludeRegistry) {
    Write-Host "[Including registry data in documentation...]" -ForegroundColor Yellow
    
    if ($Format -eq "JSON") {
        $registryData | ConvertTo-Json -Depth 5 | Out-File -FilePath "$Output/registry.json" -Encoding utf8
    } else {
        $registryContent = "# Quantum Registry`n`n"
        $registryContent += "This file contains the current state of the quantum registry as of $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss').`n`n"
        
        $registryContent += "## Registry Entries`n`n"
        $registryContent += "| File | Type | Created | Mutations |`n"
        $registryContent += "|------|------|---------|-----------|`n"
        
        foreach ($prop in $registryData.PSObject.Properties) {
            $filePath = $prop.Name
            $type = $prop.Value.Type
            $created = $prop.Value.Created
            $mutations = ($prop.Value.MutationCompatible -join ", ")
            
            $registryContent += "| $filePath | $type | $created | $mutations |`n"
        }
        
        $registryContent | Out-File -FilePath "$Output/registry.md" -Encoding utf8
    }
}

# Documentation complete
Write-Host "`n[QUANTUM DOCUMENTATION COMPLETE]" -ForegroundColor Green
Write-Host "[Format: $Format]" -ForegroundColor Cyan
Write-Host "[Output Directory: $Output]" -ForegroundColor Cyan
Write-Host "[Files Generated: $(Get-ChildItem -Path $Output -File).Count]" -ForegroundColor Cyan

# Suggest next steps
Write-Host "`n[Next Steps]" -ForegroundColor Yellow
Write-Host "- Review documentation in the $Output directory" -ForegroundColor White
Write-Host "- Share documentation with team members" -ForegroundColor White
Write-Host "- Consider adding more detailed component documentation" -ForegroundColor White

if ($Format -eq "Fractal") {
    Write-Host "- Explore mythological patterns and component resonances" -ForegroundColor White
    Write-Host "- Analyze the recursive component map" -ForegroundColor White
    Write-Host "- Run with different recursion depths to discover new patterns" -ForegroundColor White
}

exit 0