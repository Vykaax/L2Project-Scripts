const beastList = ["Kookaburra","Cougar","Grendel","Buffalo"];
var verboseLog = 1;
const growthLevel = "Adult"; // use "Young", "Adult", or "Full Grown"

function UseSpice() {
    if (Target != null && !(Target.Name).includes(growthLevel) && Target.crtType.ToString() == "Mob") {
        if (verboseLog >= 1) { console.warn(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Beast engaged`); }
        try {
            if (Inventory.GetItemByName("Golden Spice") != null) {
                Send.UseItem(Inventory.GetItemByID(15474).objId);
                if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Using spice`); }
            }
            if (verboseLog >= 1) { console.log(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Spice used (${Inventory.GetItemByName("Golden Spice").Count} spices remaining)`); }
        } catch(tcError) {
            console.error(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Spice loop failed. Aborting and trying again)`);
            console.error(`${(new Date()).toLocaleTimeString()} : BeastFarmer : ${tcError}`);
        }
    }
}

(async function main() {
    console.info("=== Vykaax's Beast Farmer Script v1.0 ===");
    await sleep (1500);
    while (!Context.IsConnected) {
          await sleep (500);  
    }
    await sleep (1500);

    for(;;) {
        try {
            if (Context.IsConnected && !Me.IsDead && IsEnabled) {
                if (Target != null) {
                    UseSpice();
                    await sleep (200);
                }
            }
        } catch (err) {
            console.error(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Error in main loop... ${err}`);
        }
        await sleep(1500);
        try {
            if (Inventory.GetItemByName("Golden Spice Crate") != null) {
                if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : BeastFarmer : Opening spice crate`); }
                Send.UseItem(Inventory.GetItemByID(15482).objId);
            }
        } catch(spiceCrateError) {
            
        }
    }
    console.warn(`${(new Date()).toLocaleTimeString()} : BeastFarmer : The script ended`);
})();