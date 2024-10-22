(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's Basic Item Buyer Script 1.1 ==\n" + "=".repeat(54));
	
	for (;;) {
		let itemCheck = Inventory.GetItemByName("Mana Potion");
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
		if (itemCheck == null || itemCheck.Count < 100) {
			Send.ReqBypassToServer("_bbsmultisell;shop-general;20014");
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
			Send.SendHex("B02E4E000060823B00E8030000000000000000000000000000000000000000000000000000000000000000"); // 1000 Mana Potions from Alt+B shop
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
		}
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(10000);} else {await sleep(10000);}
	}
})();