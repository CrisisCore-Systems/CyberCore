# CyberCore Visual Test Progress Module
# This module enhances test output with visual elements and progress indicators

function Initialize-VisualProgress {
    [CmdletBinding()]
    param()
    
    # Clear the console for a clean starting point
    Clear-Host
    
    # Display banner
    Write-CyberCoreBanner
    
    # Create state object for tracking progress
    $script:visualProgressState = @{
        PSTestsTotal = 0
        PSTestsCompleted = 0
        JSTestsTotal = 0
        JSTestsCompleted = 0
        StartTime = Get-Date
        LastProgressUpdate = Get-Date
        TestResults = @{
            PS = @{
                Passed = 0
                Failed = 0
                Skipped = 0
            }
            JS = @{
                Passed = 0
                Failed = 0
                Skipped = 0
            }
        }
    }
    
    return $script:visualProgressState
}

function Write-CyberCoreBanner {
    $banner = @"
    
 ██████╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║     ██║   ██║██████╔╝█████╗  
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║     ██║   ██║██╔══██╗██╔══╝  
╚██████╗   ██║   ██████╔╝███████╗██║  ██║╚██████╗╚██████╔╝██║  ██║███████╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                                           
████████╗███████╗███████╗████████╗    ██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗███████╗██████╗ 
╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝    ██╔══██╗██║   ██║████╗  ██║████╗  ██║██╔════╝██╔══██╗
   ██║   █████╗  ███████╗   ██║       ██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
   ██║   ██╔══╝  ╚════██║   ██║       ██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
   ██║   ███████╗███████║   ██║       ██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║███████╗██║  ██║
   ╚═╝   ╚══════╝╚══════╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
                                                                                            
"@
    Write-Host $banner -ForegroundColor Cyan
}

function Update-TestProgress {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet('PS', 'JS')]
        [string]$TestType,
        
        [Parameter(Mandatory=$false)]
        [int]$TotalTests = 0,
        
        [Parameter(Mandatory=$false)]
        [int]$CompletedTests = 0,
        
        [Parameter(Mandatory=$false)]
        [int]$PassedTests = 0,
        
        [Parameter(Mandatory=$false)]
        [int]$FailedTests = 0,
        
        [Parameter(Mandatory=$false)]
        [int]$SkippedTests = 0,
        
        [Parameter(Mandatory=$false)]
        [switch]$Complete
    )
    
    # Update state
    if ($TotalTests -gt 0) {
        if ($TestType -eq 'PS') {
            $script:visualProgressState.PSTestsTotal = $TotalTests
        } else {
            $script:visualProgressState.JSTestsTotal = $TotalTests
        }
    }
    
    if ($CompletedTests -gt 0) {
        if ($TestType -eq 'PS') {
            $script:visualProgressState.PSTestsCompleted = $CompletedTests
        } else {
            $script:visualProgressState.JSTestsCompleted = $CompletedTests
        }
    }
    
    # Update test results
    $script:visualProgressState.TestResults.$TestType.Passed = $PassedTests
    $script:visualProgressState.TestResults.$TestType.Failed = $FailedTests
    $script:visualProgressState.TestResults.$TestType.Skipped = $SkippedTests
    
    # Get current time and check if enough time has passed since last update
    $currentTime = Get-Date
    $timeSinceLastUpdate = $currentTime - $script:visualProgressState.LastProgressUpdate
    
    # Only update display if it's been more than 250ms since the last update or if Complete is specified
    if ($Complete -or $timeSinceLastUpdate.TotalMilliseconds -gt 250) {
        $script:visualProgressState.LastProgressUpdate = $currentTime
        Write-VisualProgressDisplay
    }
}

function Write-VisualProgressDisplay {
    # Clear the lines below the banner (don't clear the whole screen to preserve the banner)
    $cursorTop = [Console]::CursorTop
    $windowHeight = [Console]::WindowHeight
    $linesToClear = $windowHeight - $cursorTop - 2
    
    for ($i = 0; $i -lt $linesToClear; $i++) {
        [Console]::SetCursorPosition(0, $cursorTop + $i)
        [Console]::Write("`r" + " ".PadRight([Console]::WindowWidth - 1))
    }
    [Console]::SetCursorPosition(0, $cursorTop)
    
    # Calculate elapsed time
    $elapsedTime = New-TimeSpan -Start $script:visualProgressState.StartTime -End (Get-Date)
    $elapsedStr = "{0:hh\:mm\:ss}" -f $elapsedTime
    
    Write-Host "Test Execution Progress - Runtime: $elapsedStr" -ForegroundColor Yellow
    Write-Host "-----------------------------------------" -ForegroundColor Yellow
    
    # PowerShell Test Progress
    $psTotal = $script:visualProgressState.PSTestsTotal
    $psCompleted = $script:visualProgressState.PSTestsCompleted
    $psPct = if ($psTotal -gt 0) { [math]::Min(100, [math]::Floor(($psCompleted / $psTotal) * 100)) } else { 0 }
    
    Write-Host "`nPowerShell Tests " -ForegroundColor Cyan -NoNewline
    Write-TestStatusIcon -Passed $script:visualProgressState.TestResults.PS.Passed -Failed $script:visualProgressState.TestResults.PS.Failed -Skipped $script:visualProgressState.TestResults.PS.Skipped
    Write-ProgressBar -Percent $psPct -Passed $script:visualProgressState.TestResults.PS.Passed -Failed $script:visualProgressState.TestResults.PS.Failed
    Write-Host "  $psCompleted of $psTotal ($psPct%)"
    
    # JavaScript Test Progress
    $jsTotal = $script:visualProgressState.JSTestsTotal
    $jsCompleted = $script:visualProgressState.JSTestsCompleted
    $jsPct = if ($jsTotal -gt 0) { [math]::Min(100, [math]::Floor(($jsCompleted / $jsTotal) * 100)) } else { 0 }
    
    Write-Host "`nJavaScript Tests " -ForegroundColor Cyan -NoNewline
    Write-TestStatusIcon -Passed $script:visualProgressState.TestResults.JS.Passed -Failed $script:visualProgressState.TestResults.JS.Failed -Skipped $script:visualProgressState.TestResults.JS.Skipped
    Write-ProgressBar -Percent $jsPct -Passed $script:visualProgressState.TestResults.JS.Passed -Failed $script:visualProgressState.TestResults.JS.Failed
    Write-Host "  $jsCompleted of $jsTotal ($jsPct%)"
    
    # Overall Summary
    $totalTests = $psTotal + $jsTotal
    $completedTests = $psCompleted + $jsCompleted
    $totalPct = if ($totalTests -gt 0) { [math]::Min(100, [math]::Floor(($completedTests / $totalTests) * 100)) } else { 0 }
    $totalPassed = $script:visualProgressState.TestResults.PS.Passed + $script:visualProgressState.TestResults.JS.Passed
    $totalFailed = $script:visualProgressState.TestResults.PS.Failed + $script:visualProgressState.TestResults.JS.Failed
    
    Write-Host "`n-----------------------------------------" -ForegroundColor Yellow
    Write-Host "Overall Progress: " -ForegroundColor Yellow -NoNewline
    Write-ProgressBar -Percent $totalPct -Passed $totalPassed -Failed $totalFailed
    Write-Host "  $completedTests of $totalTests ($totalPct%)"
    
    # Show detailed counts for passed/failed tests
    Write-Host "`n√ Passed: " -ForegroundColor Green -NoNewline
    Write-Host $totalPassed -ForegroundColor White
    Write-Host "× Failed: " -ForegroundColor $(if ($totalFailed -gt 0) { "Red" } else { "Green" }) -NoNewline
    Write-Host $totalFailed -ForegroundColor White
    
    Write-Host "`nPress Ctrl+C to cancel testing" -ForegroundColor DarkGray
}

function Write-ProgressBar {
    [CmdletBinding()]
    param(
        [int]$Percent,
        [int]$Passed,
        [int]$Failed
    )
    
    $width = 50  # Width of progress bar in characters
    $filledWidth = [math]::Floor($width * $Percent / 100)
    
    # Setup the progress bar
    Write-Host "`n[" -NoNewline
    
    # Determine how to color the progress bar based on passed/failed ratio
    $passRatio = if (($Passed + $Failed) -gt 0) { $Passed / ($Passed + $Failed) } else { 1 }
    
    # Fill the progress bar
    if ($filledWidth -gt 0) {
        # Choose color based on pass ratio
        if ($Failed -eq 0) {
            # All passing - show green bar
            Write-Host ("█" * $filledWidth) -NoNewline -ForegroundColor Green
        } 
        elseif ($passRatio -ge 0.8) {
            # Mostly passing - show green/yellow bar
            Write-Host ("█" * $filledWidth) -NoNewline -ForegroundColor Yellow
        }
        else {
            # Significant failures - show red bar
            Write-Host ("█" * $filledWidth) -NoNewline -ForegroundColor Red
        }
    }
    
    # Fill the empty part
    if ($filledWidth -lt $width) {
        Write-Host (" " * ($width - $filledWidth)) -NoNewline
    }
    
    Write-Host "]" -NoNewline
}

function Write-TestStatusIcon {
    [CmdletBinding()]
    param(
        [int]$Passed,
        [int]$Failed,
        [int]$Skipped
    )
    
    if ($Failed -gt 0) {
        # Failing tests
        Write-Host "[" -NoNewline
        Write-Host "!" -NoNewline -ForegroundColor Red
        Write-Host "]" -NoNewline
    }
    elseif ($Passed -gt 0 -and $Failed -eq 0) {
        # All passing
        Write-Host "[" -NoNewline
        Write-Host "√" -NoNewline -ForegroundColor Green
        Write-Host "]" -NoNewline
    }
    elseif ($Skipped -gt 0 -and $Passed -eq 0 -and $Failed -eq 0) {
        # Only skipped tests
        Write-Host "[" -NoNewline
        Write-Host "O" -NoNewline -ForegroundColor Yellow
        Write-Host "]" -NoNewline
    }
    else {
        # No tests yet
        Write-Host "[" -NoNewline
        Write-Host "." -NoNewline -ForegroundColor Gray
        Write-Host "]" -NoNewline
    }
}

function Show-VisualTestSummary {
    [CmdletBinding()]
    param(
        [bool]$PSTestsSuccess,
        [bool]$JSTestsSuccess,
        [int]$PSTestCount = 0,
        [int]$PSTestsPassed = 0,
        [int]$PSTestsFailed = 0,
        [int]$JSTestCount = 0,
        [int]$JSTestsPassed = 0,
        [int]$JSTestsFailed = 0,
        [string]$OutputPath
    )
    
    # Calculate totals
    $totalTests = $PSTestCount + $JSTestCount
    $totalPassed = $PSTestsPassed + $JSTestsPassed
    $totalFailed = $PSTestsFailed + $JSTestsFailed
    $overallSuccess = ($PSTestsFailed -eq 0) -and ($JSTestsFailed -eq 0)
    
    # Calculate elapsed time
    $elapsedTime = New-TimeSpan -Start $script:visualProgressState.StartTime -End (Get-Date)
    $elapsedStr = "{0:hh\:mm\:ss\.fff}" -f $elapsedTime
    
    # Display summary header
    Write-Host "`n`n" 
    $summaryBorder = "=" * 70
    Write-Host $summaryBorder -ForegroundColor Cyan
    Write-Host "| " -NoNewline -ForegroundColor Cyan
    Write-Host "                  CYBERCORE TEST EXECUTION SUMMARY                  " -NoNewline
    Write-Host " |" -ForegroundColor Cyan
    Write-Host $summaryBorder -ForegroundColor Cyan
    
    # Display test counts in table format
    $columns = @("", "Total", "Passed", "Failed", "Success Rate")
    $rowPS = @("PowerShell Tests", $PSTestCount, $PSTestsPassed, $PSTestsFailed, "")
    $rowJS = @("JavaScript Tests", $JSTestCount, $JSTestsPassed, $JSTestsFailed, "")
    $rowTotal = @("TOTAL", $totalTests, $totalPassed, $totalFailed, "")
    
    # Calculate success rates
    $rowPS[4] = if ($PSTestCount -gt 0) { "{0:P2}" -f ($PSTestsPassed / $PSTestCount) } else { "N/A" }
    $rowJS[4] = if ($JSTestCount -gt 0) { "{0:P2}" -f ($JSTestsPassed / $JSTestCount) } else { "N/A" }
    $rowTotal[4] = if ($totalTests -gt 0) { "{0:P2}" -f ($totalPassed / $totalTests) } else { "N/A" }
    
    # Display row separator
    $rowSeparator = "+-" + ("-" * 20) + "+-" + ("-" * 10) + "+-" + ("-" * 10) + "+-" + ("-" * 10) + "+-" + ("-" * 15) + "+"
    
    # Display header
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 20) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 15) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -ForegroundColor Cyan
    
    # Display column headers
    Write-Host "| " -NoNewline -ForegroundColor Cyan
    Write-Host $columns[0].PadRight(18) -NoNewline
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $columns[1].PadRight(8) -NoNewline
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $columns[2].PadRight(8) -NoNewline
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $columns[3].PadRight(8) -NoNewline
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $columns[4].PadRight(13) -NoNewline
    Write-Host " |" -ForegroundColor Cyan
    
    # Display row separator
    Write-Host $rowSeparator -ForegroundColor Cyan
    
    # Display PowerShell row
    Write-Host "| " -NoNewline -ForegroundColor Cyan
    Write-Host $rowPS[0].PadRight(18) -NoNewline -ForegroundColor White
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowPS[1].ToString().PadRight(8) -NoNewline -ForegroundColor White
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowPS[2].ToString().PadRight(8) -NoNewline -ForegroundColor Green
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowPS[3].ToString().PadRight(8) -NoNewline -ForegroundColor $(if ($PSTestsFailed -gt 0) { "Red" } else { "Green" })
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowPS[4].PadRight(13) -NoNewline -ForegroundColor $(if ($PSTestsFailed -eq 0) { "Green" } elseif ($PSTestsPassed / $PSTestCount -ge 0.8) { "Yellow" } else { "Red" })
    Write-Host " |" -ForegroundColor Cyan
    
    # Display row separator
    Write-Host $rowSeparator -ForegroundColor Cyan
    
    # Display JavaScript row
    Write-Host "| " -NoNewline -ForegroundColor Cyan
    Write-Host $rowJS[0].PadRight(18) -NoNewline -ForegroundColor White
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowJS[1].ToString().PadRight(8) -NoNewline -ForegroundColor White
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowJS[2].ToString().PadRight(8) -NoNewline -ForegroundColor Green
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowJS[3].ToString().PadRight(8) -NoNewline -ForegroundColor $(if ($JSTestsFailed -gt 0) { "Red" } else { "Green" })
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowJS[4].PadRight(13) -NoNewline -ForegroundColor $(if ($JSTestsFailed -eq 0) { "Green" } elseif ($JSTestsPassed / $JSTestCount -ge 0.8) { "Yellow" } else { "Red" })
    Write-Host " |" -ForegroundColor Cyan
    
    # Display row separator for total
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 20) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("=" * 15) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -ForegroundColor Cyan
    
    # Display total row
    Write-Host "| " -NoNewline -ForegroundColor Cyan
    Write-Host $rowTotal[0].PadRight(18) -NoNewline -ForegroundColor Yellow
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowTotal[1].ToString().PadRight(8) -NoNewline -ForegroundColor Yellow
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowTotal[2].ToString().PadRight(8) -NoNewline -ForegroundColor Green
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowTotal[3].ToString().PadRight(8) -NoNewline -ForegroundColor $(if ($totalFailed -gt 0) { "Red" } else { "Green" })
    Write-Host " | " -NoNewline -ForegroundColor Cyan
    Write-Host $rowTotal[4].PadRight(13) -NoNewline -ForegroundColor $(if ($totalFailed -eq 0) { "Green" } elseif ($totalPassed / $totalTests -ge 0.8) { "Yellow" } else { "Red" })
    Write-Host " |" -ForegroundColor Cyan
    
    # Display footer
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 20) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 10) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -NoNewline -ForegroundColor Cyan
    Write-Host ("-" * 15) -NoNewline -ForegroundColor Cyan
    Write-Host "+" -ForegroundColor Cyan
    
    # Display overall status
    Write-Host "`nOverall Status: " -NoNewline -ForegroundColor Yellow
    if ($overallSuccess) {
        Write-Host " PASSED " -ForegroundColor Black -BackgroundColor Green
    } else {
        Write-Host " FAILED " -ForegroundColor White -BackgroundColor Red
    }
    
    # Display execution time
    Write-Host "`nTotal Execution Time: " -NoNewline -ForegroundColor Yellow
    Write-Host $elapsedStr -ForegroundColor White
    
    # Display output location
    Write-Host "`nDetailed test results available in: " -NoNewline -ForegroundColor Yellow
    Write-Host $OutputPath -ForegroundColor White
    
    # Display animated completion message
    Write-AnimatedCompletionMessage -Success $overallSuccess
}

function Write-AnimatedCompletionMessage {
    [CmdletBinding()]
    param(
        [bool]$Success
    )
    
    $message = if ($Success) { "ALL TESTS PASSED SUCCESSFULLY!" } else { "TEST EXECUTION COMPLETED WITH FAILURES" }
    $color = if ($Success) { "Green" } else { "Red" }
    
    Write-Host "`n"
    # Animate dots first
    for ($i = 0; $i -lt 3; $i++) {
        Write-Host "." -NoNewline -ForegroundColor $color
        Start-Sleep -Milliseconds 200
    }
    
    # Clear the line and write the message character by character
    Write-Host "`r" -NoNewline
    Write-Host (" " * $message.Length) -NoNewline  # Clear the line
    Write-Host "`r" -NoNewline
    
    foreach ($char in $message.ToCharArray()) {
        Write-Host $char -NoNewline -ForegroundColor $color
        Start-Sleep -Milliseconds 20
    }
    
    # Add a newline after the animation
    Write-Host ""
}

# Add a function to parse Jest output
function Parse-JestOutput {
    [CmdletBinding()]
    param(
        [string[]]$JestOutput
    )
    
    $results = @{
        TestsTotal = 0
        TestsPassed = 0
        TestsFailed = 0
        TestSuitesTotal = 0
        TestSuitesPassed = 0
        TestSuitesFailed = 0
        Running = $false
    }
    
    # Look for different patterns in Jest output
    foreach ($line in $JestOutput) {
        # Detect if tests are still running
        if ($line -match "Running|in progress|running") {
            $results.Running = $true
        }
        
        # Test Suites stats
        if ($line -match "Test Suites:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $results.TestSuitesFailed = [int]$Matches[1]
            $results.TestSuitesPassed = [int]$Matches[2]
            $results.TestSuitesTotal = [int]$Matches[3]
        }
        elseif ($line -match "Test Suites:\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $results.TestSuitesFailed = 0
            $results.TestSuitesPassed = [int]$Matches[1]
            $results.TestSuitesTotal = [int]$Matches[2]
        }
        
        # Tests stats
        if ($line -match "Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $results.TestsFailed = [int]$Matches[1]
            $results.TestsPassed = [int]$Matches[2]
            $results.TestsTotal = [int]$Matches[3]
        }
        elseif ($line -match "Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total") {
            $results.TestsFailed = 0
            $results.TestsPassed = [int]$Matches[1]
            $results.TestsTotal = [int]$Matches[2]
        }
    }
    
    return $results
}

# Make functions available to other scripts
Export-ModuleMember -Function Initialize-VisualProgress, Update-TestProgress, Show-VisualTestSummary, Write-CyberCoreBanner, Parse-JestOutput