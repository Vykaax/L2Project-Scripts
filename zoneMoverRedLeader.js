async function moveToWait(x,y) {
	StopCombat();
	console.info(`Zone Mover: Moving to ${x},${y} | My position ${Me.X},${Me.Y}`);
	do {
		Send.Move(x,y);
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
	} while (Me.X != x && Me.Y != y)
		
	console.info(`Zone Mover: Finished moving`);
	StartCombat();
	//StopCombat();
	//Send.MoveTo(x,y);
    //return str.split("").reverse().join("");
	//return str.match(/[a-fA-F0-9]{2}/g).reverse().join('');
}

//function addItem(itemID, qty) {
	//return (reverseHex(itemID.toString(16).padStart(8,'0')) + reverseHex(qty.toString(16).padStart(8,'0')) + (0).toString(16).padStart(8,'0')).toUpperCase();
	//console.info(`${itemStr}`);
	//return itemStr;
//}
function countNearMobs() {
	let nearMobCalc = 0;

	for (i = 0; i < CreaturesList.Count; i++) {
		if (CreaturesList[i].crtType.ToString() == "Mob" && !CreaturesList[i].IsDead) {
			CreaturesList[i].CalculateDistance();
			if ( CreaturesList[i].Distance < 1000 && CreaturesList[i].zDistance < 50 ) {//&& !PartyList.Name.includes(CreaturesList[i].Name))  {
				console.info(`Zone Mover: ${CreaturesList[i].Name} ${CreaturesList[i].Distance} ${CreaturesList[i].zDistance}`);
				//if (CreaturesList[i].Name == PartyList.GetItemByName(CreaturesList[i].Name):
				nearMobCalc++;
			}

			}
		/*console.info(`SpoilHelper: Near Mob - ${CreaturesList[i].Name} (${CreaturesList[i].Distance}) (${CreaturesList[i].Z})`);
		if (CreaturesList[i].Distance < 150 && !CreaturesList[i].IsDead) {
			nearMobCount++;
		}*/
	}
	
	return nearMobCalc;
}


(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's Zone Mover Script 1.1 ==\n" + "=".repeat(54));
	let nearMobs = 0;
	// 114624 15906
    for(;;) {
		
		if (Context.IsConnected) {
			nearMobs = countNearMobs();
			console.info(`Zone Mover: Near Mobs (${nearMobs})`);
			//console.info(`zone mover`);
			if (nearMobs == 0) {
				console.warn(`Zone Mover: No Mobs Near`);
				console.info(`Zone Mover: Entering new zone loop`);
				moveToWait(114811,16042);
			}
		}
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(2000);} else {await sleep(2000);}
    }
})();