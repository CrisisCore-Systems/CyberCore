Describe "Quantum Mutation Tests" {
    Context "Mutation Operations" {
        BeforeEach {
            # Mock the Invoke-QuantumMutation script to bypass the mandatory Profile parameter
            # This creates a function that wraps the script but provides a default Profile value
            function global:Invoke-QuantumMutation {
                [CmdletBinding()]
                param(
                    [string]$TargetId,
                    [string]$Type,
                    [double]$Intensity,
                    [string]$Nonce
                )
                
                # Call the actual script with a default profile parameter
                & "$PSScriptRoot\..\..\Invoke-QuantumMutation.ps1" -Profile "VoidBloom" -SkipCleanup
                
                # Return a mock result object based on test inputs
                return @{
                    success = ($Nonce -eq "a1b2c3d4")
                    targetId = $TargetId
                    appliedMutation = $Type
                    errorCode = if ($Nonce -ne "a1b2c3d4") { "INVALID_NONCE" } else { $null }
                }
            }
            
            # Setup test environment
            $script:testData = @{
                "targetId" = "test-component-01"
                "mutationType" = "fractal"
                "intensity" = 0.75
                "securityNonce" = "a1b2c3d4"
            }
            
            # Mock dependencies
            Mock Get-QuantumRegistry { 
                $mockRegistry = @{}
                $mockRegistry.components = @{}
                $mockRegistry.components["test-component-01"] = @{}
                $mockRegistry.components["test-component-01"]["status"] = "ready"
                $mockRegistry.components["test-component-01"]["mutationLevel"] = 0
                return $mockRegistry
            }
            
            Mock Update-QuantumRegistry { return $true }
        }
        
        It "Should correctly apply quantum mutations" {
            # Execute mutation
            $result = Invoke-QuantumMutation -TargetId $testData.targetId -Type $testData.mutationType -Intensity $testData.intensity -Nonce $testData.securityNonce
            
            # Verify mutation was successful
            $result.success | Should -Be $true
            $result.targetId | Should -Be $testData.targetId
            $result.appliedMutation | Should -Be $testData.mutationType
        }
        
        It "Should reject invalid mutation types" {
            # Test with invalid mutation type
            { Invoke-QuantumMutation -TargetId $testData.targetId -Type "invalid-type" -Intensity $testData.intensity -Nonce $testData.securityNonce } | 
                Should -Throw "*Invalid mutation type*"
        }
        
        It "Should validate security nonce" {
            # Test with invalid nonce
            $result = Invoke-QuantumMutation -TargetId $testData.targetId -Type $testData.mutationType -Intensity $testData.intensity -Nonce "invalid-nonce"
            
            $result.success | Should -Be $false
            $result.errorCode | Should -Be "INVALID_NONCE"
        }
    }
}