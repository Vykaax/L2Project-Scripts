assert_min_version("2.2.0");
if(!this['sleep']) Sleep = sleep;
/**
 * Chat Commander Script v1.8
 *
 * @author Vykaax
 * @created 2020-05-25
 * @requires L2Project v2.2.0 or higher
 * 2021-07-26: Replaced Status with Context (Vykaax)
 */
 
const ssList = [1835,1463,1464,1465,1466,1467,3947,3948,3949,3950,3951,3952];
// This is the list of characters allowed to make requests via chat channels. Names not in the list will be ignored
const approvedRecipients = [`Vykaax`,`RedLeader`,`GreenLeader`,`MakeStuff`,`BlueLeader`,`PurpleLeader`,`OrangeLeader`,`YellowLeader`,`CrimsonLeader`,`Furiosa`];

// This is the list of characters that are party/attack leaders. Putting their name here will cause them to auto start combat when the bot logs in
const leaderNames = [`RedLeader`,`GreenLeader`,`FindStuff`,`BlueLeader`,`OrangeLeader`,`YellowLeader`,`CrimsonLeader`,`Furiosa`];

 
function UseShots(newShotState) {
    console.log(`Setting shot state to ${newShotState}`);
    for (let i = 0; i < ssList.length; i++) {
        Send.RequestAutoSoulShot(ssList[i],newShotState);
    }
}

async function OnEnter(objId) {
    if (objId == Me.objId) {
        await sleep(2000);
        console.warn(`${(new Date()).toLocaleTimeString()} : Logged In`);
        UseShots((Options.UseShots ? 1 : 0));
        // Make the character take a short step in a random direction to break the 'passive' login protection that prevents party invites
        Send.MoveBackwardToLocation((Me.X)+Math.round((Math.random()-0.5)*100),Me.Y+Math.round((Math.random()-0.5)*100),Me.Z);
        console.warn(`${(new Date()).toLocaleTimeString()} : Moved to remove protection`);
        // Check if the character is a party leader, if yes and in a combat area the bot will StartCombat so that it doesn't just stand there forever
        if (leaderNames.includes(Me.Name) && CurrentZone.ToString() == "GENERALZONE") {
            console.warn(`${(new Date()).toLocaleTimeString()} : Attack Leader in GENERALZONE- TRUE`);
            StopCombat();
            await sleep(3000);
            StartCombat();
        } else {
            console.warn(`${(new Date()).toLocaleTimeString()} : Attack Leader in GENERALZONE- FALSE`);
            StopCombat();
        }
    }
}

async function OnSay(charName, fullChatString, messageType) {
	// Only respond to private message report requests from the following list of approved character names
	if (Context.IsConnected) {
		//let fullChatString = messages.join("");
		let chatSplit = fullChatString.split(" ");
		if ((messageType == 4 || messageType == 3) && chatSplit[0] == "ss") {
			// Use the party chat command "ss on" or "ss off" to enable or disable any available soulshots or blessed spiritshots
			let ssState = 99;
			if (chatSplit[1] == "on") {
				ssState = 1;
                Options.UseShots = true;
				Send.Say2(messageType, "Enabling SS","",true);
			} else if (chatSplit[1] == "off") {
				ssState = 0;
                Options.UseShots = false;
				Send.Say2(messageType, "Disabling SS","",true);
			}
			
			if ( ssState == 0 || ssState == 1) {
				UseShots(ssState);
			}
		} else if ((messageType == 4 || messageType == 9 || messageType == 3 || (messageType == 2 && approvedRecipients.includes(charName))) && chatSplit[0] == "report") {
			let itemList;
			let itemName;
			let statName;
            let deathBuff;
            let foundItems = [];
            let itemCount = 0;
			let checkByName = false;
			
			if (chatSplit[1] == "soulcrystal" || chatSplit[1] == "sc") {
				// This is the list of IDs all soul crystals level 10+
				itemList = [4639,4650,4661,5577,5578,5579,5580,5581,5582,5908,5911,5914,9570,9571,9572,10160,10161,10162,10480,10481,10482,13071,13072,13073,15541,15542,15543,15826,15827,15828];
			} else if (chatSplit[1] == "your_search") { // build your own custom item list for a single word search term here
				// add the item IDs you want to report on into the itemList array below like how it is done for soul crystals above
				itemList = [];
			} else if ( Number.isInteger(parseInt(chatSplit[1])) ){
				itemList = parseInt(chatSplit[1]);
			} else if (chatSplit[1] == "deaths") {
                deathBuff = BuffsList.GetItemByName("Death Penalty");
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
			} else if (deathBuff != null) {
                console.warn("Death Penalty was requested, and found");
                Send.Say2(messageType,`I have ${deathBuff.Name} (${deathBuff.Level})`,charName,true);
            } else if (checkByName == false) {
				if (Array.isArray(itemList)) {
					let i;
					for (i = 0; i < itemList.length; i++) {
                        //foundItems = 0;
                        //Inventory.forEach((item) => {if (itemList.includes(item.Id)) {foundItems++} });
						var testItem = Inventory.GetItemByID(itemList[i]);
						if (testItem != null) {
							Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
						}
					}
				} else {
                    //Inventory.forEach((item) => {if (item.Name == itemName) {foundItems++} });
					var testItem = Inventory.GetItemByID(itemList);
					if (testItem != null) {
						Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
					}
				}
			
            } else {
                Inventory.forEach((item) => {if (item.Name == itemName) {foundItems++} });
                if (foundItems == 1) {
                    let testItem = Inventory.GetItemByName(itemName);
                    if (testItem != null) {
                        Send.Say2(messageType,`I have ${testItem.Count} x ${testItem.Name}`,charName,true);
                    }
                } else if (foundItems > 1) {
                    Send.Say2(messageType,`I have ${foundItems} x ${itemName}`,charName,true);
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
		} else if (messageType == 4 && chatSplit[0] == "aoe") {
			StopCombat();
			let moveTarget = CreaturesList.GetItemByName("charName");
			let ticks = 0;
			do {
				Send.MoveBackwardsToLocation(moveTarget.X,moveTarget.Y,moveTarget.Z)
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
			} while (!Me.IsMoving || ticks > 5)
			StartCombat();
		}
	}
}

function ReverseHex(str) {
    console.log(`Entered ReverseHex with param ${str}`);
    try {
        return str.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    } catch {
        console.log(`${err.message}`);
    }
}

(async function main() {
    console.info("=== Vykaax's Chat Commander Script v2.0 Enabled ===");
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
		}
		await Sleep(60000);
    }
})();