assert_min_version("2.1.2");
/**
 * Auto-Buffer Script L2Toggle edition
 *
 * @author Nick
 * @created 2020-05-28
 * @requires L2Project v2.1.2 or higher
 */
var AutoBuffer = (function () {
  const BUFF_ID = 268; // Use Song of Wind as the test buff
  const BUFF_THRESHOLD = 1800; // buff with <30 minutes remaining
  const CHECK_INTERVAL = 5000; // 5 seconds. Increase this to check less frequently

  // prettier-ignore
  const ID_MAGES = [10,11,12,13,14,25,26,27,28,38,39,40,41,51,52,94,95,96,103,104,110,111,115,116,143,144,145,166,167,168,169,170,174,175,176,177,178,187];
  // prettier-ignore
  const ID_FIGHTERS = [0,1,2,3,18,19,20,21,31,34,44,45,46,47,48,49,50,53,54,55,56,57,88,89,100,107,113,114,117,118,123,124,125,126,127,128,129,131,132,133,134,135,136,140,152,153,154,155,156,157,172,173,182,183,184,185,186,189];
  // prettier-ignore
  const ID_SUPPORTS = [15,16,17,29,30,42,43,97,98,105,112,146,171,179,180,181];
  // prettier-ignore
  const ID_TANKS = [4,5,6,32,33,90,91,99,106,139,148,149,150,151];
  // prettier-ignore
  const ID_DAGGERS = [7,8,22,23,35,36,93,101,108,141,158,159,160,161,165,188];
  // prettier-ignore
  const ID_ARCHERS = [9,24,37,92,102,109,130,142,162,163,164];

  var checkInterval, waitInterval, buffScheme;

  function AutoBuffer() {
    console.info(`AutoBuffer: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
    checkInterval = setInterval(() => {
      this.Check();
    }, CHECK_INTERVAL);
  }

  AutoBuffer.prototype.IsPausedForRebuff = false;

  AutoBuffer.prototype.GetBuffScheme = function () {
    let result = null;
    if (ID_FIGHTERS.includes(Me.ClassId)) {
      result = "15"; // Warrior
    } else if (ID_MAGES.includes(Me.ClassId)) {
      result = "16"; // Mystic
    } else if (ID_SUPPORTS.includes(Me.ClassId)) {
      result = "16"; // Defender
    } else if (ID_TANKS.includes(Me.ClassId)) {
      result = "14";
    } else if (ID_DAGGERS.includes(Me.ClassId)) {
      result = "15";
    } else if (ID_ARCHERS.includes(Me.ClassId)) {
      result = "15";
    }

    return result;
  };

  AutoBuffer.prototype.TestNeedsBuffs = function () {
    let result = false;
    if (BuffsList.ContainsID(BUFF_ID)) {
      let buffTest = null;
      buffTest = BuffsList.GetItemByID(BUFF_ID);
      result = null === buffTest || buffTest.RemainTime < BUFF_THRESHOLD;
    } else {
      result = true;
    }

    return result;
  };

  AutoBuffer.prototype.Check = function () {
    try {
      if (Status.IsConnected && !Me.IsDead) {
        if (!buffScheme) {
          buffScheme = this.GetBuffScheme();
          if (buffScheme === null) {
            throw new Error("AutoBuffer: Cannot find a proper buff scheme.");
          }

          console.info(`AutoBuffer: My buff scheme is ${buffScheme}`);
        }

        if (this.TestNeedsBuffs()) {
          this.PauseAndTryToRebuff();
        }
      }
    } catch (err) {
      console.error("AutoBuffer: Error: " + err);
    }
  };

  AutoBuffer.prototype.PauseAndTryToRebuff = function () {
    if (!buffScheme) {
      return;
    }

    console.info("AutoBuffer: Pause the bot and try to re-buff.");
    clearInterval(checkInterval);
    DisableBot();
    this.IsPausedForRebuff = true;
    var ticks = 0;
    waitInterval = setInterval(() => {
      if (!Me.IsInCombat) {
        Send.ReqBypassToServer("_bbshome"); // community
        Send.ReqBypassToServer("12"); // Buffs tab
        Send.ReqBypassToServer(buffScheme);
        Send.ReqBypassToServer("13"); // Buff me
        this.BackToNormal();
      }
      ticks++;
      if (ticks > 100) {
        console.warn("AutoBuffer: WARNING. I'm in a combat-mode too long.");
        this.BackToNormal();
      }
    }, 300);
  };

  AutoBuffer.prototype.BackToNormal = function () {
    console.info("AutoBuffer: Continue botting.");
    clearInterval(waitInterval);
    checkInterval = setInterval(() => {
      this.Check();
    }, CHECK_INTERVAL);
    EnableBot();
    this.IsPausedForRebuff = false;
  };

  return AutoBuffer;
})();

var autoBuffer = new AutoBuffer();

function OnAttack(attackerObjId, objId) {
  if (autoBuffer.IsPausedForRebuff && objId === Me.objId) {
    console.warn("AutoBuffer: WARNING. I've being attacked while I am trying to re-buff !!!");
    autoBuffer.BackToNormal();
  }
}
