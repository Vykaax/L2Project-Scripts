assert_min_version("2.3.0");

function OnAttack(attackerObjId, targetId) {
    let attackerCrt = CreaturesList.GetItemByObjectID(attackerObjId);
    if (attackerCrt != null) {
        if ((attackerCrt.crtType.ToString() == "Char" || attackerCrt.crtType.ToString() == "Npc") && (PartyList.GetItemByObjectID(targetId) != null || targetId === Me.objId)) {
                AttemptToAddTarget(attackerObjId, targetId);
        }
    }
}

/*function OnAttack(attackerObjId, objId) {
    console.log(`${(new Date()).toLocaleTimeString()} : Party Defence : attack`);
	if ( CreaturesList.GetItemByObjectID(attackerObjId) != null && objId == Me.objId) {
		if (CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Char" && objId === Me.objId) {
			console.warn(`${(new Date()).toLocaleTimeString()} : Event Joiner : Fighting back against ${CreaturesList.GetItemByObjectID(attackerObjId).Name}`);
        }
	}
}*/

function OnMagicSkillUse(attackerObjId, targetId, skillId) {
    let attackerCrt = CreaturesList.GetItemByObjectID(attackerObjId);
    if (PartyList.GetItemByObjectID(attackerObjId) == null && attackerCrt != null) {
        if ((CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Char" || CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Npc") && (PartyList.GetItemByObjectID(targetId) != null || targetId === Me.objId)) {
            AttemptToAddTarget(attackerObjId, targetId);
        }
    }
}

function AttemptToAddTarget(attackerObjId, targetId) {
    if (!pvpTargets.includes(attackerObjId)) {
        console.warn(`${(new Date()).toLocaleTimeString()} : Party Defence : ${(targetId === Me.objId)? `I have` : `${PartyList.GetItemByObjectID(targetId).Name} has`} been attacked by ${CreaturesList.GetItemByObjectID(attackerObjId).Name}!`);
        pvpTargets.push(attackerObjId);
        if (Context.IsInCombat()) {
            StopCombat();
        }
        console.warn(`${(new Date()).toLocaleTimeString()} : Party Defence : Attacker List -> ${pvpTargets}`);
    }
    KillTarget();
}

/*function OnMagicSkillUse(objId, targetId, skillId) {
	//let attacker = CreaturesList.GetItemByObjectID(objId);
	//let defender = CreaturesList.GetItemByObjectID(targetId);
	//console.info(`${attacker.Name} cast a spell at ${defender.Name}`);
	console.info("123");
}*/

function KillTarget() {
    if (pvpTargets.length > 0) {
       let lockObjId = CreaturesList.GetItemByObjectID(pvpTargets[0]).objId; // just pick the first target in the list
       if (Context.IsInCombat()) {
           StopCombat();
       }
       Send.Action(lockObjId);
       Send.Action(lockObjId);
       Send.RequestMagicSkillUse(28);
       Send.AttackRequest(lockObjId);
    }
}

function SafeRemoveTarget() {
    if (pvpTargets.length > 0) {
        testObjId = CreaturesList.GetItemByObjectID(pvpTargets[0]).objId;
        if (CreaturesList.GetItemByObjectID(testObjId) != null && CreaturesList.GetItemByObjectID(testObjId).IsDead) {
            //console.warn(`${(new Date()).toLocaleTimeString()} : Party Defence : Next target was already dead`);
            //pvpTargets.splice(pvpTargets.indexOf(testObjId,1));
            pvpTargets = pvpTargets.filter(function(item) {return item !== testObjId});
            console.warn(`${(new Date()).toLocaleTimeString()} : Party Defence : Attacker List -> ${pvpTargets}`);
        }
    }
    
}

function FindLowest() {
    
}

function OnDie(deadObjId) {
	if (pvpTargets.includes(deadObjId)) {
        if (Target.objId == deadObjId) {
            Send.RequestTargetCancel();  
        }
    
        //console.log(`${(new Date()).toLocaleTimeString()} : Party Defence : Dead Crt ${deadObjId} Target -> TRUE`);
        defendKillCount++;
        console.log(`${(new Date()).toLocaleTimeString()} : Party Defence : We defeated ${CreaturesList.GetItemByObjectID(pvpTargets[0]).Name}`);
        //console.error(`${(new Date()).toLocaleTimeString()} : Party Defence : We defeated ${deadObjId}! (Total Kill Count: ${defendKillCount})`);
        pvpTargets = pvpTargets.filter(function(item) {return item !== deadObjId});
        //pvpTargets.splice(pvpTargets.indexOf(deadObjId,1));
        console.warn(`${(new Date()).toLocaleTimeString()} : Party Defence : Attacker List -> ${pvpTargets}`);
        
		//lockTargetId = null;
		//lockName = null;
        if (pvpTargets.length == 0) {
            StartCombat();
        } else {
            KillTarget();
        }
	}
}

var pvpTargets = [];
var defendKillCount = 0;

(async function main() {
    console.info("=== Vykaax's PvP Defender Script Started v1.05 ===");
    for(;;) {
        if (Context.IsConnected) {
            if (CurrentZone.ToString() == "PEACEZONE") {
                pvpTargets = [];
                if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(10000);} else {await sleep(10000);}
            } else {
                //SafeRemoveTarget();
                if (Target != null) {
                    if (Target.crtType.ToString() == "Char" && Target.IsDead) {
                        console.error(`${(new Date()).toLocaleTimeString()} : Party Defence : PvP target has died!`);
                        Send.RequestTargetCancel();
                        KillTarget();
                    }
                }
                if (pvpTargets.length > 0) {
                   KillTarget();
                }
            }
        }
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(300);} else {await sleep(300);}
    }
})();