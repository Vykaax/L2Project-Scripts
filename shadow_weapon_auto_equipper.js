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
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(5000);} else {await sleep(5000);}
	}
})();