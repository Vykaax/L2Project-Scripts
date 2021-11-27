(async function main() {
	console.log("Starting Loot Grabber Script");
	for (;;) {
		if (DropList.Count > 0) {
			for (let i = 0; i < DropList.Count; i++) {
				DropList[i].CalculateDistance();
				if (DropList[i].Distance < 500) {
					Send.Action(DropList[i].objId);
					console.log(`Picking up ${DropList[i].Name}`);
					await sleep(2000);
				}
			}
		}
		await sleep(1000);
	}
})();