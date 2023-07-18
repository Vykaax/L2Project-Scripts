var potentialTargets = 0;
var curTargets = 0;

(async function main() {
    console.info("=== Vykaax's Provoke Script Enabled v0.2 ===");    
    
    for(;;) {
        await sleep (7500);
        try {
            if (Context.IsConnected && !Me.IsDead && Context.IsInCombat() && IsEnabled && CurrentZone.ToString() != "PEACEZONE") {
                if (Me.MpPercent >= 30 && Me.HpPercent >= 75) {
                    potentialTargets = Me.CountTargetsInRange(800);
                    curTargets = Me.CountTargetsInRange(350);
                    if (potentialTargets >= 3 && curTargets < 3) {
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