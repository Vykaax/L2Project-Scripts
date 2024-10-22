var verboseLog = 1; // 0 nothing, 1 rare events, 2 testing, 3 lots of testing

async function OnDie(objId) {
    if (Target != null) {
        if (Target.objId == objId && Me.HpPercent <= 75) {
            Send.RequestMagicSkillUse(1151);
            Send.RequestMagicSkillUse(1151);
            Send.RequestMagicSkillUse(1151);
            if (verboseLog >= 1) { console.log(`${(new Date()).toLocaleTimeString()} : B2M : Target Dead - Draining - HP ${Me.HpPercent.toFixed(2)}% / MP ${Me.MpPercent.toFixed(2)}%`); }
        } else if (Target.objId == objId && Target.CountTargetsInRange(300) >= 5 && (Me.ClassName == "Soultaker" || Me.ClassName == "Necromancer")) {
            Send.RequestMagicSkillUse(1155);
            Send.RequestMagicSkillUse(1155);
            Send.RequestMagicSkillUse(1155);
        }
    }
}

function tryCastB2M() {
    if (SkillsList.GetItemByName("Body To Mind").IsReady) {
        Send.RequestMagicSkillUse(1157);
        Send.RequestMagicSkillUse(1157);
        Send.RequestMagicSkillUse(1157);
        if (verboseLog >= 1) { console.log(`${(new Date()).toLocaleTimeString()} : B2M : Casting Body to Mind - HP ${Me.HpPercent.toFixed(2)}% / MP ${Me.MpPercent.toFixed(2)}%`); }
    }
}


(async function main() {
    console.info("=== Vykaax's Body to Mind Script v0.1 ===");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    while (!Context.IsConnected) {
        console.log("Character is connected");
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
    }
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    
    for(;;) {
        if (Context.IsConnected && !Me.IsDead && IsEnabled) {
            //if (Target != null && Target.IsDead) {
            //    if (Me.HpPercent <= 80) { Send.RequestMagicSkillUse(1151); console.log(`${(new Date()).toLocaleTimeString()} : B2M : Casting Corpse Life Drain - HP ${Me.HpPercent.toFixed(2)}% / MP ${Me.MpPercent.toFixed(2)}%`);}
            //}
            
            if (Me.MpPercent <= 95) {
                if (!Me.IsMoving && (Target == null || Target.IsDead)) {
                    if (Me.HpPercent >= 40) { tryCastB2M(); }
                }
                
            }
            
        }
        
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
    }
})();