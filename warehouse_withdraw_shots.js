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
	console.info("=".repeat(54) + "\n== Vykaax's Warehouse Receiver Script 1.01 ==\n" + "=".repeat(54));
	const SSC_ID = 1464
	await sleep(2500);
	Send.ReqBypassToServer("_bbswarhouse:clanwithdraw");
	let sleepTime = 240000;
	let SHOT_ID = SSC_ID;
	console.info(`Shot Manager: Entering loop`);
    for(;;) {
		console.info(`Shot Manager: Top of loop`);
		if (Context.IsConnected) {
			console.info(`Shot Manager: Is Connected`);
			let itemShots = Inventory.GetItemByID(SHOT_ID);
			let pktItemList = "";
			let listCount = 0;
			console.info(`Shot Manager: Selected shot name ${itemShots.Name}`);
			if ( itemShots == null  || itemShots.Count < 10000 ) {
				//console.info(`I have ${itemShots.Count} ${itemShots.Name}`);
				listCount++;
				pktItemList = pktItemList + addItem(itemShots.Id,500);
				//console.info(`SSV IN: Current item list ${pkItemList}`);
			} else {
				console.info(`Shot Manager: I don't need more shots`);
			}

			console.info(`Shot Manager: Items to retrieve ${listCount}`);
			if ( listCount > 0 ) {
				let pktString = reverseHex(listCount.toString(16).padStart(8,'0')) + pktItemList;
				let pktCode = "3C"+pktString.toUpperCase();
				console.info(`Warehouse Packet: ${pktCode}`);
				
				
				//let pb = new PacketBuilder();
				//pb.AppendHex("3B");
				//pb.AppendHex(pktString); // number of different items to deposit
				//Send.SendHex(pktCode);
				await sleep(1000);
				if ( itemShots.Count <= 10000 ) {
					console.debug(`Was not able to get items... trying again.`);
					sleepTime = 10000;
				} else {
					console.warn(`Items Received: ${itemShots.Name} (${itemShots.Count})`);
					sleepTime = 6000000;
				}
				//console.info(`PB Packet: ${pb.toString()}`);
			} else {
				console.warn(`There were no valid items to receive`);
			}
			
			console.info(`Script loop done - waiting for timer to receive next deposit ${sleepTime}s`);
		
		}
		await sleep(sleepTime);
    }
})();