var potentialTargets = 0;
var curTargets = 0;
var idealTargets = 3;
var thresholdTargets = 3;

(async function main() {
    console.info("=== Vykaax's Provoke Script Enabled v0.5 ===");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    while (!Context.IsConnected) {
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
    }
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    
    switch (Me.Name) {
        case "Vykaax":
            idealTargets = 4;
            thresholdTargets = 2;
            break;
        case "GreenLeader":
            idealTargets = 3;
            thresholdTargets = 3;
            break;
        default:
        
    }
    
    for(;;) {
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(7500);} else {await sleep(7500);}
        try {
            if (Context.IsConnected && !Me.IsDead && Context.IsInCombat() && IsEnabled && CurrentZone.ToString() != "PEACEZONE") {
                if (Me.MpPercent >= 30 && Me.HpPercent >= 75) {
                    potentialTargets = Me.CountTargetsInRange(800);
                    curTargets = Me.CountTargetsInRange(350);
                    if (potentialTargets >= thresholdTargets && curTargets < idealTargets) {
                        console.log(`${(new Date()).toLocaleTimeString()} : Provoker : Provoking ${potentialTargets} targets`);
                        Send.RequestMagicSkillUse(286);
                    } else {
                        //console.log(`${(new Date()).toLocaleTimeString()} : Provoker : No provoke - Potential ${potentialTargets}, Current ${curTargets}`);    
                    }
                }
            }
        } catch (errProvoke){
            console.error(`${(new Date()).toLocaleTimeString()} : Provoker : ${errProvoke}`);
        }
    }
})();