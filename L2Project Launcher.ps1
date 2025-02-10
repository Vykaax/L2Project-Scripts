$appPath = "E:\L2\Project\"
# my parties all use a colour in the name to make identification easy. Obviously this won't do much for anyone else out of the box
# but what I would suggest you do is change the names of your profile XML files. Just add a unique identifier to each of the names of XML files for a group of bots
# i.e. if your profiles are called BobTheBladedancer.xml and SallyTheSwordsinger.xml change them to party1_BobTheBladedancer.xml and party1_SallyTheSwordsinger.xml
# then enter "party1" into the prompt of this script to launch everyone in "party1" all at once
# Note : this script is lazy and does not check to see if the bot with that name is already open

$groupColour = Read-Host "Enter a colour or profile name: "


switch ($groupColour) {
    "Red" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Red.exe"
    }
    "Orange" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Orange.exe"
    }
    "Blue" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Blue.exe"
    }
    "Green" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Green.exe"
    }
    "Purple" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Purple.exe"
    }
    "Yellow" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Yellow.exe"
    }
    "Crimson" {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
        $leaderVersionPath = "L2Project-v2.5.10\"
        $leaderAppName = "L2Project Crimson.exe"
    }
    default {
        $memberVersionPath = "L2Project-v2.6.1-beta1\"
        $memberAppName = "L2Project 2.6.1b12.exe"
    }
}

$profileList = Get-ChildItem -path "E:\L2\Project\_Profiles" | Where {$_.name -like "*$groupColour*"}

foreach ($profile in $profileList) {
    if ($profile.name -like "*leader*") {
        Start-Process -FilePath $appPath$leaderVersionPath$leaderAppName -ArgumentList "..\\_Profiles\$profile" -WorkingDirectory $appPath$leaderVersionPath
        Start-Sleep -Seconds 5
    } else {
        Start-Process -FilePath $appPath$memberVersionPath$memberAppName -ArgumentList "..\\_Profiles\$profile" -WorkingDirectory $appPath$memberVersionPath
    }
    Start-Sleep -Seconds 2
}