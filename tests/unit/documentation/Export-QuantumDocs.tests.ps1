Describe "Export-QuantumDocs" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../Export-QuantumDocs.ps1"
        
        # Create test output directory
        $testOutputDir = Join-Path -Path $TestDrive -ChildPath "test-docs"
        
        # Mock dependencies
        Mock Get-Content { 
            return '{
                ".\/snippets\/meta-social.liquid": {
                    "Hash": "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017",
                    "Type": "liquid",
                    "Created": "2025-04-18T15:46:50.9508518-07:00",
                    "MutationCompatible": ["CyberLotus", "ObsidianBloom"]
                },
                ".\/assets\/neural-bus.js": {
                    "Hash": "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4",
                    "Type": "javascript",
                    "Created": "2025-04-18T15:46:50.9648573-07:00",
                    "MutationCompatible": ["VoidBloom", "NeonVortex"]
                }
            }' | ConvertFrom-Json 
        } -ParameterFilter { $Path -like "*quantum-registry.json" }
        
        # Mock file operations
        Mock Test-Path { return $true } -ParameterFilter { 
            $Path -like "*quantum-registry.json" -or 
            $Path -like "*.ps1" -or
            $Path -like "*.js" -or
            $Path -like "*.liquid"
        }
        
        Mock Test-Path { return $false } -ParameterFilter { 
            $Path -eq $testOutputDir
        }
        
        Mock Get-ChildItem { 
            return @(
                [PSCustomObject]@{
                    FullName = "c:\Users\user\Documents\Projects\CyberCore\assets\neural-bus.js"
                    Name = "neural-bus.js"
                    Extension = ".js"
                },
                [PSCustomObject]@{
                    FullName = "c:\Users\user\Documents\Projects\CyberCore\snippets\meta-social.liquid"
                    Name = "meta-social.liquid"
                    Extension = ".liquid"
                }
            )
        } -ParameterFilter { $Path -like "*.js" -or $Path -like "*.liquid" }
        
        # Mock JavaScript file content
        Mock Get-Content { 
            return @"
/**
 * Neural Bus Interface for Quantum State Management
 * @module NeuralBus
 */

class NeuralBus {
  /**
   * Initializes a new Neural Bus instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.nodes = new Map();
    this.synapses = [];
    this.quantum = options.quantum || false;
  }

  /**
   * Registers a new node in the neural network
   * @param {string} id - Unique identifier for the node
   * @param {Object} config - Node configuration
   * @returns {Object} - The registered node
   */
  registerNode(id, config) {
    if (this.nodes.has(id)) {
      throw new Error(`Node with ID ${id} already exists`);
    }
    
    const node = {
      id,
      ...config,
      connections: []
    };
    
    this.nodes.set(id, node);
    return node;
  }
}

export default NeuralBus;
"@
        } -ParameterFilter { $Path -like "*neural-bus.js" }
        
        # Mock Liquid file content
        Mock Get-Content { 
            return @"
{% comment %}
  Meta Social Component
  Provides social media metadata for quantum-aware sharing
  
  @variables
  - title: Page title
  - description: Page description
  - image: Featured image URL
  - canonical_url: Canonical URL
  
  @compatible CyberLotus, ObsidianBloom
{% endcomment %}

<meta property="og:title" content="{{ title | escape }}" />
<meta property="og:description" content="{{ description | escape }}" />
<meta property="og:image" content="{{ image | default: settings.default_social_image | absolute_url }}" />
<meta property="og:url" content="{{ canonical_url | absolute_url }}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="{{ shop.name }}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ title | escape }}" />
<meta name="twitter:description" content="{{ description | escape }}" />
<meta name="twitter:image" content="{{ image | default: settings.default_social_image | absolute_url }}" />
"@
        } -ParameterFilter { $Path -like "*meta-social.liquid" }
        
        # Mock file system operations
        Mock New-Item { return [PSCustomObject]@{ Path = $Path } }
        Mock Copy-Item { return $null }
        Mock Set-Content { return $null }
        Mock Out-File { return $null }
        
        # Dot source the script to make its functions available
        . $scriptPath
    }
    
    Context "Output Directory Management" {
        It "Should create the output directory if it doesn't exist" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir
            
            # Assert
            Should -Invoke New-Item -Times 1 -ParameterFilter { 
                $Path -eq $testOutputDir -and 
                $ItemType -eq "Directory" 
            }
        }
        
        It "Should backup existing documentation when output directory exists" {
            # Mock to make output directory exist
            Mock Test-Path { return $true } -ParameterFilter { $Path -eq $testOutputDir }
            
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir
            
            # Assert
            Should -Invoke Copy-Item -Times 1 -ParameterFilter { 
                $Destination -match "backup" -and
                $Recurse -eq $true
            }
            
            # Restore original mock
            Mock Test-Path { return $false } -ParameterFilter { $Path -eq $testOutputDir }
        }
    }
    
    Context "Documentation Format Options" {
        It "Should generate Markdown format documentation" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir
            
            # Assert
            Should -Invoke Out-File -Times AtLeast 1 -ParameterFilter { 
                $FilePath -like "$testOutputDir/*.md" 
            }
        }
        
        It "Should generate HTML format documentation" {
            # Act
            & $scriptPath -Format "HTML" -Output $testOutputDir
            
            # Assert
            Should -Invoke Out-File -Times AtLeast 1 -ParameterFilter { 
                $FilePath -like "$testOutputDir/*.html" 
            }
        }
        
        It "Should generate JSON format documentation" {
            # Act
            & $scriptPath -Format "JSON" -Output $testOutputDir
            
            # Assert
            Should -Invoke Out-File -Times AtLeast 1 -ParameterFilter { 
                $FilePath -like "$testOutputDir/*.json" 
            }
        }
    }
    
    Context "Detail Level Control" {
        BeforeAll {
            # Spy to track what detail level is used
            $Script:detailLevelTracker = @{}
            
            # Mock to track detail level usage
            Mock Out-File { 
                $content = $InputObject
                if ($content -match "Basic details only") {
                    $Script:detailLevelTracker["Basic"] = $true
                }
                elseif ($content -match "Detailed information") {
                    $Script:detailLevelTracker["Detailed"] = $true
                }
                elseif ($content -match "Full comprehensive documentation") {
                    $Script:detailLevelTracker["Full"] = $true
                }
                elseif ($content -match "Recursive analysis") {
                    $Script:detailLevelTracker["Recursive"] = $true
                }
            }
        }
        
        BeforeEach {
            $Script:detailLevelTracker = @{}
        }
        
        It "Should respect Basic detail level" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -DetailLevel "Basic"
            
            # Assert
            $Script:detailLevelTracker.ContainsKey("Basic") | Should -Be $true
            $Script:detailLevelTracker.ContainsKey("Full") | Should -Be $false
        }
        
        It "Should respect Full detail level" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -DetailLevel "Full"
            
            # Assert
            $Script:detailLevelTracker.ContainsKey("Full") | Should -Be $true
        }
    }
    
    Context "Content Generation Options" {
        It "Should include registry information when requested" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -IncludeRegistry
            
            # Assert
            Should -Invoke Out-File -Times 1 -ParameterFilter { 
                $FilePath -eq "$testOutputDir/registry.md" 
            }
        }
        
        It "Should include schemas when requested" {
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -IncludeSchemas
            
            # Assert
            Should -Invoke Out-File -Times AtLeast 1 -ParameterFilter { 
                $FilePath -like "$testOutputDir/schemas/*" 
            }
        }
    }
    
    Context "Mythological Pattern Analysis" {
        It "Should perform mythological pattern analysis when enabled" {
            # Setup spy to track mythological analysis
            $mythologicalSpy = $false
            
            Mock Out-File { 
                if ($InputObject -match "Mythological Pattern Analysis") {
                    $mythologicalSpy = $true
                }
            }
            
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -EnableMythologicalPatterns
            
            # Assert
            $mythologicalSpy | Should -Be $true
        }
    }
    
    Context "Recursion Depth Control" {
        It "Should respect specified recursion depth" {
            # Create spy
            $recursionSpy = $false
            
            Mock Out-File { 
                if ($InputObject -match "Recursion depth: 5") {
                    $recursionSpy = $true
                }
            }
            
            # Act
            & $scriptPath -Format "Markdown" -Output $testOutputDir -RecursionDepth 5
            
            # Assert
            $recursionSpy | Should -Be $true
        }
    }
}