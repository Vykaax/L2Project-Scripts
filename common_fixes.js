// Run this script on party leaders to fix treasure chest handling (make sure to buy Maestro Keys from the grocer)
// and on supports like Warcryer, Overlord, and Prophet to get them to auto attack

var verboseLog = 1; // 0 nothing, 1 rare events, 2 testing, 3 lots of testing

// SupportAssist
var assistTargetID;
var assistEnable = false;
const assistEnableClasses = ["Warcryer","Doomcryer","Overlord","Dominator","Prophet","Hierophant"];
var noSpam = 1;

// MoveAssist
var movingToLeader = false;

// BlockAssist
var blockCount = 0;

async function OnTargetSelected(objId, targetObjId) {
    if (assistEnable == true && objId != Me.objId) {
        if (objId == FollowChar.objId && CreaturesList.GetItemByObjectID(targetObjId).crtType.ToString() == "Mob") {
            if (verboseLog >= 2) { console.warn(`${(new Date()).toLocaleTimeString()} : VCFS : Locking target ${CreaturesList.GetItemByObjectID(targetObjId).Name} (${targetObjId})`); }
            assistTargetID = targetObjId;
        }
    }
}

async function OnDie(objId) {
    if (objId == assistTargetID && assistEnable) {
        assistTargetID = null;
        noSpam = 1;
        if (verboseLog >= 2) { console.warn(`${(new Date()).toLocaleTimeString()} : VCFS : Target cancelled`); }
    }
}

async function OnRevive(revive_objId) {
    if (revive_objId == Me.objId && FollowChar != null) {
        MoveToLeader(); // on revive move to the leader first before enabling the bot so WC/BD/SWS don't buff solo in town or when too far away
    }
}

async function OnSystemMessage(id) {
       if (id == 181) {
            blockCount++;
			if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Target is blocked, ${blockCount} tries`); }
			if (blockCount >= 4) {
                if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Moving to find target`); }
				Send.MoveTo(Math.floor(Me.X+((Math.floor(Math.random()*250)+50)*(Math.round(Math.random()) ? 1: -1))),Math.floor(Me.Y+((Math.floor(Math.random()*250)+50)*(Math.round(Math.random()) ? 1: -1))));
				blockCount = 0;
			}
       }
}

async function MoveToLeader() {
    if (!IsPartyLeader && FollowChar.objId != Me.objId) {
        FollowChar.CalculateDistance();
        try {
            while (FollowChar.Distance >= 450) {
                movingToLeader = true;
                if (IsEnabled) {
                    if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Bot Disabled (Out of range of leader - ${FollowChar.Distance})`); }
                    DisableBot();
                }
                Send.MoveTo(FollowChar.X, FollowChar.Y);
                if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
                FollowChar.CalculateDistance();
                if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Moving to leader at ${FollowChar.X},${FollowChar.Y} - distance ${FollowChar.Distance}`); }
            }
            movingToLeader = false;
            EnableBot();
            if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Bot Enabled (In range of leader) - ${FollowChar.Distance}`); }
        } catch(errMoveLeader) {
            console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Failed to move, enabling bot`);
            EnableBot();
            movingToLeader = false;  
        }
    }
}

function TryToAssist() {
    try {
        if (assistTargetID != null && CreaturesList.GetItemByObjectID(assistTargetID) != null && CurrentZone.ToString() != "PEACEZONE") {
            if (!CreaturesList.GetItemByObjectID(assistTargetID).IsDead && CreaturesList.GetItemByObjectID(assistTargetID).HpPercent <= 95) {
                if (verboseLog >= 2) { console.log(`${(new Date()).toLocaleTimeString()} : VCFS : Assisting (${noSpam}) against ${CreaturesList.GetItemByObjectID(assistTargetID).Name}`); }
                try { Send.Action(assistTargetID); } catch (errAction) { console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Select 1 failed with ${errAction}`); }
                try { Send.Action(assistTargetID); } catch (errAction) { console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Select 2 failed with ${errAction}`); }
                //try { Attack(assistTargetID); } catch (errAttack) {console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Attack failed with ${errAttack}`); }
            }
        }
    } catch (err) {
        console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Assist failed with error ${err}`);
    } finally {
        noSpam++;
    }
}

function OpenTreasureChest() {
    if (Target != null && Target.Name == "Treasure Chest") {
        if (verboseLog >= 1) { console.warn(`${(new Date()).toLocaleTimeString()} : VCFS : Treasure Chest engaged`); }
        try {
            if (Inventory.GetItemByName("Maestro's Key") != null) {
                Send.UseItem(Inventory.GetItemByName("Maestro's Key").objId);
                if (verboseLog >= 1) { console.info(`${(new Date()).toLocaleTimeString()} : VCFS : Trying to open chest`); }
            }
            if (verboseLog >= 1) { console.log(`${(new Date()).toLocaleTimeString()} : VCFS : Treasure Chest unlocked (${Inventory.GetItemByName("Maestro's Key").Count} keys remaining)`); }
        } catch(tcError) {
            console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Treasure Chest unlock loop failed. Aborting and trying again)`);
            console.error(`${(new Date()).toLocaleTimeString()} : VCFS : ${tcError}`);
        }
    }
}

(async function main() {
    console.info("=== Vykaax's Common Fixes Script Enabled v0.9 ===");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    while (!Context.IsConnected) {
          if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}  
    }
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    EnableBot();
    if (assistEnableClasses.includes(Me.ClassName)) {
        //assistEnable = true;
    }
    
    console.warn(`${(new Date()).toLocaleTimeString()} : VCFS : My class is ${Me.ClassName} (AssistEnabled = ${assistEnable})`);
    
    
    for(;;) {
        try {
            if (Context.IsConnected && !Me.IsDead) {
                if (movingToLeader == false) {
                    OpenTreasureChest();
                    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(500);} else {await sleep(500);}
                    if (assistEnable && IsEnabled && !IsInCombat && noSpam <= 5) { TryToAssist(); }// else { noSpam = 0; }
                    //try { MoveToLeader(); } catch(moveError) {}
                }
            }
        } catch (err) {
            console.error(`${(new Date()).toLocaleTimeString()} : VCFS : Error in main loop... ${err}`);
        }
        if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    }
    console.warn(`${(new Date()).toLocaleTimeString()} : : The script ended`);
})();