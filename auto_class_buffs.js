assert_min_version("2.2.0");
/**
 * Auto-Buffer Script for Classes v1.8
 *
 * @author Vykaax
 * @author Nick
 * @created 2020-05-25
 * @requires L2Project v2.2.0 or higher
 * 2021-06-25: Replaced Status with Context (Vykaax)
 * 2021-08-29: Reworked script use not use AutoBuffer class and intervals
 */

var BUFF_ID = 268; // Use Song of Wind as the test buff
var BUFF_THRESHOLD = 1800; // buff with <30 minutes remaining
var CHECK_INTERVAL = 5000; // 5 seconds. Increase this to check less frequently

var ID_MAGES = [10,11,12,13,14,25,26,27,28,38,39,40,41,51,52,94,95,96,103,104,110,111,115,116,143,144,145,166,167,168,169,170,174,175,176,177,178,187];
var ID_FIGHTERS = [0,1,2,3,18,19,20,21,31,34,44,45,46,47,48,49,50,53,54,55,56,57,88,89,100,107,113,114,117,118,123,124,125,126,127,128,129,131,132,133,134,135,136,140,152,153,154,155,156,157,172,173,182,183,184,185,186,189];
var ID_SUPPORTS = [15,16,17,29,30,42,43,97,98,105,112,146,171,179,180,181];
var ID_TANKS = [4,5,6,32,33,90,91,99,106,139,148,149,150,151];
var ID_DAGGERS = [7,8,22,23,35,36,93,101,108,141,158,159,160,161,165,188];
var ID_ARCHERS = [9,24,37,92,102,109,130,142,162,163,164];

var tryingToBuff = false;
var fightingAttacker = false;
var lastAttackerObjId = null;

var sleepTime = 5000;

function GetBuffScheme() {
    let result = null;
    if (ID_FIGHTERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet figher 0 0";
    } else if (ID_MAGES.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet mage 0 0";
    } else if (ID_SUPPORTS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet support 0 0";
    } else if (ID_TANKS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet tank 0 0";
    } else if (ID_DAGGERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet dagger 0 0";
    } else if (ID_ARCHERS.includes(Me.ClassId)) {
      result = "_bbsbufferbypass_giveBuffSet archer 0 0";
    }
    console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : My buff scheme is ${result}`);
    return result;
}

function TestNeedsBuffs() {
    let result = false;
    if (BuffsList.ContainsID(BUFF_ID)) {
      let buffTest = null;
      buffTest = BuffsList.GetItemByID(BUFF_ID);
      result = null === buffTest || buffTest.RemainTime < BUFF_THRESHOLD;
    } else {
      result = true;
    }
    return result;
}

function GetBuffs(buffBypass) {
    if (!Me.IsInCombat && !Me.IsDead) {
        Send.ReqBypassToServer(buffBypass);
    }
}

function OnAttack(attackerObjId, objId) {
  if (!Context.IsEnabled() && tryingToBuff && objId === Me.objId) {
    console.warn(`${(new Date()).toLocaleTimeString()} : AutoBuffer : WARNING. I'm being attacked while I am trying to re-buff !!!`);
    lastAttackerObjId = attackerObjId;
    fightingAttacker = true;
    EnableBot();
  }
}

function OnDie(deadObjId) {
    if (deadObjId == lastAttackerObjId) {
        console.warn(`${(new Date()).toLocaleTimeString()} : AutoBuffer : My attacker died`);
        lastAttackerObjId = null;
        fightingAttacker = false;
    } else if (deadObjId === Me.objId) {
        SetAllClear();
        sleepTime = 500;
    }
}

function SetAllClear() {
   fightingAttacker = false;
   lastattackerObjId = null;
   tryingToBuff = false;
}

(async function main() {
    console.info("=".repeat(54) + "\n== Vykaax's & Nick AutoBuff Script for Classes v1.8 ==\n" + "=".repeat(54));
    await sleep(1000);
       
    console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
    var myScheme = GetBuffScheme();
    
    for (;;) {
        if (Context.IsConnected && !Me.IsDead) {
            if (TestNeedsBuffs()) {
                if (!fightingAttacker) {
                    //console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : I need to buff`);
                    if (!tryingToBuff) {
                       console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : I need to buff!`);
                    }
                    DisableBot();
                    tryingToBuff = true;
                    sleepTime = 500;
                    GetBuffs(myScheme);
                    await sleep(500);
                    if (!TestNeedsBuffs()) {
                       console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : Finishing receiving buffs`); 
                       SetAllClear();
                    }
                }                
            } else {
                //console.info(`${(new Date()).toLocaleTimeString()} : AutoBuffer : I do not need to buff`);
                if (!Context.IsEnabled()) {
                    EnableBot();
                }
                SetAllClear();
                sleepTime = 5000;
            }
        }
        await sleep (sleepTime);
    }     
})();