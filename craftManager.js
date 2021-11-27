function reverseHex(str) {
    //return str.split("").reverse().join("");
	return str.match(/[a-fA-F0-9]{2}/g).reverse().join('');
}

function addItem(itemID, qty) {
	return (reverseHex(itemID.toString(16).padStart(8,'0')) + reverseHex(qty.toString(16).padStart(8,'0')) + (0).toString(16).padStart(8,'0')).toUpperCase();
	//console.info(`${itemStr}`);
	//return itemStr;
}

(async function main() {
	console.log(`${(new Date()).toLocaleTimeString()} : Craft Manager : Starting Script`);
	const maxQty = 700000;
	const maxQtySSA = 100;
	const maxQtyBSpSA = 10;
	const maxQtySSS = 5000000;
	const maxQtySBSpS = 10;
	
	let craftSleep = 500;
    for(;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if (Me.MP <= 400) {
				console.log(`${(new Date()).toLocaleTimeString()} : Craft Manager : Low Mana (${Me.MpPercent.toFixed(2)}%) - Community Heal`);
				Send.ReqBypassToServer("_bbsbufferbypass_heal 0 0 0");
				await sleep(500);
			} else {
				//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Checking Materials`);
				let itemToCraft, itemOre, itemCrystals, craftHex;
				let itemName;
				//let itemOre = "";
				//let itemCrystals ="";
				
				//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : ${itemToCraft.Count} ${itemOre.Count} ${itemCrystals.Count}`);
				if (Inventory.GetItemByName("Blessed Spiritshot (S-Grade)") == null || Inventory.GetItemByName("Blessed Spiritshot (S-Grade)").Count < maxQtySBSpS) {
					itemName = "Blessed Spiritshot (S-Grade)";
					itemToCraft = Inventory.GetItemByName(itemName);
					itemOreName = "Spirit Ore";
					itemOre = Inventory.GetItemByName(itemOreName);
					craftHex = "B847010000"
					itemCrystals = Inventory.GetItemByName("Crystal (S-Grade)");
				} else if (Inventory.GetItemByName("Soulshot (S-Grade)") == null || Inventory.GetItemByName("Soulshot (S-Grade)").Count < maxQtySSS) {
					itemName = "Soulshot (S-Grade)";
					itemToCraft = Inventory.GetItemByName(itemName);
					itemOreName = "Soul Ore";
					itemOre = Inventory.GetItemByName(itemOreName);
					craftHex = "B818000000";
					itemCrystals = Inventory.GetItemByName("Crystal (S-Grade)");
				} else if (Inventory.GetItemByName("Blessed Spiritshot (A-Grade)") == null || Inventory.GetItemByName("Blessed Spiritshot (A-Grade)").Count < maxQtyBSpSA) {
					itemName = "Blessed Spiritshot (A-Grade)";
					itemToCraft = Inventory.GetItemByName(itemName);
					itemOreName = "Spirit Ore";
					itemOre = Inventory.GetItemByName(itemOreName);
					craftHex = "B846010000";
					itemCrystals = Inventory.GetItemByName("Crystal (A-Grade)");
				} else if (Inventory.GetItemByName("Soulshot (A-Grade)") == null || Inventory.GetItemByName("Soulshot (A-Grade)").Count < maxQtySSA){
					itemName = "Soulshot (A-Grade)";
					itemToCraft = Inventory.GetItemByName(itemName);
					itemOreName = "Soul Ore";
					itemOre = Inventory.GetItemByName(itemOreName);
					craftHex = "B817000000"
					itemCrystals = Inventory.GetItemByName("Crystal (A-Grade)");
				}
				//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Materials Parameters Set`);
				await sleep(200);
				
				if (itemName != null) {
					console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : I need to make ${itemName}`);
									
					if (itemOre == null || itemOre.Count < 700) {
						if (Inventory.GetItemByName("Adena").Count >= 5000000) {
							console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Buying ${itemOreName}`);
							Send.ReqBypassToServer("_bbsmultisell;shop-general;20014");
							await sleep(1000);
							if (itemOre.Name == "Spirit Ore") {
								// Spirit Ore 10000
								Send.SendHex("B02E4E000080841E0010270000000000000000000000000000000000000000000000000000000000000000");
							} else {
								// Soul Ore 10000
								Send.SendHex("B02E4E0000E0FD1C0010270000000000000000000000000000000000000000000000000000000000000000");
							}
							await sleep(1000);
							itemOre = Inventory.GetItemByName(itemOreName);
						} else {
							console.warn(`${(new Date()).toLocaleTimeString()} : Craft Manager : Buying ${itemOreName} - FAIL - Not enough Adena`);
						}
					}
					//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Spirit Ore DONE`);
					
					if (itemCrystals == null || itemCrystals.Count <= 200) {
						if (itemCrystals.Name == "Crystal (S-Grade)") {
							console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : I ran out of Crystal (S-Grade)`);
						} else {
							let itemCrystallize = Inventory.GetItemByName("Sword of Miracles");
							if (itemCrystallize == null) {
								if (Inventory.GetItemByName("Adena").Count >= 21000000) {
									console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Buying Sword of Miracles to crystallize`);
									Send.ReqBypassToServer("_bbsmsell;_bbshome;20010");
									await sleep(1000);
									Send.SendHex("B02A4E0000A086010001000000000000000000000000000000000000000000000000000000000000000000");
									await sleep(1000);
								} else {
									console.warn(`${(new Date()).toLocaleTimeString()} : Craft Manager : Buying Sword of Miracles - FAIL - Not enough Adena`);
								}
							} else {
								console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Crystallizing ${itemCrystallize.Name}`);// ${pktCode}`);
								//let pktCode = "2F"+addItem(itemCrystallize.objId,1).toUpperCase()
								Send.SendHex("2F"+addItem(itemCrystallize.objId,1).toUpperCase());
								//console.info(`Crystallize: ${pktCode}`);
								await sleep(1000);
							}
						}
					}
					//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Crystals DONE`);
					
					//if (itemToCraft.Count < maxQty) {
					if (craftHex != null) {
						//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Crafting ${itemToCraft.Name}`);
						Send.SendHex(craftHex);
						itemToCraft = Inventory.GetItemByName(itemName);
						console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : ${itemToCraft.Name} ${itemToCraft.Count} ${itemOre.Count} ${itemCrystals.Count}`);
						craftSleep = 1000;
					} else {
						craftSleep = 10000;
					}
					
					//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : BSpSA DONE`);
					//console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : Loop Done`);
				} else {
					console.info(`${(new Date()).toLocaleTimeString()} : Craft Manager : I don't need to make anything right now`);
					craftSleep = 30000;
				}
			}
		}
        await sleep(craftSleep);
    }
})();