Describe "Quantum-Inspector" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../quantum-inspector.ps1"
        
        # Mock dependencies
        Mock Get-Content { 
            return '{
                ".\/snippets\/meta-social.liquid": {
                    "Hash": "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017",
                    "Type": "liquid",
                    "Created": "2025-04-18T15:46:50.9508518-07:00",
                    "MutationCompatible": ["CyberLotus", "ObsidianBloom"]
                },
                ".\/snippets\/quantum-layer.liquid": {
                    "Hash": "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4",
                    "Type": "liquid",
                    "Created": "2025-04-18T15:46:50.9648573-07:00",
                    "MutationCompatible": ["VoidBloom", "NeonVortex"]
                }
            }' | ConvertFrom-Json 
        } -ParameterFilter { $Path -like "*quantum-registry.json" }
        
        # Mock file operations
        Mock Test-Path { return $true } -ParameterFilter { 
            $Path -like "*quantum-registry.json" -or 
            $Path -like "./blueprints/*.json"
        }
        
        Mock Get-ChildItem { 
            return @(
                [PSCustomObject]@{
                    FullName = "c:\Users\user\Documents\Projects\CyberCore\blueprints\core.json"
                    BaseName = "core"
                    Name = "core.json"
                    Extension = ".json"
                }
            )
        } -ParameterFilter { $Path -like "./blueprints" -and $Filter -eq "*.json" }
        
        Mock Get-Content { 
            return '{
                "theme": {
                    "name": "quantum-theme",
                    "files": ["layout/theme.liquid", "assets/neural-bus.js"]
                }
            }' 
        } -ParameterFilter { $Path -like "*\blueprints\core.json" }
        
        # Mock file content for specific files
        Mock Test-Path { return $true } -ParameterFilter { 
            $Path -like "*neural-bus.js" -or
            $Path -like "*header.liquid" -or
            $Path -like "*footer.liquid" -or
            $Path -like "*theme.liquid"
        }
        
        # Mock conversions
        Mock ConvertTo-Json { return "{}" }
        Mock Out-File { return $null }
        Mock Set-Content { return $null }
        
        # Intercept exit code
        Mock Exit { return $args[0] }
        
        # Dot source the script to make its functions available
        . $scriptPath
    }
    
    Context "Component Requirements" {
        It "Should validate required components exist" {
            # Act
            $result = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Assert
            $result | Should -Be 0 # Success exit code
        }
        
        It "Should detect missing required components" {
            # Mock to make a required component missing
            Mock Test-Path { return $false } -ParameterFilter { $Path -like "*header.liquid" }
            
            # Act
            $result = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Assert
            $result | Should -Not -Be 0 # Non-zero exit code indicates issues
            
            # Restore mock
            Mock Test-Path { return $true } -ParameterFilter { 
                $Path -like "*header.liquid"
            }
        }
    }
    
    Context "Mutation Compatibility" {
        It "Should identify components compatible with a specific mutation profile" {
            # Create a spy to track the mutation profile check
            $compCheckedSpy = @{}
            
            # Mock function to check component existence with a specific profile
            Mock Test-Path { 
                if ($Path -like "*quantum-layer.liquid") {
                    $compCheckedSpy["quantum-layer"] = $true
                    return $true
                }
                
                if ($Path -like "*meta-social.liquid") {
                    $compCheckedSpy["meta-social"] = $true
                    return $true
                }
                
                return $true
            } -ParameterFilter { $Path -like "*liquid" }
            
            # Act - run inspection for VoidBloom profile only
            & $scriptPath -TargetDir "." -MutationProfile "VoidBloom"
            
            # Assert - should have checked quantum-layer.liquid for VoidBloom compatibility
            $compCheckedSpy.ContainsKey("quantum-layer") | Should -Be $true
        }
    }
    
    Context "DeepScan Mode" {
        It "Should perform additional checks when DeepScan is enabled" {
            # Setup spy
            $deepScanSpy = $false
            
            # Mock a function that should only be called during deep scan
            Mock Invoke-Expression { 
                $deepScanSpy = $true
                return 0 
            } -ParameterFilter { $Command -match "Get-QuantumVulnerability" }
            
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "All" -DeepScan
            
            # Assert
            $deepScanSpy | Should -Be $true
        }
    }
    
    Context "Reporting" {
        It "Should generate an inspection report when specified" {
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "All" -GenerateReport
            
            # Assert
            Should -Invoke ConvertTo-Json -Times 1
            Should -Invoke Out-File -Times 1 -ParameterFilter { $FilePath -like "*quantum-inspection-report.json" }
        }
        
        It "Should respect custom output path for reports" {
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "All" -GenerateReport -OutputPath "./custom-report.json"
            
            # Assert
            Should -Invoke Out-File -Times 1 -ParameterFilter { $FilePath -eq "./custom-report.json" }
        }
    }
    
    Context "MutationCheck Mode" {
        It "Should perform mutation compatibility checks when enabled" {
            # Setup spy
            $mutationCheckSpy = $false
            
            # Mock process that's only run during mutation checks
            Mock Get-Content {
                $mutationCheckSpy = $true
                return "{% comment %}@MutationCompatible: CyberLotus, ObsidianBloom{% endcomment %}"
            } -ParameterFilter { $Path -like "*liquid" }
            
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "All" -PerformMutationCheck
            
            # Assert
            $mutationCheckSpy | Should -Be $true
        }
    }
    
    Context "Health Score Calculation" {
        It "Should calculate health score based on component status" {
            # First run to get baseline score with healthy components
            $baselineResult = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Now introduce problems
            Mock Test-Path { return $false } -ParameterFilter { 
                $Path -like "*footer.liquid" -or
                $Path -like "*neural-bus.js"
            }
            
            # Act - run with compromised components
            $compromisedResult = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Assert - compromised score should be lower (higher exit code indicates issues)
            $compromisedResult | Should -BeGreaterThan $baselineResult
            
            # Restore mocks
            Mock Test-Path { return $true } -ParameterFilter { 
                $Path -like "*footer.liquid" -or
                $Path -like "*neural-bus.js"
            }
        }
    }
}