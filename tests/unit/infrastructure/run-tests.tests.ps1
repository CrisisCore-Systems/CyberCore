Describe "Run-Tests" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../run-tests.ps1"
        
        # Mock test configuration module
        Mock Import-Module { return $null }
        
        # Mock test configuration functions
        Mock Initialize-PSTestConfiguration {
            return @{
                TestPaths = @("./tests")
                Tags = @{
                    Include = @()
                    Exclude = @("Skip")
                }
                OutputPath = "./test-results"
                CodeCoverage = @{
                    Enabled = $true
                    Path = @("./*.ps1")
                }
                VerboseOutput = $false
            }
        }
        
        Mock Invoke-PSTests {
            if ($Script:MockTestSuccess) {
                return [PSCustomObject]@{
                    TotalCount = 10
                    PassedCount = 10
                    FailedCount = 0
                    Result = "Success"
                }
            } else {
                return [PSCustomObject]@{
                    TotalCount = 10
                    PassedCount = 7
                    FailedCount = 3
                    Result = "Failed"
                }
            }
        }
        
        # Mock Node.js/Jest testing
        Mock npm { return 0 }
        Mock npx { 
            if ($Script:MockJestSuccess) {
                $Global:LASTEXITCODE = 0
                return "Test Suites: 5 passed, 5 total"
            } else {
                $Global:LASTEXITCODE = 1
                return "Test Suites: 2 failed, 3 passed, 5 total"
            }
        }
        
        # Mock other utilities
        Mock Write-Host { return $null }
        Mock Join-Path { return "$args[0]/$args[1]" }
        Mock New-Item { return [PSCustomObject]@{ Path = $Path } }
        Mock Test-Path { return $true }
        
        # Initialize test variables
        $Script:MockTestSuccess = $true
        $Script:MockJestSuccess = $true
        
        # Intercept exit code
        Mock Exit { return $args[0] }
    }
    
    BeforeEach {
        # Reset the success flags before each test
        $Script:MockTestSuccess = $true
        $Script:MockJestSuccess = $true
    }
    
    Context "Test Directory Setup" {
        It "Should create test output directory if it doesn't exist" {
            # Arrange
            Mock Test-Path { return $false } -ParameterFilter { $Path -like "*test-results" }
            
            # Act
            & $scriptPath
            
            # Assert
            Should -Invoke New-Item -Times 1 -ParameterFilter { 
                $Path -like "*test-results" -and $ItemType -eq "Directory" 
            }
        }
    }
    
    Context "PowerShell Test Execution" {
        It "Should run PowerShell tests when not skipped" {
            # Act
            & $scriptPath
            
            # Assert
            Should -Invoke Invoke-PSTests -Times 1
        }
        
        It "Should skip PowerShell tests when JSOnly is specified" {
            # Act
            & $scriptPath -JSOnly
            
            # Assert
            Should -Invoke Invoke-PSTests -Times 0
        }
        
        It "Should report PowerShell test success correctly" {
            # Arrange
            $Script:MockTestSuccess = $true
            
            # Act
            $result = & $scriptPath -PSOnly
            
            # Assert - should exit with code 0 on success
            $result | Should -Be 0
        }
        
        It "Should report PowerShell test failures correctly" {
            # Arrange
            $Script:MockTestSuccess = $false
            
            # Act
            $result = & $scriptPath -PSOnly
            
            # Assert - should exit with non-zero code on failure
            $result | Should -Be 1
        }
    }
    
    Context "JavaScript Test Execution" {
        It "Should run JavaScript tests when not skipped" {
            # Act
            & $scriptPath
            
            # Assert
            Should -Invoke npx -Times 1 -ParameterFilter { $args -contains "jest" }
        }
        
        It "Should skip JavaScript tests when PSOnly is specified" {
            # Act
            & $scriptPath -PSOnly
            
            # Assert
            Should -Invoke npx -Times 0
        }
        
        It "Should include coverage when not skipped" {
            # Act
            & $scriptPath
            
            # Assert
            Should -Invoke npx -Times 1 -ParameterFilter { $args -contains "--coverage" }
        }
        
        It "Should skip coverage when specified" {
            # Act
            & $scriptPath -SkipCoverage
            
            # Assert
            Should -Invoke npx -Times 1 -ParameterFilter { $args -notcontains "--coverage" }
        }
        
        It "Should report JavaScript test success correctly" {
            # Arrange
            $Script:MockJestSuccess = $true
            
            # Act
            $result = & $scriptPath -JSOnly
            
            # Assert - should exit with code 0 on success
            $result | Should -Be 0
        }
        
        It "Should report JavaScript test failures correctly" {
            # Arrange
            $Script:MockJestSuccess = $false
            
            # Act
            $result = & $scriptPath -JSOnly
            
            # Assert - should exit with non-zero code on failure
            $result | Should -Be 1
        }
    }
    
    Context "Verbose Mode" {
        It "Should pass verbose flag to test configuration when specified" {
            # Act
            & $scriptPath -Verbose
            
            # Assert
            Should -Invoke Initialize-PSTestConfiguration -Times 1 -ParameterFilter { 
                $VerboseOutput -eq $true 
            }
        }
    }
    
    Context "Summary Output" {
        It "Should display summary with correct test counts" {
            # Act
            & $scriptPath
            
            # Assert - check that it calls Write-Host to display summary
            Should -Invoke Write-Host -Times AtLeast 1 -ParameterFilter { 
                $Object -match "Total" -or $Object -match "Passed" -or $Object -match "Failed" 
            }
        }
    }
    
    Context "Combined Test Results" {
        It "Should succeed when all tests pass" {
            # Arrange
            $Script:MockTestSuccess = $true
            $Script:MockJestSuccess = $true
            
            # Act
            $result = & $scriptPath
            
            # Assert
            $result | Should -Be 0
        }
        
        It "Should fail when PowerShell tests fail" {
            # Arrange
            $Script:MockTestSuccess = $false
            $Script:MockJestSuccess = $true
            
            # Act
            $result = & $scriptPath
            
            # Assert
            $result | Should -Be 1
        }
        
        It "Should fail when JavaScript tests fail" {
            # Arrange
            $Script:MockTestSuccess = $true
            $Script:MockJestSuccess = $false
            
            # Act
            $result = & $scriptPath
            
            # Assert
            $result | Should -Be 1
        }
        
        It "Should fail when both PowerShell and JavaScript tests fail" {
            # Arrange
            $Script:MockTestSuccess = $false
            $Script:MockJestSuccess = $false
            
            # Act
            $result = & $scriptPath
            
            # Assert
            $result | Should -Be 1
        }
    }
}