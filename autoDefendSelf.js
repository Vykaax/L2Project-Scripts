function OnAttack(attackerObjId, objId) {
	if (CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Char" && objId === Me.objId) {
		if (lockTargetId == null) {
			lockTargetId = attackerObjId;
			lockName = CreaturesList.GetItemByObjectID(attackerObjId).Name;
			console.warn(`${(new Date()).toLocaleTimeString()} : Self Defence : I've been attacked by ${lockName}!`);
			StopCombat();
			Send.Action(attackerObjId);
		}
	}
	//let attacker = CreaturesList.GetItemByObjectID(attackerObjId);
	//let defender = CreaturesList.GetItemByObjectID(objId);
	//if (objId === Me.objId) {
	//if (objId === Me.objId) { // && defender.crtType.ToString() == "Char") {
	//console.info(`${(new Date()).toLocaleTimeString()} : ${attacker.Name} attacked ${defender.Name}`);
	//}
		
	//}
	
	/*if (objId === Me.objId && lockTargetId == null) {
		lockTargetId = attackerObjId;
		lockName = CreaturesList.GetItemByObjectID(attackerObjId).Name;
		console.warn(`${(new Date()).toLocaleTimeString()} : Self Defence : I've been attacked by ${lockName}!`);
		StopCombat();
		Send.Action(attackerObjId);
	}*/
}

function OnMagicSkillUse(objId, targetId, skillId) {
	//let attacker = CreaturesList.GetItemByObjectID(objId);
	//let defender = CreaturesList.GetItemByObjectID(targetId);
	//console.info(`${attacker.Name} cast a spell at ${defender.Name}`);
	console.info("123");
}

function OnDie(deadObjId) {
	if (deadObjId == lockTargetId) {
		defendKillCount++;
		console.error(`${(new Date()).toLocaleTimeString()} : Self Defence : I killed ${lockName}!`);
		lockTargetId = null;
		lockName = null;
		StartCombat();
	}
}

var lockTargetId = null;
//var lockTarget = null;
var lockName = null;
var defendKillCount = 0;

(async function main() {
    console.log(`Auto PvP Defender Script Started`);
	//let validTarget = null;
    for(;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if (lockTargetId != null) {
				let lockTarget = CreaturesList.GetItemByObjectID(lockTargetId);
				lockTarget.CalculateDistance();
				if (lockTarget.Distance >= 1300) {
					lockTargetId = null;
					StartCombat();
				} else if (Me.HpPercent < 60 ) {
					Send.RequestMagicSkillUse(1234);
				} else {
					Send.RequestMagicSkillUse(1263);
					Send.RequestMagicSkillUse(1148);
				}
			}
		}
		await sleep(150);
		//console.info(`Wait`);
    }
})();