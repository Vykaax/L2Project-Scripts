async function OnSystemMessage(id) {
       if (id == 1066) {
            EnableBot();
       }  
}

var locked_item;
var getLoot = false;

(async function main() {
	console.info("=== Vykaax's Herb Grabber Script Enabled v1.0 ===");
	for (;;) {
		if (DropList.Count > 0 && !Me.IsDead) {
			for (let i = 0; i < DropList.Count; i++) {

                locked_item = DropList[i];
                try {
                    getLoot = false;
                    //console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Found item in range ${locked_item.Name}`);
                    if (Me.HpPercent <= 90 && locked_item.Name.includes("Herb of Life")) {
                        //console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Confirmed for pickup ${locked_item.Name}`);
                        getLoot = true;
                    } else if (Me.MpPercent <= 90 && locked_item.Name.includes("Herb of Mana")) {
                        //console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Confirmed for pickup ${locked_item.Name}`);
                        getLoot = true;
                    } else if ((Me.ClassType.ToString() == "FIGHTER" || Me.ClassType.ToString() == "TANK")&& locked_item.Name.includes("Herb of Vampiric Rage")) {
                        //console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Confirmed for pickup ${locked_item.Name}`);
                        getLoot = true;
                    }
                    
                    if (getLoot == true && Context.IsAttacking() == false) {
                        locked_item.CalculateDistance();
                        if (locked_item.Distance <= 250 && Me.CountTargetsInRange(250) < 2) {
                            DisableBot();
                            Send.Action(locked_item.objId);
                            console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Picking up ${locked_item.Name} (${locked_item.Distance})`);
                            await sleep (1000);
                            EnableBot();  
                        } else {
                            //console.info(`${(new Date()).toLocaleTimeString()} : Herb Grabber : ${locked_item.Name} was not in range (${locked_item.Distance})`);
                        }
                    }
                    await sleep(500);
                } catch {
                    console.warn(`${(new Date()).toLocaleTimeString()} : Herb Grabber : Herb pickup failed. Maybe it was gone?`);
                    EnableBot();
                }
			}
		}
		await sleep(1000);
	}
})();