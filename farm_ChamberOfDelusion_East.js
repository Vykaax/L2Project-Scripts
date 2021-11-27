function checkForAenkinel() {
	let mobAenkinel = CreaturesList.GetItemByName("Aenkinel");
	if (mobAenkinel == null) {
		return false;
	} else {
		mobAenkinel.CalculateDistance();
		console.log(`Delusion Farmer: The distance to Aenkinel is ${mobAenkinel.Distance}`);
		if (mobAenkinel.Distance < 650 && !mobAenkinel.IsDead) {
			// Enable this to force an attack if combat isn't working due to combat pickup bug
			//Send.AttackRequest(mobAenkinel.objId);
			return true;
		} else {
			return false;
		}
	}
}

function getNearestManager() {
	let nearestId = null;
	let nearestRange = 99999;
	
	for (let i = 0; i < CreaturesList.Count; i++) {
		if (CreaturesList[i].Name == "Delusion Manager") {
			CreaturesList[i].CalculateDistance();
			console.log(`Delusion Farmer: Found ${CreaturesList[i].Name} (${CreaturesList[i].objId}, ${CreaturesList[i].Distance})`); 
			if(CreaturesList[i].Distance < nearestRange) {
				nearestId = CreaturesList[i].objId;
				nearestRange = CreaturesList[i].Distance;
			}
		}
	}
	console.log(`Delusion Farmer: Nearest Delusion Manager is (${nearestId}, ${nearestRange})`);
	return nearestId;
}

(async function main() {
    console.log(`Delusion Farmer: Starting Vykaax's Chamber of Delusion Soul Crystal Farm Script`);
	await sleep(500);
	// First run, make sure the party is near the Guardian of Eastern Seal
	console.log(`Delusion Farmer: Gathering party near the Eastern Seal`);
	Send.MoveTo(-114600,-151405);
	await sleep(7500);
	let bossEncounters = 0;
	let chamberRuns = 1;
	await sleep(500);
	
	for (;;) {
		console.log(`Delusion Farmer: Beginning Eastern Chamber Run #${chamberRuns}`);
		console.log(`Delusion Farmer: Moving to the Guardian of Eastern Seal`);
		// 268438459 - Guardian of Eastern Seal objId
		let guardianID = CreaturesList.GetItemByName("Guardian of Eastern Seal");
		Send.MoveTo(-114600,-151405);
		await sleep(2000);
		console.log(`Delusion Farmer: Selecting Guardian of Eastern Seal`);
		Send.Action(guardianID.objId);
		await sleep(1000);
		console.log(`Delusion Farmer: Talking to Guardian of Eastern Seal`);
		Send.Action(guardianID.objId);
		await sleep(1000);
		console.log(`Delusion Farmer: Entering Chamber of Delusion East`);
		// "Enter the Eastern Seal" Quest ChamberOfDelusionEast
		Send.ReqBypassToServer(`npc_${guardianID.objId}_Quest ChamberOfDelusionEast`);
		await sleep(2000);
		console.log(`Delusion Farmer: Checking if Aenkinel is in this room`);
		if (checkForAenkinel() == true) {
			console.log(`Delusion Farmer: Aenkinel is nearby!`);
			console.log(`Delusion Farmer: Starting Combat`);
			StartCombat();
			while (checkForAenkinel() == true) {
				await sleep(10000);
			}
			console.log(`Delusion Farmer:  Waiting 15 Seconds to Clear Chests`);
			// Wait timer to clear chests, reduce this if you don't care about them and just want Soul Crystals
			await sleep(15000);
			console.log(`Delusion Farmer: Ending Combat`);
			StopCombat();
			bossEncounters += 1;
		} else {
			console.log(`Delusion Farmer: Aenkinel is far away in a different room`);
			console.log(`Delusion Farmer: Checking for nearest Delusion Manager`);
			let nearestManagerIdFirstRoom = getNearestManager();
			if (nearestManagerIdFirstRoom != null) {
				console.log(`Delusion Farmer: Moving to next room using Chamber Invitation`);
				Send.Action(nearestManagerIdFirstRoom);
				await sleep(1000);
				Send.Action(nearestManagerIdFirstRoom);
				await sleep(1000);
				// "Move to Another Room" Quest ChamberOfDelusionEast next_room
				Send.ReqBypassToServer(`Quest ChamberOfDelusionEast next_room`);
				await sleep(2000);
				console.log(`Delusion Farmer: Checking if Aenkinel is in this room`);
				if (checkForAenkinel() == true) {
					console.log(`Delusion Farmer: Aenkinel is nearby!`);
					console.log(`Delusion Farmer: Starting Combat`);
					StartCombat();
					while (checkForAenkinel() == true) {
						await sleep(10000);
					}
					console.log(`Delusion Farmer: Waiting 50 Seconds to Clear Chests`);
					// Wait timer to clear chests, reduce this if you don't care about them and just want Soul Crystals
					await sleep(15000);
					console.log(`Delusion Farmer: Ending Combat`);
					StopCombat();
					bossEncounters += 1;
				} else {
					console.log(`Delusion Farmer: Aenkinel is far away in a different room`);
				}
			} else {
				console.log(`Delusion Farmer: There was no Delusion Manager nearby. Sorry, guess you're stuck here forever!`);
				console.log(`Delusion Farmer: This probably happened because a party member died and was left behind in the Seal`);
				console.log(`Delusion Farmer: OR`);
				console.log(`Delusion Farmer: Sometimes the game forgets a party member when changing rooms. When this happens, they will be stuck in the previous room`);
				console.log(`Delusion Farmer: The party leader will eventually exit to the Chamber of Delusion but the party member will be stranded, or be brought back`);
				console.log(`Delusion Farmer: to the Chamber but the game doesn't understand. At this point you need to stop the script, port everyone back into Chamber of`);
				console.log(`Delusion Farmer: Delusion as a group or reform the party and then restart the script.`);
			}
		}

		console.log(`Delusion Farmer: Beginning Chamber Exit Procedure`);
		console.log(`Delusion Farmer: Checking for nearest Delusion Manager`);
		let nearestManagerIdSecondRoom = null; 
		// loop until we get out of the Eastern Seal
		while (!CreaturesList.ContainsName("Guardian of Eastern Seal")) {
			nearestManagerIdSecondRoom = getNearestManager();
			
			if (nearestManagerIdSecondRoom != null) {
				console.log(`Delusion Farmer: Exiting Chamber of Delusion`);
				await sleep(500);
				Send.Action(nearestManagerIdSecondRoom);
				await sleep(1000);
				Send.Action(nearestManagerIdSecondRoom);
				await sleep(1000);
				//"Go Outside" GoTo_Quest ChamberOfDelusionEast go_out
				Send.ReqBypassToServer(`Quest ChamberOfDelusionEast go_out`);
			}
			await sleep(500);
		}
		await sleep(500);
		
		console.log(`Delusion Farmer: Ending Chamber Run #${chamberRuns}`);
		console.log(`Delusion Farmer: Chamber Runs: ${chamberRuns} || Aenkinel Encounters: ${bossEncounters}`);
		chamberRuns += 1;
		console.log(`Delusion Farmer: Waiting 5s for party to gather for next run...`);
		await sleep(5000);
	}
	console.log(`Delusion Farmer: Script Ended`);
})();