(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's Item Buyer Script 1.00 ==\n" + "=".repeat(54));
	const TARGET_ITEM_ID = 2503; // Homunkulus Sword
	const buyTargetCount = 100; // buy until inventory contains this many items
	let curTargetCount = 0;
	
	for (let i = 0; i < Inventory.Count; i++) {
		if (Inventory[i].id == TARGET_ITEM_ID) {
			curTargetCount++;
		}
	}
	console.info(`Found ${curTargetCount} items. Need ${buyTargetCount} total`);
	if (curTargetCount < buyTargetCount) {
		for (let j = curTargetCount+1; j <= buyTargetCount; j++) {
			console.info(`Buying ${j} of ${buyTargetCount}`);
			Send.ReqBypassToServer("_bbsmultisell;shop-general;20012");
			await sleep(1000);
			//Send.SendHex("B02C4E0000A086010001000000000000000000000000000000000000000000000000000000000000000000"); // Homunkulus Sword
			Send.SendHex("B02C4E0000C05C150001000000000000000000000000000000000000000000000000000000000000000000"); // Yaksa Mace
			await sleep(1000);
		}
	}
	
})();