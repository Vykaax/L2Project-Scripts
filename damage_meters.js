// Don't touch
var damageTotal = 0;
var recording = false;
var extraSpaceNameMax = 20;
var extraSpaceDamageMax = 12;
var extraSpaceDPSMax = 9;
var logStartTime;
var logStopTime;

// Customize these
var autoStart = true; // true = logging starts when the scripts starts | false = must start manually with "dmstart" in party chat
var verboseLog = 1; // 0 nothing, 1 rare events, 2 testing, 3 lots of testing
var useAutoReset = false; // auto reset and send damage data to party chat on a schedule
var maxLoggingTime = 720; // (in minutes) maximum time to log damage for if useAutoReset = true
var startAgainAfterMax = true; // start logging again after reaching the max logging time if useAutoReset = true

async function OnSay(charName, fullChatString, messageType) {
    if (Context.IsConnected) {
        if (messageType == 3) {
            if (verboseLog >= 3 ) { console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Received message ${fullChatString}`); }
            switch (fullChatString) {
                case "dmstart":
                    dmstart(); break;
                case "dmstop":
                    dmstop(); break;
                case "dmreset":
                    dmreset(); break;
                case "dmreport":
                    dmreport(); break;
                default:
            }
        }
    }
}

async function OnSystemMessage(id, msg) {
       if (id == 2261 && recording) {
            if (verboseLog >= 2 ) { console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Received damage message (${msg.num})`); }
            damageTotal += Number(msg.num);
       }  
}

function calcDamageTotal() {
    // maybe something more comlicated here later
    // but not sure it's viable to do detailed per skill damage logging
    return damageTotal;
}

function dmstart() {
    recording = true;
    logStartTime = new Date();
    console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Recording Started`);
}

function dmstop() {
    recording = false;
    logStopTime = new Date();
    console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Recording Stopped`);
}

function dmreset() {
    damageTotal = 0;
    dmstart();
    logStopTime = null;
    console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Damage Log Reset`);
}

function dmreport() {
    let damageDone = calcDamageTotal();
    let tempElapsedTime;
    if (logStopTime == null) {
        tempElapsedTime = new Date();
    } else {
        tempElapsedTime = logStopTime;
    }
    let elapsedSeconds = (tempElapsedTime - logStartTime)/1000;
    let damagePerSecond = Math.round(damageDone/elapsedSeconds*100)/100;
    Send.Say2(3, `${" ".repeat(extraSpaceNameMax-(Me.Name).length-String(damageDone).length)}${damageDone}${" ".repeat(extraSpaceDamageMax-String(damagePerSecond).length)}(${damagePerSecond} dps) - ${Me.Level} ${Me.ClassName}`,"",true);
}

function autoReport() {
    console.warn(`${(new Date()).toLocaleTimeString()} : VDMS : Reached time limit`);
    dmstop();
    dmreport();
    dmreset();
    if (startAgainAfterMax) {
        dmstart();
    }
}

var loopDelay = 2500;
(async function main() {
    console.info("=".repeat(54) + "\n========= Vykaax's Damage Meters Script 1.00 =========\n" + "=".repeat(54));
    console.log("Run this script on all damage dealers and then use the following commands");
    console.log("in Party chat to control the damage meters for all bots in the party:");
    console.log("dmstart  - start the damage meter logging");
    console.log("dmstop   - stop the damage meter logging");
    console.log("dmreport - report logged damage and damage per second to party chat (logging continues)");
    console.log("dmreset  - reset the damage log and timer");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(loopDelay);} else {await sleep(loopDelay);}
    if (autoStart) {
        dmstart();
    }
    for(;;) {    
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(loopDelay);} else {await sleep(loopDelay);}
        if (verboseLog >= 2 ) { 
            console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Debugging Loop (Recording is ${recording})`);
        }
        if (logStartTime != null && recording && useAutoReset) {
            let totalElapsedTime = (new Date() - logStartTime)/1000/60;
            if (verboseLog >= 3 ) { 
                console.log(`${(new Date()).toLocaleTimeString()} : VDMS : Elapsed time is ${totalElapsedTime}`);
            }
            if (totalElapsedTime >= maxLoggingTime) {
                autoReport();
            }
        }
        if (!Context.IsConnected) {
            dmstop();
        }
    }
})();