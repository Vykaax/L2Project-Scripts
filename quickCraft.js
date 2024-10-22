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
	console.log(`${(new Date()).toLocaleTimeString()} : Quick Craft : Starting Script`);
	const maxQty = 700000;
	// CBP B81F000000
	// VOP B823000000
	// Steel B81E000000
	// Mithril Allow B826000000
	
	let craftSleep = 500;
    for(;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if (Me.MP <= 400) {
				console.log(`${(new Date()).toLocaleTimeString()} : Quick Craft : Low Mana (${Me.MpPercent.toFixed(2)}%) - Community Heal`);
				Send.ReqBypassToServer("_bbsbufferbypass_heal 0 0 0");
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
			} else {
				//console.info(`${(new Date()).toLocaleTimeString()} : Quick Craft : Checking Materials`);
				
				//console.info(`${(new Date()).toLocaleTimeString()} : Quick Craft : ${itemToCraft.Count} ${itemOre.Count} ${itemCrystals.Count}`);
				if (Inventory.GetItemByName("Animal Bone") != null && Inventory.GetItemByName("Animal Bone").Count > 10) {
					Send.SendHex("B81F000000");
				} else if ((Inventory.GetItemByName("Coarse Bone Powder") != null && Inventory.GetItemByName("Coarse Bone Powder").Count >= 3) && (Inventory.GetItemByName("Varnish") != null && Inventory.GetItemByName("Varnish").Count >= 300) && (Inventory.GetItemByName("Stone of Purity") != null && Inventory.GetItemByName("Stone of Purity").Count >= 50)) {
					Send.SendHex("B823000000");
				} else if ((Inventory.GetItemByName("Varnish") != null && Inventory.GetItemByName("Varnish").Count >= 10) && (Inventory.GetItemByName("Iron Ore") != null && Inventory.GetItemByName("Iron Ore").Count >= 2)) {
					Send.SendHex("B81E000000");
				} else if ((Inventory.GetItemByName("Varnish of Purity") != null && Inventory.GetItemByName("Varnish of Purity").Count >= 10) && (Inventory.GetItemByName("Steel") != null && Inventory.GetItemByName("Steel").Count >= 2) && (Inventory.GetItemByName("Mithril Ore") != null && Inventory.GetItemByName("Mithril Ore").Count >= 1)) {
					Send.SendHex("B826000000");
				} else {
					console.info(`${(new Date()).toLocaleTimeString()} : Quick Craft : Nothing to craft`);
				}
				//console.info(`${(new Date()).toLocaleTimeString()} : Quick Craft : Materials Parameters Set`);
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(200);} else {await sleep(200);}
			}
		}
        await sleep(craftSleep);
    }
})();