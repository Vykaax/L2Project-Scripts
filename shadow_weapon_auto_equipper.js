(async function main() {
	console.info(`ShadowAutoEquipper: Started`);
	for (;;) {
		if (Context.IsConnected) {
			let hasEquipped = false;
			let itemCount = Inventory.Count;

			for (i = 0; i < itemCount; i++) {
				if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
					hasEquipped = true;
					break;
				}
			}
			
			if (!hasEquipped) {
				for (i = 0; i < itemCount; i++) {
					itemName = Inventory[i].Name;
					isShadowItem = itemName.includes("Shadow Item");
					if ( Inventory[i].Type.ToString() == "Weapon" && isShadowItem) {
						console.warn(`ShadowAutoEquipper: I had no weapon equipped, equipping ${Inventory[i].Name}`);
						Send.UseItem(Inventory[i].objId);
						break;
					}
				}
			}
		}
		await sleep(5000);
	}
})();