Describe "Install-TestDependencies" {
    BeforeAll {
        # Path to the script being tested
        $scriptPath = "$PSScriptRoot/../../../Install-TestDependencies.ps1"
        
        # Mock PowerShell cmdlets
        Mock Get-PackageProvider { return @{Name = "NuGet"; Version = "3.0.0"} }
        Mock Install-PackageProvider { return @{Name = "NuGet"; Version = "3.0.0"} }
        Mock Set-PSRepository { return $null }
        Mock Get-InstalledModule { 
            param($Name)
            
            if ($Name -eq "Pester" -and $Script:MockPesterInstalled) {
                return @{
                    Name = "Pester"
                    Version = "5.7.1"
                }
            }
            
            if ($Name -eq "PSScriptAnalyzer" -and $Script:MockScriptAnalyzerInstalled) {
                return @{
                    Name = "PSScriptAnalyzer"
                    Version = "1.21.0"
                }
            }
            
            return $null
        }
        
        Mock Install-Module { 
            param($Name)
            
            if ($Name -eq "Pester") {
                $Script:MockPesterInstalled = $true
            }
            
            if ($Name -eq "PSScriptAnalyzer") {
                $Script:MockScriptAnalyzerInstalled = $true
            }
            
            return $null
        }
        
        Mock npm { return 0 }
        Mock npx { return 0 }
        Mock Write-Host { return $null }
        
        # Initialize test variables
        $Script:MockPesterInstalled = $false
        $Script:MockScriptAnalyzerInstalled = $false
        
        # Dot source the script to make its functions available
        . $scriptPath
    }
    
    BeforeEach {
        # Reset the variables before each test
        $Script:MockPesterInstalled = $false
        $Script:MockScriptAnalyzerInstalled = $false
    }
    
    Context "PowerShell Dependency Installation" {
        It "Should install Pester if not already installed" {
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Install-Module -Times 1 -ParameterFilter { $Name -eq "Pester" }
        }
        
        It "Should skip Pester installation if already installed" {
            # Arrange - mock that Pester is already installed
            $Script:MockPesterInstalled = $true
            
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Install-Module -Times 0 -ParameterFilter { $Name -eq "Pester" }
        }
        
        It "Should install PSScriptAnalyzer if not already installed" {
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Install-Module -Times 1 -ParameterFilter { $Name -eq "PSScriptAnalyzer" }
        }
        
        It "Should skip PSScriptAnalyzer installation if already installed" {
            # Arrange - mock that PSScriptAnalyzer is already installed
            $Script:MockScriptAnalyzerInstalled = $true
            
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Install-Module -Times 0 -ParameterFilter { $Name -eq "PSScriptAnalyzer" }
        }
    }
    
    Context "JavaScript Dependency Installation" {
        It "Should install Node.js dependencies when not skipped" {
            # Act
            & $scriptPath
            
            # Assert
            Should -Invoke npm -Times 1 -ParameterFilter { $args -contains "install" }
        }
        
        It "Should skip Node.js dependencies when specified" {
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke npm -Times 0
        }
    }
    
    Context "Package Repository Setup" {
        It "Should configure NuGet package provider if needed" {
            # Mock NuGet not being available
            Mock Get-PackageProvider { 
                throw "Package provider 'NuGet' is not installed." 
            }
            
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Install-PackageProvider -Times 1 -ParameterFilter { $Name -eq "NuGet" }
        }
        
        It "Should set PSGallery as trusted repository" {
            # Act
            & $scriptPath -SkipJavaScript
            
            # Assert
            Should -Invoke Set-PSRepository -Times 1 -ParameterFilter { 
                $Name -eq "PSGallery" -and $InstallationPolicy -eq "Trusted" 
            }
        }
    }
    
    Context "Force Parameter Behavior" {
        It "Should force install modules when Force is specified" {
            # Arrange - mock that dependencies are already installed
            $Script:MockPesterInstalled = $true
            $Script:MockScriptAnalyzerInstalled = $true
            
            # Act
            & $scriptPath -Force -SkipJavaScript
            
            # Assert - should install anyway due to Force
            Should -Invoke Install-Module -Times 1 -ParameterFilter { 
                $Name -eq "Pester" -and $Force -eq $true 
            }
            Should -Invoke Install-Module -Times 1 -ParameterFilter { 
                $Name -eq "PSScriptAnalyzer" -and $Force -eq $true 
            }
        }
    }
}