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
	console.info("=".repeat(54) + "\n== Vykaax's AA Sender Script 1.01 ==\n" + "=".repeat(54));
	const ADENA_ID = 57;
	const ANCIENT_ID = 5575;
	if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(2500);} else {await sleep(2500);}
	Send.ReqBypassToServer("_bbswarhouse:clandeposit");
	let sleepTime = 240000;
    for(;;) {
		
		if (Context.IsConnected) {
			let itemAdena = Inventory.GetItemByID(ADENA_ID);
			let itemAncient = Inventory.GetItemByID(ANCIENT_ID);
			let pktItemList = "";
			let listCount = 0;
			Send.Say2(0,".aa","",true);
			if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
			if ( itemAncient !== null ) {
				console.info(`I have ${itemAncient.Count} ${itemAncient.Name}`);
				listCount++;
				pktItemList = pktItemList + addItem(itemAncient.objId,(itemAncient.Count)-1);
				//console.info(`Current item list: ${pkItemList}`);
			}
					
			if ( itemAdena !== null ) {
				console.info(`I have ${itemAdena.Count} Adena`);
				if (itemAdena.Count > 5000000) {
					listCount++;
					pktItemList = pktItemList + addItem(itemAdena.objId,(itemAdena.Count-3000000));
					//console.info(`Current item list: ${pkItemList}`);
				};
			}
			if ( listCount > 0 ) {
				let pktString = reverseHex(listCount.toString(16).padStart(8,'0')) + pktItemList;
				let pktCode = "3B"+pktString.toUpperCase();
				console.info(`Warehouse Packet: ${pktCode}`);
				
				
				//let pb = new PacketBuilder();
				//pb.AppendHex("3B");
				//pb.AppendHex(pktString); // number of different items to deposit
				Send.SendHex(pktCode);
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
				if ( itemAncient.Count > 2 ) {
					console.debug(`Was not able to send items... trying again.`);
					sleepTime = 1000;
				} else {
					console.warn(`Items sent`);
					sleepTime = 6000000;
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