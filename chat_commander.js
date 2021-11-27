assert_min_version("2.2.0");
/**
 * Auto-Buffer Script for Classes v1.6
 *
 * @author Vykaax
 * @created 2020-05-25
 * @requires L2Project v2.2.0 or higher
 * 2021-07-26: Replaced Status with Context (Vykaax)
 */

async function OnSay(charName, fullChatString, messageType) {
	// Only respond to private message report requests from the following list of approved character names
	// Remember when you add to this list you will need to stop and start the script on all characters
	let approvedRecipients = [`Vykaax`,`Bishada`,`Xaan`,`Critical`,`Gather1`,`Immortal`,`Bulwark`,`Annihilation`,`Steak`,`Factory`];
	if (Context.IsConnected) {
		//let fullChatString = messages.join("");
		let chatSplit = fullChatString.split(" ");
		if ((messageType == 4 || messageType == 3) && chatSplit[0] == "ss") {
			// Use the party chat command "ss on" or "ss off" to enable or disable any available soulshots or blessed spiritshots
			let ssList = [1835,1463,1464,1465,1466,1467,3947,3948,3949,3950,3951,3952];
			let ssState = 99;
			if (chatSplit[1] == "on") {
				ssState = 1;
				Send.Say2(messageType, "Enabling SS","",true);
			} else if (chatSplit[1] == "off") {
				ssState = 0;
				Send.Say2(messageType, "Disabling SS","",true);
			}
			
			if ( ssState == 0 || ssState == 1) {
				let i;
				for (let i = 0; i < ssList.length; i++) {
					Send.RequestAutoSoulShot(ssList[i],ssState);
				}
			}
		} else if ((messageType == 4 || messageType == 3 || (messageType == 2 && approvedRecipients.includes(charName))) && chatSplit[0] == "report") {
			let itemList;
			let itemName;
			let statName;
			let checkByName = false;
			
			if (chatSplit[1] == "soulcrystal") {
				// This is the list of IDs all soul crystals level 10+
				itemList = [4639,4650,4661,5577,5578,5579,5580,5581,5582,5908,5911,5914,9570,9571,9572,10160,10161,10162,10480,10481,10482,13071,13072,13073,15541,15542,15543,15826,15827,15828];
			} else if (chatSplit[1] == "your_search") { // build your own custom item list for a single word search term here
				// add the item IDs you want to report on into the itemList array below like how it is done for soul crystals above
				itemList = [];
			} else if ( Number.isInteger(parseInt(chatSplit[1])) ){
				itemList = parseInt(chatSplit[1]);
			} else {
				if (chatSplit[1] == "stat") {
					statName = chatSplit[2];
				} else {
					let i;
					if (chatSplit.length > 2) {
						itemName = chatSplit[1];
						for (i=2; i< chatSplit.length; i++) {
							itemName = itemName.concat(" "+chatSplit[i]);
						}
					} else if (chatSplit.length == 2) {
						itemName = chatSplit[1];
					}
					checkByName = true;
					itemList = chatSplit[1];
				}
			}

			if (statName != null) {
				Send.Say2(messageType,`I have ${eval("Me."+statName)} ${statName}`,charName,true);
			} else if (checkByName == false) {
				if (Array.isArray(itemList)) {
					let i;
					for (i = 0; i < itemList.length; i++) {
						var testItem = Inventory.GetItemByID(itemList[i]);
						if (testItem != null) {
							Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
						}
					}
				} else {
					var testItem = Inventory.GetItemByID(itemList);
					if (testItem != null) {
						Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
					}
				}
			} else {
				let testItem = Inventory.GetItemByName(itemName);
				if (testItem != null) {
					Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
				}
			}
		} else if ((messageType == 4 || messageType == 3 || (messageType == 2 && approvedRecipients.includes(charName))) && chatSplit[0] == "use") {
			let reqId;
			let reqName;
			let checkByName = false;
			console.log(`Use Request: Type is ${chatSplit[1]}`);
			if ( Number.isInteger(parseInt(chatSplit[2])) ){
				reqId = parseInt(chatSplit[2]);
				console.log(`Use Request: Input is ${reqId}`);
			} else {
				let i;
				if (chatSplit.length > 3) {
					reqName = chatSplit[2];
					for (i=3; i< chatSplit.length; i++) {
						reqName = reqName.concat(" "+chatSplit[i]);
					}
				} else if (chatSplit.length == 3) {
					reqName = chatSplit[2];
				}
				checkByName = true;
				//itemList = chatSplit[2];
				console.log(`Use Request: Input is ${reqName}`);
			}
			
			if (chatSplit[1] == "item") {
				let testItem;
				if (checkByName == true) {
					console.log(`Use Request: Input type is name`);
					testItem = Inventory.GetItemByName(reqName);
				} else {
					console.log(`Use Request: Input type is reqId`);
					testItem = Inventory.GetItemByID(reqId);
				}
				if (testItem != null) {
					Send.Say2(messageType,`I am using item ${testItem.Name} : ${testItem.id} (${testItem.objId})`,charName,true);
					Send.UseItem(testItem.objId);
				} else {
					console.log(`testItem was null`);
				}
			} else if (chatSplit[1] == "skill") {
				let testSkill;
				if (checkByName == true) {
					console.log(`Use Request: Input type is name`);
					testSkill = SkillsList.GetItemByName(reqName);
				} else {
					console.log(`Use Request: Input type is reqId`);
					testSkill = SkillsList.GetItemByObjectID(reqId);
				}
				if (testSkill != null) {
					Send.Say2(messageType,`I am using skill ${testSkill.Name} : ${testSkill.Id}`,charName,true);
					Send.RequestMagicSkillUse(testSkill.Id);
				} else {
					console.log(`testSkill was null`);
				}
			}
		}
	}
}

(async function main() {
    console.info("=== Vykaax's Chat Commander Script v1.7 Enabled ===");
	/*	console.log("Available Commands:");
	console.log(" ");
	console.log("Function 1: Auto Shots");
	console.log("Party Chat         -> ss <on/off>");
	console.log("   result: all party members running this script enable all available Soulshots and Blessed Spiritshots");
	console.log(" ");
	console.log("Function 2: Item Reporting");
	console.log("Party/Private Chat -> report <id / soulcrystal / exact spelling of item name (case-sensitive)>");
	console.log("   ex 1: #report 57 -> all party members report their Adena (object id 57) count in party chat" );
	console.log("   ex 2: #report soulcrystal -> all party members report the levels of their currently held soul crystals in party chat" );
	console.log("   ex 3: pm->mybot report Wind Stone -> the character named mybot reports it's current count of the item Wind Stone by private message");
	console.log("            *** Note; Private Message report requests require the sender to be added to the approvedRecipients array at the top of the script ");
	console.log("            ***       this may later be substituted for the bot's Names List from settings, but that will need to be implemented first ");*/

    for(;;) {
		// do nothing
		if (Context.IsConnected) {
			if (Me.Level == 1) {
				await sleep(2500)
				Send.ReqBypassToServer("voiced_bot set_var autoTeleport@ 1");
				await sleep(1000);
				Send.ReqBypassToServer("voiced_bot set_var autoVitality@ 1");
				await sleep(1000);
				Send.ReqBypassToServer("voiced_bot set_var autoDrop@ 1");
				await sleep(1000);
				Send.ReqBypassToServer("voiced_bot set_var autoSpoil@ 1");
				await sleep(1000);
				Send.ReqBypassToServer("voiced_menu set_var useAutoLoot@ 1");
				await sleep(1000);
				Send.ReqBypassToServer("voiced_menu set_var useAutoLootHerbs@ 1");
				await sleep(1000);
				
				StartCombat();
			}
		}
		await sleep(60000);
    }
})();