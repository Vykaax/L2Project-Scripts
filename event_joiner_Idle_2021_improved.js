async function OnSay(charName, fullChatString, messageType) {
	let chatSplit = fullChatString.split(" ");
	if (fullChatString.includes("Registration to")) {
		console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : An event registration has started`);
		switch (fullChatString) {
			case "Last Hero started!":
				console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : Last Hero Event Found`);
				Send.ReqBypassToServer("_bbseventRegister_1");
				pvpMode = true;
				break;
			case "Team VS Team started!":
				console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : Team vs Team Event Found`);
				Send.ReqBypassToServer("_bbseventRegister_2");
				pvpMode = true;
				break;
			case "Treasure Hunt started!":
				console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : Treasure Hunt Event Found`);
				Send.ReqBypassToServer("_bbseventRegister_5");
				pvpMode = true;
				break;
			case "Monster Attack started!":
				console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : Monster Attack Event Found`);
				Send.ReqBypassToServer("_bbseventRegister_10");
				pvpMode = true;
				break;
			default:
				console.log(`${(new Date()).toLocaleTimeString()} : Event Joiner : An unknown event is starting. Attempting to register for any event`);
				//let	eventNum = 1;
				for (i = 0; i < 14; i++) {
					Send.ReqBypassToServer("_bbseventRegister_"+i);
					await sleep(2000);
				}
				pvpMode = true;
		}
		await sleep(1500);
	}
}

async function OnSystemMessage(id) {
	if (id == 144 && CurrentZone.ToString() == "PVPZONE") {
		if (Target != null) {
			tempName = Target.Name;
			if (tempName != "" && !blacklistNames.includes(tempName)) {
				console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Blacklisting ${tempName}`);
				blacklistNames.push(tempName);
                eventTarget = null;
			}
		}
	}
}

async function OnDie(deadObjId) {
	if (deadObjId == Me.objId) {
		//StopCombat();
		console.error(`${(new Date()).toLocaleTimeString()} : Event Joiner : I died!!!`);
		if (CurrentZone.ToString() == "GENERALZONE" || CurrentZone.ToString() == "ALTEREDZONE" ) {
			//await sleep(1500);
			Send.SendHex("7D00000000");// return to town
		}
	} else if (deadObjId == fightOffObjId) { 
		fightOffObjId = null;
	} else {
		deadCrt = CreaturesList.GetItemByObjectID(deadObjId);
		if (deadCrt != null) {
			if (CreaturesList.GetItemByObjectID(deadObjId).crtType.ToString() == "Char") {
				console.error(`${(new Date()).toLocaleTimeString()} : Event Joiner : ${CreaturesList.GetItemByObjectID(deadObjId).Name} died!`);
			}
		}
	}
}

function OnPointsStarted() {
	//StopCombat(); // Tried this here but it doesn't help
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Running points towards combat zone`);
	isRunning = true;
	//isFighting = false;
	needToRun = false;
	DisableBot();
}

function OnPointsEnded() {
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Reached end of points. Starting combat!`);
	StartCombat(); // Start combat when points run finishes
	isRunning = false;
	//isFighting = true;
	needToRun = false;
	EnableBot();
}

function OnPointsStopped() {
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Points run was interrupted!`);
	isRunning = false; // Don't handle anything here yet
	//isFighting = false;
	needToRun = false;
	EnableBot();
}

function OnAttack(attackerObjId, objId) {
	if ( CreaturesList.GetItemByObjectID(attackerObjId) != null && objId == Me.objId) {
		if ((CurrentZone.ToString() == "PVPZONE" || CurrentZone.ToString() == "ALTEREDZONE" )&& CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Char" && objId === Me.objId) {
			eventTarget = CreaturesList.GetItemByObjectID(attackerObjId);
			console.warn(`${(new Date()).toLocaleTimeString()} : Event Joiner : Fighting back against ${CreaturesList.GetItemByObjectID(attackerObjId).Name}`);
			Send.Action(attackerObjId);
			Send.AttackRequest(attackerObjId);
		} else if (fightOffObjId == null && !isRunning && (CurrentZone.ToString() == "GENERALZONE" || CurrentZone.ToString() == "ALTEREDZONE")&& CreaturesList.GetItemByObjectID(attackerObjId).crtType.ToString() == "Mob" && !Context.IsInCombat()) {
			Send.Action(attackerObjId);
			Send.AttackRequest(attackerObjId);
			fightOffObjId = attackerObjId;
		}
	} else if (attackerObjId == Me.objId && CreaturesList.GetItemByObjectID(objId).Name == "Treasure Chest") {
		Send.UseItem(21746);
	}
}

var isRunning = false;
var isFighting = false;
var needToRun = false;
var blacklistNames = [];
var pvpMode = true;
var isRegistered = false;
var inEvent = false;
var eventTarget = null;
var fightOffObjId = null;

(async function main() {
    console.log("Auto Event Joiner Script");
	//let validTarget = null;
    for(;;) {
		if (Context.IsConnected) {
			try {
				//console.log(`The current zone ID is: ${L2Zone.Type}`);
				if (!Me.IsDead) { // && pvpMode) {// && L2Zone.Type != 12) {
					//console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Checking Location`);
					
					if (CurrentZone.ToString() == "PVPZONE" || (CurrentZone.ToString() == "ALTEREDZONE" && inEvent)) {// || CurrentZone.ToString() == "ALTEREDZONE") {// || CurrentZone.ToString() == "GENERALZONE") {
						inEvent = true;
						console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : I am in an event zone`);
											
						if (eventTarget == null || eventTarget.IsDead) {
							let nearestDistance = 99999;
							let nearestId;
							eventTarget = null;
							if (CreaturesList.Count > 0) {
								console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Looking for Target`);
								for (i = 0; i < CreaturesList.Count; i++) {
									let tempTargetId = CreaturesList[i].objId;
									let tempCreature = CreaturesList.GetItemByObjectID(tempTargetId);
									if (tempCreature != null) {
										tempCreature.CalculateDistance();
										if (tempCreature.crtType.ToString() == "Char" && !(tempCreature.IsDead)) {
											console.info(`Target ${i} : ${tempCreature.Name} : Alive (${!tempCreature.IsDead})`);
											if (eventTarget == null || !blacklistNames.includes(tempCreature.Name)) {
												console.info(`This Target: ${tempCreature.Distance}, Current Target: ${nearestDistance}`);
												if (tempCreature.Distance < nearestDistance) {
													nearestId = CreaturesList.GetItemByObjectID(tempTargetId).objId;
													console.info(`Setting near id: ${tempCreature.objId}`);
												}
											} else if (blacklistNames.includes(tempCreature.Name)){
												console.info(`${tempCreature.Name} was found on the blacklist`);
											}
										}
									}
								}
							}
							console.info(`Done looking for target, near ID ${nearestId}`);
							if (nearestId != null) {
								eventTarget = CreaturesList.GetItemByObjectID(nearestId);
								Send.Action(eventTarget.objId);
								console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Selected Target (${eventTarget.Name})`);
							}
						}
						await sleep(300);
						
						if (eventTarget != null) {
							console.info(`My target is ${eventTarget.Name}`)
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Attacking target ${CreaturesList.GetItemByObjectID(eventTarget.objId).Name}`);
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Attacking target ${eventTarget.Name}`);
							//eventTarget = CreaturesList.GetItemByObjectID(validTarget);
							Send.Action(eventTarget.objId);
							await sleep(250);
							Send.MoveTo(eventTarget.X,eventTarget.Y);
							await sleep(250);
							eventTarget.CalculateDistance();
							if (eventTarget.Distance > 300 && eventTarget.Distance < 900) {
								Send.RequestMagicSkillUse(793);
							} else if (eventTarget.Distance < 280 && (eventTarget.Name != "Event1") && (eventTarget.Name != "Event2")) {
								Send.RequestMagicSkillUse(485);
							}
							Send.AttackRequest(eventTarget.objId);
						} else {
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : No Target`);
							findFlag = CreaturesList.GetItemByName("Red Flag");
							
							if ( findFlag == null ) {
								let moveDist = 400;
								// no target, just dance to keep active
								console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : No players found, dancing to stay active`);
								//Send.MoveTo(Math.floor(Me.X-700),Math.floor(Me.Y));
								Send.MoveTo(Math.floor(Me.X+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))),Math.floor(Me.Y+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))));
								await sleep(2500);
								Send.MoveTo(Math.floor(Me.X+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))),Math.floor(Me.Y+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))));
								//Send.MoveTo(Math.floor(Me.X+700),Math.floor(Me.Y));
								await sleep(2500);
							} else {
								console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : No players found, moving to flag`);
								Send.Action(findFlag.objId);
								await sleep(250);
								Send.Action(findFlag.objId);
								await sleep(250);
								Send.Action(findFlag.objId);
							}
						}
						
						
						//red flag 272166396
						
					} else if (CurrentZone.ToString() == "PEACEZONE") {
						//console.info("123");
						StopCombat();
						
						blacklistNames = [];
						eventTarget = null;
						pvpMode = false;
						inEvent = false;
						isRunning = false;
						needToRun = false;
						fightOffObjId = null;
						
						if (Me.HpPercent < 80) {
							await sleep(2500);
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : Healing from community window`);
							Send.ReqBypassToServer("_bbsbufferbypass_heal 0 0 0");
						}
						
						
						
							
						if ((new Date().getMinutes() >= 55 || new Date().getMinutes() <= 7) && (new Date().getHours() >= 9 && new Date().getHours() <= 17)) {
							EnableBot();
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : I am waiting for the event to start`);
                            inEvent = true;
							// just keep waiting for the event to start
							await sleep(15000);
						} else if (Me.HpPercent >= 75) {
                            inEvent = false;
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : I am preparing to return to my farming area`);
							//console.info("456");
							EnableBot();
							await sleep(15000);
							needToRun = true;
							RunCommand("/runmacro FARM");
							await sleep(1500);
							
							
							//StartCombat();
						}
						//moveToFarmZone();
						
					} else if (CurrentZone.ToString() == "GENERALZONE" || (CurrentZone.ToString() == "ALTEREDZONE" && !inEvent)) {
						inEvent = false;
						if (needToRun) {
							await sleep (1500);
							isRunning = true;
							RunCommand("/runmacro RUN");
						}
						//console.info(`Current Zone: ${CurrentZone.ToString()}`);
						if (Target == null && fightOffObjId == null && (new Date().getMinutes() >= 55 || new Date().getMinutes() < 7) && (new Date().getHours() >= 9 && new Date().getHours() <= 17)) {
							console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : I need to return to town to prepare for the event`);
							// return to town
							StopCombat();
							RunCommand("/runmacro HOME");
						} else if (!Context.IsInCombat()) {
							//StartCombat();
						}
					} else {
						console.info(`${(new Date()).toLocaleTimeString()} : Event Joiner : I am in an unknown area`);
					}

				} else {
					await sleep(1000);
				}
				if (Me.IsDead) {// && L2Zone.Type != 12) {
					Send.Say2(0,"a","",true);
				}
				/*if (!Me.IsDead && L2Zone.Type == 12) {
					console.log("I am waiting for an event to start");
				}*/
				} catch (e) {
					console.error(e);
				}
		}
		await sleep(1000);
    }
})();