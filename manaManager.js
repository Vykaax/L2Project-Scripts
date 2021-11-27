assert_min_version("2.1.2");
/**
 * Mana Manager Script v1.01
 *
 * @author Vykaax
 * @created 2021-07-02
 * @requires L2Project v2.1.2 or higher
 */
  
var ManaManager = (function () {
  const B2M_ID = 1157;
  const CHECK_INTERVAL = 2000; // 2 seconds. Increase this to check less frequently

  function ManaManager() {
    console.info("=".repeat(54) + "\n== Vykaax's Mana Manager Script 1.00 ==\n" + "=".repeat(54));
	
    checkManaInterval = setInterval(() => {
		//console.info(`${(new Date()).toLocaleTimeString()} : Mana Manager : HP - ${Me.HpPercent} || MP - ${Me.MpPercent} || Ready - ${Me.IsInCombat}`);
		if ((!Me.IsDead) && (Me.IsInCombat) && Context.IsConnected) {
			if ((Me.HpPercent > 90 && Me.MpPercent < 90) || (Me.HpPercent > 45 && Me.MpPercent < 70)) {
				Send.RequestMagicSkillUse(B2M_ID);
				console.warn(`${(new Date()).toLocaleTimeString()} : ManaManager: Casting Body to Mind`);
			}
		}
    }, CHECK_INTERVAL);
  }

  return ManaManager;
})();

var autoBodyToMind = new ManaManager();

