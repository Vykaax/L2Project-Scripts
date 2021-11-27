// disarm message 110
/*const ID_MAGES = [10,11,12,13,14,25,26,27,28,38,39,40,41,51,52,94,95,96,103,104,110,111,115,116,143,144,145,166,167,168,169,170,174,175,176,177,178,187];
const ID_FIGHTERS = [0,1,2,3,18,19,20,21,31,34,44,45,46,47,48,49,50,53,54,55,56,57,88,89,100,107,113,114,117,118,123,124,125,126,127,128,129,131,132,133,134,135,136,140,152,153,154,155,156,157,172,173,182,183,184,185,186,189];
const ID_SUPPORTS = [15,16,17,29,30,42,43,97,98,105,112,146,171,179,180,181];
const ID_TANKS = [4,5,6,32,33,90,91,99,106,139,148,149,150,151];
const ID_DAGGERS = [7,8,22,23,35,36,93,101,108,141,158,159,160,161,165,188];
const ID_ARCHERS = [9,24,37,92,102,109,130,142,162,163,164];*/
var lockedWeaponID;

/*function GetWeaponScheme {
    let result = null;
    if (ID_FIGHTERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet figher 0 0";
    } else if (ID_MAGES.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet mage 0 0";
    } else if (ID_SUPPORTS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet support 0 0";
    } else if (ID_TANKS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet tank 0 0";
    } else if (ID_DAGGERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet dagger 0 0";
    } else if (ID_ARCHERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet archer 0 0";
    }

    return result;
};*/

async function OnSystemMessage(id) {
	if (id == 417) {
		console.error(`${(new Date()).toLocaleTimeString()} : PvP Manager : I've been disarmed!`);
		await sleep(5100);
		EquipLockedWeapon();
	}
}

/*async function OnIncomingPacket(p) {
    const packet = new PacketReader(p.splice(2, p.length - 2));
    const _id = packet.ReadByte();
	
    if (_id === 0x62) {
        const msgID = packet.ReadDWord();
		if (msgID == 417) {
			console.error(`${(new Date()).toLocaleTimeString()} : PvP Manager : I've been disarmed!`);
			EquipBestWeapon();
		}
    }
}*/



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
	/*
	//var foundWeapon = false;
	var tempBestWeapon = null;
	var tempBestItemLvl = 0;
	
	for (i = 0; i < Inventory.Count; i++) {
		if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
			foundWeapon = true;
			tempBestWeapon = Inventory[i].objId;
			break;
		} else if (Inventory[i].Type.ToString() == "Weapon") {
			if (tempBestWeapon == null) {
				tempBestWeapon = Inventory[i].objId;
			}
			
			if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "S84" && Me.Level >= 84) {
				tempBestItemLvl = 84;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "S80" && Me.Level >= 80) {
				tempBestItemLvl = 80;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "S" && Me.Level >= 76) {
				tempBestItemLvl = 76;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "A" && Me.Level >= 61) {
				tempBestItemLvl = 61;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "B" && Me.Level >= 62) {
				tempBestItemLvl = 52;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "C" && Me.Level >= 40) {
				tempBestItemLvl = 40;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "D" && Me.Level >= 20) {
				tempBestItemLvl = 20;
			} else if (Inventory.GetItemByObjId(tempBestWeapon).Grade.ToString() == "None") {
				tempBestItemLvl = 1;
			}
			
			
			
			if (Me.Level >= 84 && Inventory[i].Grade.ToString() == "S84") {
				
			}
		}
	}
	if (tempBestWeapon == null) {
		console.warn(`${(new Date()).toLocaleTimeString()} : PvP Manager : I could not find a weapon to use!`);
	} else {
		console.info(`${(new Date()).toLocaleTimeString()} : PvP Manager : Setting best weapon!`);
		lockedWeaponID = tempBestWeapon;
	}*/
}


async function EquipLockedWeapon() {
	if (lockedWeaponID == null) {
		console.error(`${(new Date()).toLocaleTimeString()} : PvP Manager : I have nothing to equip!`);
	} else {
		console.warn(`${(new Date()).toLocaleTimeString()} : PvP Manager : Equipping ${Inventory.GetItemByObjectID(lockedWeaponID).Name}!`);
		await sleep(200);
		Send.UseItem(lockedWeaponID);
		/*let hasWeapon = false;
		do {
			Send.UseItem(lockedWeaponID);
			await sleep(300);
			for (i = 0; i < Inventory.Count; i++) {
				if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
					hasWeapon = true;
				}
			}
		} while (!hasWeapon);*/
	}
}

(async function main() {
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
				/*for (i = 0; i < itemCount; i++) {
					itemName = Inventory[i].Name;
					isShadowItem = itemName.includes("Shadow Item");
					if ( Inventory[i].Type.ToString() == "Weapon" && isShadowItem) {
						console.warn(`I had no weapon equipped, equipping ${Inventory[i].Name}`);
						Send.UseItem(Inventory[i].objId);
						break;
					}
				}*/
			}
		}
		await sleep(500);
	}
})();