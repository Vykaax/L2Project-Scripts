function OnDie(deadObjId) {
	if (deadObjId == Me.objId) {
		StopCombat();
		console.error(`${(new Date()).toLocaleTimeString()} : Farm Manager : I DIED!!!`);
		Send.SendHex("7D00000000");// return to town
	}
}

function OnPointsStarted() {
	StopCombat(); // Tried this here but it doesn't help
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Running points towards combat zone`);
	isRunning = true;
	isFighting = false;
	needToRun = false;
	DisableBot();
}

function OnPointsEnded() {
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Reached end of points. Starting combat!`);
	StartCombat(); // Start combat when points run finishes
	isRunning = false;
	isFighting = true;
	needToRun = false;
	EnableBot();
}

function OnPointsStopped() {
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Points run was interrupted!`);
	isRunning = false; // Don't handle anything here yet
	isFighting = false;
	needToRun = false;
	EnableBot();
}

// Some temporary flags to find out what we are actually doing
var isRunning = false;
var isFighting = false;
var needToRun = false;

(async function main() {
	if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
	
	console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Script Started v1.02`);
	for (;;) {
		if (Context.IsConnected && !Me.IsDead) {
			if (CurrentZone.ToString() == "PEACEZONE") {
				StopCombat();
				isFighting = false;
				isRunning = false;
				needToRun = false;
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(2000);} else {await sleep(2000);}
				if (Me.HpPercent < 90 || Me.MpPercent < 50) {
					Send.ReqBypassToServer("_bbsbufferbypass_heal 0 0 0");
					if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
				} else {
					console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Teleporting to farm zone`);
					RunCommand("/runmacro FARM"); // this macro should have a teleport command to get to the farming area from which the points will run
					needToRun = true;
					if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
				}
				
			} else if (CurrentZone.ToString() == "GENERALZONE" && !isRunning && !isFighting && needToRun) {
				console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : Entered farm area`);
				//needToRun = false;
				//StopCombat();
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
				//RunCommand("/startpoints");
				RunCommand("/runmacro RUN");
				
				if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
			} else {
				/*if (isRunning) {
					console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : I'm running`);
				} else if (Me.IsInCombat || isFighting) {
					console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : I'm fighting`);
				} else {
					console.info(`${(new Date()).toLocaleTimeString()} : Farm Manager : I'm doing nothing... or something else`);
				}*/
			}
	
		}
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(5000);} else {await sleep(5000);}
	}
})();