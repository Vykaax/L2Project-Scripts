var startingXP = 0;
var startingAdena = 0;
var startingTime = 0;

function startTracking() {
    startingXP = Me.Exp;
    startingAdena = Inventory.GetItemByName('Adena').Count;
    startingTime = new Date();
}

function resetTracking() {
    startTracking();
}

async function OnLogin() {
    startTracking();
}

function reportTracking() {
    let deltaXP = Me.Exp - startingXP;
    let deltaAdena = Inventory.GetItemByName('Adena').Count - startingAdena;
    let elapsedTime = new Date() - startingTime;
    elapsedHours = elapsedTime/1000/60/60;
    
    console.log(`${(new Date()).toLocaleTimeString()} : VZA : Time         : ${elapsedTime}`);
    console.log(`${(new Date()).toLocaleTimeString()} : VZA : XP Gained    : ${deltaXP} (${Math.round(deltaXP/elapsedHours)} per hour)`);
    console.log(`${(new Date()).toLocaleTimeString()} : VZA : Adena Gained : ${deltaAdena} (${Math.round(deltaAdena/elapsedHours)} per hour)`);
}

function xpreport() {
    reportTracking();
}

function xpreset() {
	startTracking();
}



(async function main() {
    console.info("=".repeat(54) + "\n== Vykaax's XP & Adena Analyzer 1.00 ==\n" + "=".repeat(54));
    console.warn("Commands (in the script's JS console):");
    console.warn("    startTracking()");
    console.warn("    resetTracking()");
    console.warn("    reportTracking()");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    if (Context.IsConnected) {
        startTracking();
    }
        
    for(;;) {
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
        if (Context.IsConnected) {
            reportTracking();
            if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(6000000);} else {await sleep(6000000);}
        }
    }
    
})();