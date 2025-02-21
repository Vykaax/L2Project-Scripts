assert_min_version("2.1.2");
/**
 * Recharger Script v1.02
 *
 * @author Vykaax
 * @created 2021-07-02
 * @requires L2Project v2.1.2 or higher
 */
  
var AutoRecharger = (function () {
  const ID_TARGETS = [4,5,6,32,33,90,91,99,106,139,148,149,150,151,117];
  const RECHARGE_ID = 1013;
  const CHECK_INTERVAL = 2500; // 2 seconds. Increase this to check less frequently

  function AutoRecharger() {
    console.info("=".repeat(54) + "\n== Vykaax's Recharger Script 1.03 ==\n" + "=".repeat(54));
    console.info(`AutoRecharger: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
	
    checkManaInterval = setInterval(() => {
		for (i = 0; i < PartyList.Count; i++) {
			if (ID_TARGETS.includes(PartyList[i].ClassId) && Me.MpPercent > 50 && PartyList[i].MpPercent < 50) {
				Send.Action(PartyList[i].objId);
				Send.Action(PartyList[i].objId);
				Send.RequestMagicSkillUse(RECHARGE_ID);
				console.warn(`AutoRecharger: Recharging ${PartyList[i].Name}`);
			}				
		}
    }, CHECK_INTERVAL);
  }

  return AutoRecharger;
})();

var autoRecharge = new AutoRecharger();

