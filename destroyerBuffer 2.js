assert_min_version("2.1.2");
/**
 * Destroyer Script v1.03
 *
 * @author Vykaax
 * @created 2021-02-09
 * @requires L2Project v2.1.2 or higher
 */
 function CancelBuff(buffID) {
	console.info(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Cancelling ${BuffsList.GetItemByID(buffID).Name}`);
	let pb = new PacketBuilder();
	pb.AppendHex("D04B00"); // Dispel Buff packet
	pb.AppendDWord(Me.objId);
	pb.AppendDWord(buffID);
	BuffsList.GetItemByID(buffID).SkillLvl
	pb.AppendDWord(BuffsList.GetItemByID(buffID).SkillLvl);   // Buff level
	Send.SendHex(pb.toString());
}
 
 
(async function main() {
	const FRENZY_ID = 176;
	const ZEALOT_ID = 420;
	const VAMPDANCE_ID = 310;
	const BLOODAWAKE_ID = 1519;
	//const HASTE_ID = 1086;
	//const BERSERK_ID = 1062;
	var frenzySkill, zealotSkill;

	const CHECK_INTERVAL = 500; // 1 second. Increase this to check less frequently

	console.info("=".repeat(54) + "\n== Vykaax's Destroyer Script 1.04 ==\n" + "=".repeat(54));
	console.info(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
	for (;;) {
		if (Context.IsConnected && !Me.IsDead && (Me.ClassId == 113)) {
			frenzySkill = SkillsList.GetItemByID(FRENZY_ID);
			zealotSkill = SkillsList.GetItemByID(ZEALOT_ID);

			if (frenzySkill.IsReady && Me.HpPercent <= 60) {
				Send.RequestMagicSkillUse(FRENZY_ID);
				console.warn(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Using Frenzy`);
			} else if (zealotSkill.IsReady && Me.HpPercent <= 30) {
				Send.RequestMagicSkillUse(ZEALOT_ID);
				console.warn(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Using Zealot`);
			} else if (BuffsList.ContainsID(VAMPDANCE_ID)) {
				CancelBuff(VAMPDANCE_ID);
			} else if (BuffsList.ContainsID(BLOODAWAKE_ID)) {
				CancelBuff(BLOODAWAKE_ID);
			} else if (!BuffsList.ContainsID(1062) && !Me.IsInCombat) {
				console.warn(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Buffing Berserker Spirit`);
				Send.ReqBypassToServer("_bbsbufferbypass_giveBuffs 1062 2 buff"); // Berserker Spirit
			} else if (!BuffsList.ContainsID(1086) && !Me.IsInCombat) {
				console.warn(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Buffing Haste`);
				Send.ReqBypassToServer("_bbsbufferbypass_giveBuffs 1086 2 buff"); // Haste
			} else if (!BuffsList.ContainsID(4699) && !Me.IsInCombat) {
				console.warn(`${(new Date()).toLocaleTimeString()} : DestroyerBuffer : Buffing Blessing of Queen`);
				Send.ReqBypassToServer("_bbsbufferbypass_giveBuffs 4699 13 buff"); // Haste
			}
		}

		await sleep(CHECK_INTERVAL);
	}
})();

