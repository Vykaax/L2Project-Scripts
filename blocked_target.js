async function OnIncomingPacket(p) {
    const packet = new PacketReader(p.splice(2, p.length - 2));
    const _id = packet.ReadByte();
	
    if (_id === 0x62) {
        const msgID = packet.ReadDWord();
		if (msgID == 181) {
			blockCount++;
			//console.info(`${(new Date()).toLocaleTimeString()} : Target Fixer: Target is blocked, ${blockCount} tries`);
			if (blockCount >= 2) {	
				Send.MoveTo(Math.floor(Me.X+((Math.floor(Math.random()*250)+50)*(Math.round(Math.random()) ? 1: -1))),Math.floor(Me.Y+((Math.floor(Math.random()*250)+50)*(Math.round(Math.random()) ? 1: -1))));
				blockCount = 0;
			}

		}
    }
}

var blockCount = 0;

(async function main() {
    console.log("=== Vykaax's Line of Sight Fix v1.1 Enabled ===");
	
    for(;;) {
		// do nothing
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(20000);} else {await sleep(20000);}
    }
})();