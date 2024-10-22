(async function main() {
    console.info("=== Vykaax's Coliseum Recharge Script v1.0 Enabled ===");
    const mpString = "Full MP Regeneration. (1 MP for 5 adena)"
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(2000);} else {await sleep(2000);}
    Select("Arena Director");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    console.warn(`Selected Director`);
    Select("Arena Director");
    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1500);} else {await sleep(1500);}
    
    for (;;) {
        if (Context.IsConnected) {
            if (Me.MP < 240) {
                Send.ReqBypassToServer("02");
                if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(1000);} else {await sleep(1000);}
            }
            if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(250);} else {await sleep(250);}
        }
    }
})();