(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's Enchanter Script 1.00 ==\n" + "=".repeat(54));
	const TARGET_SCROLL_ID = 951; // Scroll Enchant Weapon C
	const TARGET_ITEM_ID = 2503; // Yaksa Mace
	const maxEnchant = 14; // safety max enchant - stop at this
	var itemCount = 1;
	var enchantAttempts = 0;
	var enchantSuccess = 0;
	
	//console.info(`Item Count: ${Inventory.Count} || Scrolls (${ewcItem.Count})`);
	await sleep(2000);
	//let testStop = 200; // only do 3 items for now while testing
	if (Context.IsConnected) {
		for (;;) {	
			
			var enchantableItems = [];
			for (i = 0; i < Inventory.Count; i++) {
				if ( Inventory[i].id == TARGET_ITEM_ID && Inventory[i].EnchantLvl < maxEnchant ) {
					// add the ojbId to the array
					enchantableItems.push(Inventory[i].objId);
				}
			}
			if ( enchantableItems.length == 0 ) {
				break;
			}
			
			console.info(`Enchantable items: ${enchantableItems.length}`);
			for (i = 0; i < enchantableItems.length; i++) {
				let ewcItem = Inventory.GetItemByID(TARGET_SCROLL_ID);
				let thisEnchantItem = Inventory.GetItemByObjectID(enchantableItems[i]);
				let thisEnchantItemId = thisEnchantItem.objId
				if (ewcItem.Count > 0 && thisEnchantItem.id == TARGET_ITEM_ID && thisEnchantItem.EnchantLvl < maxEnchant) {
					
					let encLvl = thisEnchantItem.EnchantLvl;
					let countsForPercent = false;
					if ( encLvl >= 3 ) {
						countsForPercent = true;
						enchantAttempts++;
					}
				
					console.info(`${thisEnchantItem.Name} (Enchant Level: ${thisEnchantItem.EnchantLvl} (objId: ${thisEnchantItem.objId}))`);
					
					let itemHex = thisEnchantItem.objId.toString(16).match(/[a-fA-F0-9]{2}/g).reverse().join('');
					let pbEnchant = new PacketBuilder();
					let pbSelectItem = new PacketBuilder();
					
					Send.UseItem(ewcItem.objId);
					await sleep(500);
					pbEnchant.AppendHex("D04C00");
					pbEnchant.AppendHex(itemHex);
					
					pbSelectItem.AppendHex("5F");
					pbSelectItem.AppendHex(itemHex); // Select item to enchant
					pbSelectItem.AppendHex("00 00 00 00");
					
					Send.SendHex(pbEnchant.toString());
					await sleep(500);

					Send.SendHex(pbSelectItem.toString());
					await sleep(500);
					if (Inventory.GetItemByObjectID(thisEnchantItemId) == null) {
						console.error(`Enchant Failed`);
					} else {
						if ( countsForPercent ) {
							enchantSuccess++;
						}
						console.warn(`Enchant Success! Gained ${Inventory.GetItemByObjectID(thisEnchantItemId).Name}`);
					}
					console.log(`Current Rate: ${enchantSuccess} of ${enchantAttempts} (${(enchantSuccess/enchantAttempts*100).toFixed(2)}%)`);

					await sleep(500);
					itemCount++;
				}
			}
		}
	}
	console.info("Enchanting Script Ended");
})();