assert_min_version("2.2.0");
/**
 * Pet Manager Script v1.00
 *
 * @author Vykaax
 * @created 2021-07-09
 * @requires L2Project v2.2.0 or higher
 */
var PetManager = (function () {
  const PET_ID = 1128; // Default is Shadow, change this ID for whatever Pet you want
  
  const CHECK_INTERVAL = 5000; // 5 seconds. Increase this to check less frequently

  function PetManager() {
    console.info("=".repeat(54) + "\n== Vykaax's Pet Manager Script 1.00 ==\n" + "=".repeat(54));
    console.info(`${(new Date()).toLocaleTimeString()} : PetManager: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);

	checkPetInterval = setInterval(() => {
		if (Context.IsConnected && !Me.IsDead) {
			console.info(`${(new Date()).toLocaleTimeString()} : PetManager: Checking summon list (Count ${PetList.Count})`);
			let hasSummon = false;
			if (PetList.Count > 0) {
				for (i = 0; i < PetList.Count; i++) {
					if (PetList[i].masterObjId == Me.objId) {
						if (CreaturesList.GetItemByObjectID(PetList[i].objId) == null) {
							console.info(`${(new Date()).toLocaleTimeString()} : PetManager: My pet is missing`);
						}
						else if ((CreaturesList.GetItemByObjectID(PetList[i].objId)).IsDead) {
							console.info(`${(new Date()).toLocaleTimeString()} : PetManager: My pet is dead`);
						} else {
							console.info(`${(new Date()).toLocaleTimeString()} : PetManager: Found my pet ${CreaturesList.GetItemByObjectID(PetList[i].objId).Name}, owner ${Me.Name}`);
							hasSummon = true;
						}
					} else {
						console.info(`${(new Date()).toLocaleTimeString()} : PetManager: Found other pet ${CreaturesList.GetItemByObjectID(PetList[0].objId).Name}, owner ${CreaturesList.GetItemByObjectID(PetList[i].masterObjId).Name}`);
					}
				}
			} else {
				hasSummon = false;
			}
			if (hasSummon == false) {
				console.info(`${(new Date()).toLocaleTimeString()} : PetManager: Summoning`);
				Send.RequestMagicSkillUse(PET_ID);
			}
		}
    }, CHECK_INTERVAL);
  }

  return PetManager;
})();

var autoPetManager = new PetManager();