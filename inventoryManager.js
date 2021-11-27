assert_min_version("2.3.0");

var lastWarehouseList;

var LIST_SS_CLASSES = [9,24,37,92,102,109,130,142,162,163,164,7,8,22,23,35,36,93,101,108,141,158,159,160,161,165,188,4,5,6,32,33,90,91,99,106,139,148,149,150,151,0,1,2,3,18,19,20,21,31,34,44,45,46,47,48,49,50,53,54,55,56,57,88,89,100,107,113,114,117,118,123,124,125,126,127,128,129,131,132,133,134,135,136,140,152,153,154,155,156,157,172,173,182,183,184,185,186,189];
var LIST_BSPS_CLASSES = [15,16,17,29,30,42,43,97,98,105,112,146,171,179,180,181,10,11,12,13,14,25,26,27,28,38,39,40,41,51,52,94,95,96,103,104,110,111,115,116,143,144,145,166,167,168,169,170,174,175,176,177,178,187];

var SSNG_ID = 1835;
var SSD_ID = 1463;
var SSC_ID = 1464;
var SSB_ID = 1465;
var SSA_ID = 1466;
var SSS_ID = 1467;

var BSPSNG_ID = 3947;
var BSPSD_ID = 3948;
var BSPSC_ID = 3949;
var BSPSB_ID = 3950;
var BSPSA_ID = 3951;
var BSPSS_ID = 3952;
	
var SSNG_SETTINGS = { Id: 1535, min: 300, max: 1000};
var SSD_SETTINGS = { Id: 1463, min: 300, max: 5000};
var SSC_SETTINGS = { Id: 1464, min: 300, max: 50000};
var SSB_SETTINGS = { Id: 1465, min: 300, max: 50000};
var SSA_SETTINGS = { Id: 1466, min: 300, max: 50000};
var SSS_SETTINGS = { Id: 1467, min: 10000, max: 100000};

var BSPSNG_SETTINGS = { Id: 3947, min: 300, max: 1000};
var BSPSD_SETTINGS = { Id: 3948, min: 300, max: 5000};
var BSPSC_SETTINGS = { Id: 3949, min: 3000, max: 50000};
var BSPSB_SETTINGS = { Id: 3950, min: 3000, max: 50000};
var BSPSA_SETTINGS = { Id: 3951, min: 3000, max: 50000};
var BSPSS_SETTINGS = { Id: 3952, min: 3000, max: 50000};

function ReverseHex(str) { 
	return str.match(/[a-fA-F0-9]{2}/g).reverse().join('');
}

function AddItem(itemID, qty) {
	return (ReverseHex(itemID.toString(16).padStart(8,'0')) + ReverseHex(qty.toString(16).padStart(8,'0')) + (0).toString(16).padStart(8,'0')).toUpperCase();
}

function destroyItem(destroy_Item) {
	console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager: Destroying item ${destroy_Item.Name}`);
	
	let pktItemList = AddItem(destroy_Item.objId,1);;
	let pktString = pktItemList;
	let pktCode = "60"+pktString.toUpperCase();
	
	console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager: Destroy packet ${pktCode}`);
	Send.SendHex(pktCode);
}

function OnWareHouseWithdrawalList(whItemList) {
	console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Warehouse Opened`);

	lastWarehouseList = whItemList;
	console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Warehouse List Updated`);
}

function WithdrawItems(whItemList, itemId, itemQty) {
	console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Attempting to withdraw items`);
	
	let pktItemList = "";
	let listCount = 1;
	
	warehouseItem = whItemList.GetItemByID(itemId);
	if (warehouseItem != null) {
		let getQty = itemQty;
		if (itemQty > warehouseItem.Count) {
			getQty = (warehouseItem.Count)-1;
		}
	
		console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : I can get ${getQty} qty from the warehouse`);
		
		pktItemList = pktItemList + AddItem(warehouseItem.objId,getQty);
		let pktString = ReverseHex(listCount.toString(16).padStart(8,'0')) + pktItemList;
		let pktCode = "3C"+pktString.toUpperCase();
		console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Retrieving items with pktCode ${pktCode}`);
		
		Send.SendHex(pktCode);
	} else {
		console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : The warehouse ran out of stock`);
	}
}

function GetWeaponGrade() {
	for (i = 0; i < Inventory.Count; i++) {
		if (Inventory[i].IsEquiped && Inventory[i].Type.ToString() == "Weapon") {
			return Inventory[i].Grade.ToString();
		}
	}
	return null;
}

function CheckNeedShots() {
	let weaponGrade = GetWeaponGrade();
	//console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Weapon Grade ${weaponGrade}`);
	if (weaponGrade != null) {
		let compareObj;
		switch (weaponGrade) {
			case "None":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSNG_SETTINGS : compareObj = BSPSNG_SETTINGS;
				break;
			case "D":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSD_SETTINGS : compareObj = BSPSD_SETTINGS;
				break;
			case "C":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSC_SETTINGS : compareObj = BSPSC_SETTINGS;
				break;
			case "B":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSB_SETTINGS : compareObj = BSPSB_SETTINGS;
				break;
			case "A":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSA_SETTINGS : compareObj = BSPSA_SETTINGS;
				break;
			case "S":
			case "S80":
			case "S84":
				LIST_SS_CLASSES.includes(Me.ClassId) ? compareObj = SSS_SETTINGS : compareObj = BSPSS_ID;
				break;				
			default:
				//compareObj = null;
				//return false;
		}
		
		if (compareObj != null) {
			let tempMyShots = Inventory.GetItemByID(compareObj.Id);
			let curQty = 0;
			if (tempMyShots != null) {
				curQty = tempMyShots.Count;
			}			
			//console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : Inventory Status for ID (${compareObj.Id}): Min ${compareObj.min}, Max ${compareObj.max}, Current: ${curQty}`);
			if (curQty < compareObj.min) {
				// Return the item ID and qty of the shots needs
				return {Id: compareObj.Id, Qty: (compareObj.max-curQty)};
			}
			return null;
		}
		// try to get shots now
	} else {
		console.info("Weapon Grade not found");
		return null;
	}
	return null;
}


(async function main() {
	console.info("=== Vykaax's Inventory Manager Script 1.09 ===");
	const destroyList = [15537];
	const destroyTest = 15537; // Strongbox of Promise
	
	await sleep(5000);
	
	//Send.ReqBypassToServer("_bbswarhouse:clanwithdraw");
	let sleepTime = 60000;
    for(;;) {
		if (Context.IsConnected && !Me.IsDead) {
			// Check if there are items to destroy
			itemToDestroy = Inventory.GetItemByID(destroyTest);
			if (itemToDestroy != null) {
				console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : There are items to destroy`);
				destroyItem(itemToDestroy);
				await sleep(1000);
			}

			// Check if there are items to retrieve
			needThisItem = CheckNeedShots();
			if (needThisItem != null) {
				console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : I need to get ${needThisItem.Qty} x item ID ${needThisItem.Id}`);
				Send.ReqBypassToServer("_bbswarhouse:clanwithdraw");
				await sleep(1500);
				WithdrawItems(lastWarehouseList, needThisItem.Id, needThisItem.Qty);
				await sleep(1000);
				Send.RequestAutoSoulShot(needThisItem.Id,1);
				sleepTime = 5000;
				
			} else {
				//console.info(`${(new Date()).toLocaleTimeString()} : Inventory Manager : No action`);
				// don't need any items from the warehouse
				sleepTime = 60000;
			}
			
			// Check if there are items to deposit
			// ~~~ later
		}
		await sleep(sleepTime);
    }
})();