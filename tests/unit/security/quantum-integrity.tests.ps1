Describe "Quantum-Integrity" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../quantum-integrity.ps1"
        
        # Mock dependencies
        Mock Get-Content { 
            return '{
                ".\/snippets\/meta-social.liquid": {
                    "Hash": "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017",
                    "Type": "liquid",
                    "Created": "2025-04-18T15:46:50.9508518-07:00",
                    "MutationCompatible": ["CyberLotus"]
                }
            }' | ConvertFrom-Json 
        } -ParameterFilter { $Path -like "*quantum-registry.json" }
        
        Mock Test-Path { return $true } -ParameterFilter { 
            $Path -like "*quantum-registry.json" -or 
            $Path -like "*nonce-registry.json" -or 
            $Path -like "*quantum-backups*" 
        }
        
        # Mock file operations
        Mock New-Item { return $null }
        Mock Copy-Item { return $null }
        Mock Set-Content { return $null }
        Mock Get-FileHash { return [PSCustomObject]@{ Hash = "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017" } } -ParameterFilter { $Path -like "*meta-social.liquid" }
        Mock Get-ChildItem { 
            return @(
                [PSCustomObject]@{
                    FullName = "c:\Users\user\Documents\Projects\CyberCore\snippets\meta-social.liquid"
                    Name = "meta-social.liquid"
                    Extension = ".liquid"
                }
            )
        }
        
        # Intercept exit code
        Mock Exit { return $args[0] }
        
        # Create test functions to override static methods
        function Get-StaticArtifacts {
            return @{
                "./snippets/meta-social.liquid" = @{
                    Hash = "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017"
                    Type = "liquid"
                    Created = "2025-04-18T15:46:50.9508518-07:00"
                    MutationCompatible = @("CyberLotus")
                }
            }
        }
        
        # Mock file content
        Mock Get-Content { return "// CyberLotus Quantum Profile //" } -ParameterFilter { $Path -like "*meta-social.liquid" }
        
        # Dot source the script to make its functions available
        . $scriptPath
    }
    
    Context "Integrity Verification Mode" {
        It "Should verify integrity of files registered in quantum registry" {
            # Act
            $result = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Assert - we're mocking everything to be valid, so it should exit with 0
            $result | Should -Be 0
        }
        
        It "Should detect integrity violations when file hash doesn't match registry" {
            # Mock a tampered file
            Mock Get-FileHash { return [PSCustomObject]@{ Hash = "TAMPERED_HASH_VALUE" } } -ParameterFilter { $Path -like "*meta-social.liquid" }
            
            # Act
            $result = & $scriptPath -TargetDir "." -MutationProfile "All"
            
            # Assert - should not exit with 0 when breach detected
            $result | Should -Not -Be 0
            
            # Restore mock
            Mock Get-FileHash { return [PSCustomObject]@{ Hash = "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017" } } -ParameterFilter { $Path -like "*meta-social.liquid" }
        }
    }
    
    Context "Repair Mode" {
        BeforeAll {
            # Mock the UpdateRegistry static method
            Mock Set-Content { return $null } -ParameterFilter { $Path -like "*quantum-registry.json" }
        }
        
        It "Should create backups when CreateBackups is specified" {
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "All" -Force -CreateBackups
            
            # Assert
            Should -Invoke New-Item -Times AtLeast 1 -ParameterFilter { $Path -like "*quantum-backups*" -and $ItemType -eq "Directory" }
            Should -Invoke Copy-Item -Times AtLeast 1
        }
        
        It "Should add missing mutation markers to files" {
            # Mock a file without mutation marker
            Mock Get-Content { return "// File content without mutation marker" } -ParameterFilter { $Path -like "*meta-social.liquid" }
            
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "CyberLotus" -Force
            
            # Assert
            Should -Invoke Set-Content -Times AtLeast 1 -ParameterFilter { $Path -like "*meta-social.liquid" }
        }
        
        It "Should update the registry with new hash values after repair" {
            # Mock a tampered file
            Mock Get-FileHash { 
                return [PSCustomObject]@{ Hash = "TAMPERED_HASH_VALUE" } 
            } -ParameterFilter { $Path -like "*meta-social.liquid" -and $Script:FirstCall -eq $true }
            
            # After repair, return corrected hash
            $Script:FirstCall = $true
            Mock Get-FileHash { 
                if ($Script:FirstCall) {
                    $Script:FirstCall = $false
                    return [PSCustomObject]@{ Hash = "TAMPERED_HASH_VALUE" }
                } else {
                    return [PSCustomObject]@{ Hash = "CORRECTED_HASH_VALUE" }
                }
            } -ParameterFilter { $Path -like "*meta-social.liquid" }
            
            # Act
            & $scriptPath -TargetDir "." -MutationProfile "CyberLotus" -Force
            
            # Assert
            Should -Invoke Set-Content -Times AtLeast 1 -ParameterFilter { $Path -like "*quantum-registry.json" }
        }
    }
    
    Context "Mutation Profile Filtering" {
        BeforeAll {
            # Expand our mock registry to include files with different mutation profiles
            Mock Get-Content { 
                return '{
                    ".\/snippets\/meta-social.liquid": {
                        "Hash": "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017",
                        "Type": "liquid",
                        "Created": "2025-04-18T15:46:50.9508518-07:00",
                        "MutationCompatible": ["CyberLotus"]
                    },
                    ".\/snippets\/quantum-layer.liquid": {
                        "Hash": "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4",
                        "Type": "liquid",
                        "Created": "2025-04-18T15:46:50.9648573-07:00",
                        "MutationCompatible": ["VoidBloom"]
                    }
                }' | ConvertFrom-Json 
            } -ParameterFilter { $Path -like "*quantum-registry.json" }
            
            function Get-StaticArtifacts {
                return @{
                    "./snippets/meta-social.liquid" = @{
                        Hash = "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017"
                        Type = "liquid"
                        Created = "2025-04-18T15:46:50.9508518-07:00"
                        MutationCompatible = @("CyberLotus")
                    }
                    "./snippets/quantum-layer.liquid" = @{
                        Hash = "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4"
                        Type = "liquid"
                        Created = "2025-04-18T15:46:50.9648573-07:00"
                        MutationCompatible = @("VoidBloom")
                    }
                }
            }
            
            # Update our mock file listing
            Mock Get-ChildItem { 
                return @(
                    [PSCustomObject]@{
                        FullName = "c:\Users\user\Documents\Projects\CyberCore\snippets\meta-social.liquid"
                        Name = "meta-social.liquid"
                        Extension = ".liquid"
                    },
                    [PSCustomObject]@{
                        FullName = "c:\Users\user\Documents\Projects\CyberCore\snippets\quantum-layer.liquid"
                        Name = "quantum-layer.liquid"
                        Extension = ".liquid"
                    }
                )
            }
            
            # Mock content and hash for quantum-layer.liquid
            Mock Get-Content { return "// VoidBloom Quantum Profile //" } -ParameterFilter { $Path -like "*quantum-layer.liquid" }
            Mock Get-FileHash { return [PSCustomObject]@{ Hash = "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4" } } -ParameterFilter { $Path -like "*quantum-layer.liquid" }
        }
        
        It "Should only process files with the specified mutation profile" {
            # Spy on our mocks
            $metaSocialSpy = New-Object 'System.Collections.Generic.List[bool]'
            $quantumLayerSpy = New-Object 'System.Collections.Generic.List[bool]'
            
            Mock Get-FileHash { 
                $metaSocialSpy.Add($true) 
                return [PSCustomObject]@{ Hash = "8E7771CE2151C1F281AE68BC63E860ECE963BB7BE2C94445E85508EBEC946017" } 
            } -ParameterFilter { $Path -like "*meta-social.liquid" }
            
            Mock Get-FileHash { 
                $quantumLayerSpy.Add($true)
                return [PSCustomObject]@{ Hash = "040E29E77D9DFABF9E98D73FBA81CC840FB7D306E6974ADACADEF37331A4" } 
            } -ParameterFilter { $Path -like "*quantum-layer.liquid" }
            
            # Act - only check CyberLotus files
            & $scriptPath -TargetDir "." -MutationProfile "CyberLotus" -Force
            
            # Assert - should only have checked meta-social.liquid (CyberLotus profile)
            $metaSocialSpy.Count | Should -BeGreaterThan 0
            $quantumLayerSpy.Count | Should -Be 0
            
            # Reset spies
            $metaSocialSpy.Clear()
            $quantumLayerSpy.Clear()
            
            # Act - check all files
            & $scriptPath -TargetDir "." -MutationProfile "All" -Force
            
            # Assert - should have checked both files
            $metaSocialSpy.Count | Should -BeGreaterThan 0
            $quantumLayerSpy.Count | Should -BeGreaterThan 0
        }
    }
}