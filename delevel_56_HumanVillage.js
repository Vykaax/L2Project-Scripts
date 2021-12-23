//JavaScript Math

(async function main() {
    console.log("Delevel Script Started");
	DisableBot();
    for(;;) {
		if (Me.Level > 55) {
			Send.MoveTo(-83730,242767);
			await sleep(5500);
			Send.MoveTo(-82314,241305);
			await sleep(13000);
			// get random guard
			let guard = Math.floor(Math.random()*2);
			//let guard = 1;
			console.log(`Guard: ${guard}`);
			let guardName = "Gilbert";
			switch (guard) {
					case 0:
						guardName = "Gilbert";
						break;
					case 1:
						guardName = "Leon";
						break;
					default:
						
			}
			let guardNPC = CreaturesList.GetItemByName(guardName);
			console.log(`Found guard: ${guardNPC.Name}`);
			while (!Me.IsDead && !guardNPC.IsDead) {
				Send.AttackRequest(guardNPC.objId);
				console.log(`Attacking ${guardNPC.Name} (${guardNPC.objId})`);
				await sleep(1000);			
			}
			await sleep(1000);
			if (Me.IsDead) {
				Send.SendHex("7D00000001");
			}
		}
		await sleep(1500);
    }
	console.log(`De-leveling finished. I am now ${Me.Level}`);
})();