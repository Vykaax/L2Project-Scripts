var lockedWeaponID;

async function OnSystemMessage(id) {
	if (id == 417) {
		console.error(`${(new Date()).toLocaleTimeString()} : PvP Manager : I've been disarmed!`);
		await sleep(5100);
		EquipLockedWeapon();
	}
}

function LockBestWeapon() {
	//console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : Finding best weapon!`);
	let foundWeapon = false;
	if (lockedWeaponID == null) {
		for (i = 0; i < Inventory.Count; i++) {
			if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
				//foundWeapon = true;
				console.info(`${i} : ${Inventory[i].Name}`);
				lockedWeaponID = Inventory[i].objId;
				foundWeapon = true;
				break;
			}
		}
		//console.info(`done weapon loop`);
		if (foundWeapon) {
			console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : Setting locked weapon! (${Inventory.GetItemByObjectID(lockedWeaponID).Name})`);
		} else {
			console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : No equipped weapon found!`);
		}
	} else {
		//console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : My locked weapon is ${Inventory.GetItemByObjectID(lockedWeaponID).Name}`);
	}
}


async function EquipLockedWeapon() {
	if (lockedWeaponID == null) {
		console.error(`${(new Date()).toLocaleTimeString()} : PvP Manager : I have nothing to equip!`);
	} else {
		console.warn(`${(new Date()).toLocaleTimeString()} : PvP Manager : Equipping ${Inventory.GetItemByObjectID(lockedWeaponID).Name}!`);
		await sleep(200);
		Send.UseItem(lockedWeaponID);
	}
}

(async function main() {
    console.info("=== Vykaax's Weapon Manager Script 1.1 ===");
	console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : Started`);
	await sleep(500);
	LockBestWeapon();
	await sleep(5000);
	for (;;) {
		LockBestWeapon();
		await sleep(5000);
		if (Context.IsConnected && !Me.IsDead) {
			let hasEquipped = false;
			let itemCount = Inventory.Count;
						
			for (i = 0; i < itemCount; i++) {
				if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
					hasEquipped = true;
					break;
				}
			}
			
			if (!hasEquipped) {
				console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : I have no weapon equipped`);
				EquipLockedWeapon();
			}
		}
		await sleep(500);
	}
})();