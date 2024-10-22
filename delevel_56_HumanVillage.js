//JavaScript Math

(async function main() {
    console.info("=".repeat(54) + "\n== Vykaax's Deleveler Script 1.2 ==\n" + "=".repeat(54));
	DisableBot();
    for(;;) {
		if (Me.Level > 55) {
			Send.MoveTo(-83730,242767);
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(5500);} else {await sleep(5500);}
			Send.MoveTo(-82314,241305);
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(13000);} else {await sleep(13000);}
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
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}			
			}
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
			if (Me.IsDead) {
				Send.SendHex("7D00000001");
			}
		}
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    }
	console.log(`De-leveling finished. I am now ${Me.Level}`);
})();