(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's Basic Item Buyer Script 1.00 ==\n" + "=".repeat(54));
	
	for (;;) {
		let itemCheck = Inventory.GetItemByName("Mana Potion");
		await sleep(500);
		if (itemCheck == null || itemCheck.Count < 100) {
			Send.ReqBypassToServer("_bbsmultisell;shop-general;20014");
			await sleep(1000);
			Send.SendHex("B02E4E000060823B00E8030000000000000000000000000000000000000000000000000000000000000000"); // 1000 Mana Potions from Alt+B shop
			await sleep(1000);
		}
		await sleep(10000);
	}
})();