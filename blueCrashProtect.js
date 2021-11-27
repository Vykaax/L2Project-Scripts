(async function main() {
	await sleep(1500);
	
	console.info(`${(new Date()).toLocaleTimeString()} : Blue Party Crash Protection : Script Started v1.00`);
	for (;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if ((CreaturesList.GetItemByName("BlueLeader") == null || CreaturesList.GetItemByName("BlueLeader").IsDead) && CurrentZone.ToString() == "GENERALZONE") {
				if (!Context.IsInCombat()) {
					StartCombat();
					console.error(`${(new Date()).toLocaleTimeString()} : Blue Party Crash Protection : BlueLeader has become unavailable!`);
					console.warn(`${(new Date()).toLocaleTimeString()} : Blue Party Crash Protection : Started Combat`);
				}
			}
			
			if (CreaturesList.GetItemByName("BlueLeader") != null && !CreaturesList.GetItemByName("BlueLeader").IsDead) {
				if (Context.IsInCombat()) {
					console.warn(`${(new Date()).toLocaleTimeString()} : Blue Party Crash Protection : BlueLeader has returned!`);
					StopCombat();
					console.warn(`${(new Date()).toLocaleTimeString()} : Blue Party Crash Protection : Stopped Combat`);
				}
			}			
		}
		await sleep(1000);
	}
})();