var verboseLog = 0; // 0 nothing, 1 rare events, 2 testing, 3 lots of testing
var trySpoil = false;

async function OnSystemMessage(id) {
       if (id == 1597) {
            if (verboseLog == 1) { console.warn(`${(new Date()).toLocaleTimeString()} : EnhancedSpoil : Spoil failed. Trying again`); }
            trySpoil = true;
       }
}

(async function main() {
    console.info("=== Vykaax's Enhanced Spoil Fix Script v1.0 ===");
    await sleep (1500);
    while (!Context.IsConnected) {
        await sleep (500);
    }
    await sleep (1500);
    
    for(;;) {
        if (Context.IsConnected && IsEnabled && !Me.IsDead && Target != null) {
            try {
                if (trySpoil == true) {
                    trySpoil = false;
                    Send.RequestMagicSkillUse(254);
                }
            } catch(errSpoil) {
                console.error(`${(new Date()).toLocaleTimeString()} : EnhancedSpoil : Re-spoil failed -> ${errSpoil}`);
            }
        }
        
        await sleep (2000);
    }
    console.warn(`${(new Date()).toLocaleTimeString()} : EnhancedSpoil : The script ended`);
})();