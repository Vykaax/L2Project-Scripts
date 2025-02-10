﻿do {
    write-host "You should only start this script once all of your bots are open with profiles loaded"
    $resp = read-host "Enter y/Y to confirm you are ready: "

} until ($resp.ToLower() -eq "y")

# $appPath should be the folder that contains your L2Project client folder, not the L2Project.exe client itself. Go one level up
# Since I use multiple folders for bot versions, I do NOT use the Scripts and Profiles folders inside the client folder.
# Instead I keep them in _Scripts and _Profiles folders in the $appPath folder below. To get this to work you will need to either start using similar paths or
# make some changes to this script to fix the paths for your use-case
$appPath = "E:\L2\Project\"
$lockedBots = Get-Process *l2project* | select *,@{Name="BotName";Expression={$_.MainWindowTitle.Split("|")[0]}}
$versionPath = "L2Project-v2.5.10\"
$appName = "L2Project Red.exe"

# I run 2.5.10 on party leaders due to faster mob selection, and 2.6.1 beta12 for everything else.
# Name your executables and folder names correctly here

$oldVersionPath = "L2Project-v2.5.10\"
$oldAppName = "L2Project Red.exe"
$newVersionPath = "L2Project-v2.6.1-beta1\"
$newAppName = "L2Project 2.6.1b12.exe"

$includeLeader = $true  # Set this to true if you do not want the party leader clients to relaunch. If you do use this, make sure they are running the Chat Commander script that so they auto start combat after logging in
$memoryThreshold = 1050 # This is 'somewhere' around 1GB of RAM, but Windows calculates WorkingSet64 strangely so it will not match exactly what is shown on task manager. Set this lower if you are running out of memory before the bots are able to relaunch themselves.

$botInfo = @()

foreach ($lockedBot in $lockedBots) {
    $botInfo += @{ BotName = $lockedBot.MainWindowTitle.Split("|")[0]; Crashes = 0; ProcessName = $lockedBot.ProcessName; Path = $lockedBot.Path } #; History = ""}
}


do {
    $checkedBots = Get-Process *l2project* | select *,@{Name="BotName";Expression={$_.MainWindowTitle.Split("|")[0]}}
    foreach ($bot in $checkedBots) {
        if ($bot.MainWindowTitle -contains "*Not Responding*") {
            write-host "$(Get-Date) - ALERT - Not Responding - " -ForegroundColor Red -NoNewline
            write-host "$($bot.BotName) has been closed"
            Get-Process *l2project* | Where {$_.MainWindowTitle.Split("|")[0] -like $bot.BotName} | Stop-Process
        } elseif ($bot.WorkingSet64/1MB -gt $memoryThreshold -and ($bot.BotName -notlike "*leader*" -or $ignoreLeader -eq $true)) {
            write-host "$(Get-Date) - ALERT - High Memory - " -ForegroundColor Yellow -NoNewline
            write-host "$($bot.BotName) has been closed"
            Get-Process *l2project* | Where {$_.MainWindowTitle.Split("|")[0] -like $bot.BotName} | Stop-Process
        }
    }
    Start-Sleep -Milliseconds 500
    $checkedBots = Get-Process *l2project* | select *,@{Name="BotName";Expression={$_.MainWindowTitle.Split("|")[0]}}

    $missingBots = $botInfo | Where {$checkedBots.BotName -notcontains $_.BotName}
    #$missingBots
    foreach ($missingBot in $missingBots) {
        if ($missingBot.BotName -notlike "*leader*" -or $includeLeader -eq $true) {
            write-host "$(Get-Date) - " -NoNewline
            write-host "$($missingBot.BotName) is missing" -ForegroundColor Yellow -NoNewline
            $profileList = Get-ChildItem -path "E:\L2\Project\_Profiles" | Where {$_.name -like "*$($missingBot.BotName)*"}
            $profile = $profileList[0]
            write-host " - relaunch with profile - " -ForegroundColor Cyan -NoNewline
            write-host " $($profile.Name)"
            if ($missingBot.ProcessName -like "*2.6*") {
                $versionPath = $newVersionPath
                $appName = $missingBot.ProcessName
            } else {
                $versionPath = $oldVersionPath
                $appName = $missingBot.ProcessName
            }
            write-host "$(Get-Date) - Launching Bot : $($missingBot.BotName) : $appName : E:\L2\Project\_Profiles\$($profile.Name)"
            Start-Process -FilePath $missingBot.Path -ArgumentList "E:\L2\Project\_Profiles\$($profile.Name)" -WorkingDirectory $appPath$versionPath
            Start-Sleep -Seconds 2
        }

    }
    Start-Sleep -Seconds 10
} while ($true)