function OnDie(deadObjId) {
	if (CreaturesList.GetItemByObjectId(deadObjId).Name == "RedLeader" || CreaturesList.GetItemByObjectId(deadObjId).Name == "RedTwo" || CreaturesList.GetItemByObjectId(deadObjId).Name == "RedTen") {
		Send.Action(deadObjId);
		Send.RequestMagicSkillUse(1016);
	}
}


(async function main() {
	if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
	
	console.info(`${(new Date()).toLocaleTimeString()} : OOP Healer : Script Started v1.00`);
	for (;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if (CreaturesList.GetItemByName("RedTwo").IsDead) {
				Send.Action(CreaturesList.GetItemByName("RedTwo").objId);
				Send.Action(CreaturesList.GetItemByName("RedTwo").objId);
				Send.RequestMagicSkillUse(1016);
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(250);} else {await sleep(250);}
			}
			
			Send.Action(CreaturesList.GetItemByName("RedLeader").objId);
			Send.RequestMagicSkillUse(1401);
			
		}
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(250);} else {await sleep(250);}
	}
})();