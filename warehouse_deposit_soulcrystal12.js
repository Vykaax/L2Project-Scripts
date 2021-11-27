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
	console.info("=".repeat(54) + "\n== Vykaax's Soul Crystal Depositor Script 1.00 ==\n" + "=".repeat(54));
	//const ADENA_ID = 57;
	//const MINERVA_ID = 30048;
	await sleep(2500);
	Send.ReqBypassToServer("_bbswarhouse:clandeposit");
	let sleepTime = 5000;
    for(;;) {
		
		if (Context.IsConnected) {
			console.info(`Starting Deposit Attempt`);
			
			let itemRedSC = Inventory.GetItemByName("Red Soul Crystal - Stage 14");
			let itemBlueSC = Inventory.GetItemByName("Blue Soul Crystal - Stage 14");
			let itemGreenSC = Inventory.GetItemByName("Green Soul Crystal - Stage 14");

			let pktItemList = "";
			let listCount = 0;
			if ( itemRedSC !== null ) {
				console.info(`Found ${itemRedSC.Name}`);
				listCount++;
				pktItemList = pktItemList + addItem(itemRedSC.objId,1);
				//console.info(`Current item list: ${pkItemList}`);
			}
			
			if ( itemBlueSC !== null ) {
				console.info(`Found ${itemBlueSC.Name}`);
				listCount++;
				pktItemList = pktItemList + addItem(itemBlueSC.objId,1);
				//console.info(`Current item list: ${pkItemList}`);
			}
			
			if ( itemGreenSC !== null ) {
				console.info(`Found ${itemGreenSC.Name}`);
				listCount++;
				pktItemList = pktItemList + addItem(itemGreenSC.objId,1);
				//console.info(`Current item list: ${pkItemList}`);
			}

			if ( listCount > 0 ) {
				let pktString = reverseHex(listCount.toString(16).padStart(8,'0')) + pktItemList;
				let pktCode = "3B"+pktString.toUpperCase();
				console.info(`Warehouse Packet: ${pktCode}`);
				
				
				//let pb = new PacketBuilder();
				//pb.AppendHex("3B");
				//pb.AppendHex(pktString); // number of different items to deposit
				Send.SendHex(pktCode);
				await sleep(1000);
				if ( itemSC.Count > 2 ) {
					console.debug(`Was not able to send items... trying again.`);
					sleepTime = 1000;
				} else {
					console.warn(`Items sent`);
					sleepTime = 60000;
				}
				//console.info(`PB Packet: ${pb.toString()}`);
			} else {
				console.warn(`There were no valid items to send`);
			}
			
			console.info(`Script loop done - waiting for timer to send next deposit ${sleepTime}s`);
		
		}
		await sleep(sleepTime);
    }
})();