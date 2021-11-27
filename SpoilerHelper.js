(async function main() {
	console.info("=".repeat(54) + "\n== Vykaax's AOE Spoiler Script 1.03 ==\n" + "=".repeat(54));
	console.info(`SpoilHelper: My class is ${Me.ClassName} (${Me.ClassId.toString()})`);
	
	const SPOIL_FESTIVAL_ID = 302;
	const SWEEPER_FESTIVAL_ID = 444;
	
	for (;;) {
		if (Status.IsConnected && Me.IsInCombat && !Me.IsDead) {
			Send.RequestMagicSkillUse(SPOIL_FESTIVAL_ID);
			await sleep(200);
			Send.RequestMagicSkillUse(SPOIL_FESTIVAL_ID);
			await sleep(200);
			Send.RequestMagicSkillUse(SPOIL_FESTIVAL_ID);
			await sleep(15000);
		}
	}
})();