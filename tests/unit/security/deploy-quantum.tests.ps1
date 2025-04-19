Describe "Deploy-Quantum" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../deploy-quantum.ps1"
        
        # Mock dependencies
        Mock Get-Content { return '{"Production": "secure-nonce", "Staging": "test-nonce", "Development": "dev-nonce"}' | ConvertFrom-Json } -ParameterFilter { $Path -like "*nonce-registry.json" }
        
        Mock Get-Content { return '{".\/snippets\/meta-social.liquid": {"MutationCompatible": ["CyberLotus","ObsidianBloom"], "Type": "liquid", "Hash": "test-hash"}}' | ConvertFrom-Json } -ParameterFilter { $Path -like "*quantum-registry.json" }
        
        Mock Test-Path { return $true } -ParameterFilter { $Path -like "*quantum-registry.json" -or $Path -like "*nonce-registry.json" -or $Path -like "*blueprints/*.json" -or $Path -eq "./quantum-forge.ps1" }
        
        # Mock file operations
        Mock New-Item { return $null }
        Mock Copy-Item { return $null }
        Mock Set-Content { return $null }
        Mock ConvertTo-Json { return "{}" }
        Mock Out-File { return $null }
        
        # Mock external script calls
        Mock Invoke-Expression { return 0 } -ParameterFilter { $Command -like "*./quantum-integrity.ps1*" -or $Command -like "*./quantum-forge.ps1*" }
        
        # Dot source the script to make its functions available
        . $scriptPath
    }
    
    Context "Deployment Prerequisites Validation" {
        It "Should validate required files exist before deployment" {
            # Temporarily mock Test-Path to return false for a required file
            Mock Test-Path { return $false } -ParameterFilter { $Path -eq "./config/quantum-registry.json" }
            
            # Act & Assert - should throw because prerequisite is missing
            { & $scriptPath -Env Development -ConfirmPolicy Lenient } | Should -Throw
            
            # Restore the mock
            Mock Test-Path { return $true } -ParameterFilter { $Path -like "*quantum-registry.json" -or $Path -like "*nonce-registry.json" -or $Path -like "*blueprints/*.json" -or $Path -eq "./quantum-forge.ps1" }
        }
        
        It "Should proceed when all prerequisites are met" {
            # Act & Assert - should not throw with all prerequisites
            { & $scriptPath -Env Development -ConfirmPolicy Lenient } | Should -Not -Throw
        }
    }
    
    Context "Nonce Rotation" {
        It "Should rotate security nonces for non-Development environments" {
            # Act
            & $scriptPath -Env Staging -ConfirmPolicy Strict -NoncePolicy Auto
            
            # Assert
            Should -Invoke ConvertTo-Json -Times 1 -ParameterFilter { $InputObject -is [System.Collections.IDictionary] }
            Should -Invoke Set-Content -Times 1 -ParameterFilter { $Path -eq "./config/nonce-registry.json" }
        }
        
        It "Should not rotate nonces for Development environment" {
            # Act
            & $scriptPath -Env Development -ConfirmPolicy Lenient -NoncePolicy Auto
            
            # Assert
            Should -Not -Invoke Set-Content -ParameterFilter { $Path -eq "./config/nonce-registry.json" }
        }
    }
    
    Context "Integrity Checks" {
        It "Should run integrity checks in strict policy mode" {
            # Act
            & $scriptPath -Env Production -ConfirmPolicy Strict
            
            # Assert
            Should -Invoke Invoke-Expression -Times 1 -ParameterFilter { $Command -like "*./quantum-integrity.ps1*" }
        }
        
        It "Should block deployment if integrity check fails and policy is Strict" {
            # Mock a failed integrity check
            Mock Invoke-Expression { return 1 } -ParameterFilter { $Command -like "*./quantum-integrity.ps1*" }
            
            # Act & Assert
            { & $scriptPath -Env Production -ConfirmPolicy Strict } | Should -Throw
            
            # Restore mock
            Mock Invoke-Expression { return 0 } -ParameterFilter { $Command -like "*./quantum-integrity.ps1*" }
        }
    }
    
    Context "Deployment" {
        It "Should create the deployment directory if it doesn't exist" {
            # Mock directory existence check
            Mock Test-Path { return $false } -ParameterFilter { $Path -like "./deploy/*" }
            
            # Act
            & $scriptPath -Env Development -ConfirmPolicy Lenient
            
            # Assert
            Should -Invoke New-Item -Times 1 -ParameterFilter { $Path -like "./deploy/*" -and $ItemType -eq "Directory" }
        }
        
        It "Should create a deployment manifest" {
            # Act
            & $scriptPath -Env Production -ConfirmPolicy Strict
            
            # Assert
            Should -Invoke Set-Content -Times AtLeast 1 -ParameterFilter { $Path -like "./deploy/prod/deployment-manifest.json" }
        }
    }
    
    Context "Rebuild Functionality" {
        It "Should rebuild artifacts when ForceRebuild is specified" {
            # Act
            & $scriptPath -Env Staging -ConfirmPolicy Lenient -ForceRebuild
            
            # Assert
            Should -Invoke Invoke-Expression -Times 1 -ParameterFilter { $Command -like "*./quantum-forge.ps1*" }
        }
        
        It "Should block deployment if rebuild fails" {
            # Mock a failed rebuild
            Mock Invoke-Expression { return 1 } -ParameterFilter { $Command -like "*./quantum-forge.ps1*" }
            
            # Act & Assert
            { & $scriptPath -Env Staging -ConfirmPolicy Lenient -ForceRebuild } | Should -Throw
            
            # Restore mock
            Mock Invoke-Expression { return 0 } -ParameterFilter { $Command -like "*./quantum-forge.ps1*" }
        }
    }
}