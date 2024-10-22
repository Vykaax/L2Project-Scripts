assert_min_version("2.1.2");
/**
 * Attack Manager Script v1.00
 *
 * @author Vykaax
 * @created 2021-02-09
 * @requires L2Project v2.1.2 or higher
 */
var AttackManager = (function () {
  const CHECK_INTERVAL = 200; // 1 second. Increase this to check less frequently

  function AttackManager() {
    console.info("=".repeat(54) + "\n== Vykaax's Attack Manager 1.10 ==\n" + "=".repeat(54));
    console.info(`AttackManager: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
	
	attackInterval = setInterval(() => {
		if (!Me.IsDead && !Target.IsDead && Target.objID > 0) {
			Send.AttackRequest(Target.objId);
		}
    }, CHECK_INTERVAL);
  }

  return AttackManager;
})();

var autoAttackManager = new AttackManager();

