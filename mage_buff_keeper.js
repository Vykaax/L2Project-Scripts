assert_min_version("2.1.2");
/**
 * Mage Buffer Script v1.03
 *
 * @author Vykaax
 * @created 2021-02-09
 * @requires L2Project v2.1.2 or higher
 */
 function CancelBuff(buffID) {
	console.info(`MageBuffer: Cancelling ${BuffsList.GetItemByID(buffID).Name}`);
	let pb = new PacketBuilder();
	pb.AppendHex("D04B00"); // Dispel Buff packet
	pb.AppendDWord(Me.objId);
	pb.AppendDWord(buffID);
	BuffsList.GetItemByID(buffID).SkillLvl
	pb.AppendDWord(BuffsList.GetItemByID(buffID).SkillLvl);   // Buff level
	Send.SendHex(pb.toString());
}
 
 
(async function main() {
	const BLAZING_ID = 1232;
	const ACUMEN_ID = 1085;
	const BERSERKER_ID = 1062;
	//const HASTE_ID = 1086;
	//const BERSERK_ID = 1062;

	const CHECK_INTERVAL = 500; // 1 second. Increase this to check less frequently

	console.info("=".repeat(54) + "\n== Vykaax's Mage Buffer Script 1.05 ==\n" + "=".repeat(54));
	console.info(`MageBuffer: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
	for (;;) {
		if (Status.IsConnected && !Me.IsDead) {
			//frenzySkill = SkillsList.GetItemByID(FRENZY_ID);
			//zealotSkill = SkillsList.GetItemByID(ZEALOT_ID);

			if (BuffsList.ContainsID(BLAZING_ID)) {
				CancelBuff(BLAZING_ID);
			} else if (!BuffsList.ContainsID(BERSERKER_ID) && !Me.IsInCombat) {
				console.warn(`MageBuffer: Buffing ${BuffsList.GetItemByID(BERSERKER_ID).Name}`);
				Send.ReqBypassToServer(`_bbsbufferbypass_giveBuffs 1062 2 buff`); // Berserker Spirit
			} else if (!BuffsList.ContainsID(ACUMEN_ID) && !Me.IsInCombat) {
				console.warn(`MageBuffer: Buffing ${BuffsList.GetItemByID(ACUMEN_ID).Name}`);
				Send.ReqBypassToServer(`_bbsbufferbypass_giveBuffs 1085 2 buff`); // Acumen
			}
		}

		await sleep(CHECK_INTERVAL);
	}
})();

