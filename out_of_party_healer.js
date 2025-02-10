assert_min_version("2.2.0");
if(!this['sleep']) Sleep = sleep;
  
var AutoHealer = (function () {
	const HEAL_LIST = ["FindStuff","MakeStuff","Vykaax"];
	const RECHARGE_LIST = ["PurpleFive","PurpleSix","PurpleSeven"];
	const HEAL_ID = 1217; //Greater Heal
	const RECHARGE_ID = 1013; //Recharge
	const RESERVE_MP = 25;
	const HP_CHECK = 70;
	const MP_CHECK = 40;
	const CHECK_INTERVAL = 2500; // 2 seconds. Increase this to check less frequently

	async function tryHeal(recipientName, skillID, check) {
		if (CreaturesList.GetItemByName(recipientName) != null && CreaturesList.GetItemByName(recipientName).HpPercent <= check && Me.MpPercent >= RESERVE_MP) {
			Send.Action(CreaturesList.GetItemByName(recipientName).objId);
			Send.Action(CreaturesList.GetItemByName(recipientName).objId);
			Send.RequestMagicSkillUse(skillID);
			console.warn(`${(new Date()).toLocaleTimeString()} : AutoHealer : Cast ${SkillsList.GetItemByID(skillID).Name} on ${recipientName}`);
			await sleep(500);
		}
	}
	
	async function tryRecharge(recipientName, skillID, check) {
		if (CreaturesList.GetItemByName(recipientName) != null && CreaturesList.GetItemByName(recipientName).MpPercent <= check && Me.MpPercent >= RESERVE_MP) {
			Send.Action(CreaturesList.GetItemByName(recipientName).objId);
			Send.Action(CreaturesList.GetItemByName(recipientName).objId);
			Send.RequestMagicSkillUse(skillID);
			console.warn(`${(new Date()).toLocaleTimeString()} : AutoHealer : Cast ${SkillsList.GetItemByID(skillID).Name} on ${recipientName}`);
			await sleep(500);
		}
	}


	function AutoHealer() {
		console.info("=".repeat(54) + "\n== Vykaax's OOP AutoHealer Script 1.05 ==\n" + "=".repeat(54));
		//console.info(`${(new Date()).toLocaleTimeString()} : AutoHealer: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);

		checkHealthInterval = setInterval(() => {
			if (Context.IsConnected && !Me.IsDead && IsEnabled) {
					HEAL_LIST.forEach( (oopTarget) => tryHeal(oopTarget,HEAL_ID,HP_CHECK) );
					RECHARGE_LIST.forEach( (oopTarget) => tryRecharge(oopTarget,RECHARGE_ID,MP_CHECK) );
			}
		}, CHECK_INTERVAL);
	}

	return AutoHealer;
})();

var autoHeal = new AutoHealer();

