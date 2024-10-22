assert_min_version("2.3.0");

var safeList = ["Supervisor","RedTwo","RedTen","BlueTwo","BlueThree","BlueTen","Cleric","Priestess","Steak","Strawberry","Pancakes","Bulwark","BlueLeader","RedLeader"];
lockTarget = null;


(async function main() {
    console.error("=== MURDER TIME v1.01 ===");
    for(;;) {
        if (Context.IsConnected) {
            if (CurrentZone.ToString() == "GENERALZONE" || CurrentZone.ToString() == "ALTEREDZONE") {
                if (BuffsList.ContainsID(268)) {
                    if (lockTarget == null || CreaturesList.GetItemByObjectID(lockTarget) == null || CreaturesList.GetItemByObjectID(lockTarget).IsDead) {
                        for (i = 0; i < CreaturesList.Count; i++) {
                            tempTarget = CreaturesList[i];
                            if (tempTarget.crtType.ToString() == "Char" && !tempTarget.IsDead && PartyList.GetItemByName(tempTarget.Name) == null &&!safeList.includes(tempTarget.Name)) {
                                tempTarget.CalculateDistance();
                                if (tempTarget.Distance < 1200) {
                                    lockTarget = tempTarget.objId;
                                    console.info(`${(new Date()).toLocaleTimeString()} : MURDER TRAIN : Selecting ${CreaturesList.GetItemByObjectID(lockTarget).Name}`);
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (lockTarget != null && CreaturesList.GetItemByObjectID(lockTarget) != null && !CreaturesList.GetItemByObjectID(lockTarget).IsDead) {
                    //if (Target != null && !Target.IsDead) {
                       Send.Action(lockTarget);
                       Send.Action(lockTarget);
                       Send.RequestMagicSkillUse(28);
                       Send.AttackRequest(lockTarget);
                       console.info(`${(new Date()).toLocaleTimeString()} : MURDER TRAIN : Attacking ${CreaturesList.GetItemByObjectID(lockTarget).Name}`);
                    }else if (Target == null || Target.IsDead) {// else if (CreaturesList.GetItemByObjectID(lockTarget) == null || CreaturesList.GetItemByObjectID(lockTarget).IsDead) {
                        lockTarget = null;
                    }
                    
                    /* 
                    if ( Target != null && !Target.IsDead() ) {
                       Send.AttackRequest(lockTarget); 
                    } else {
                        lockTarget = null;
                        //Send.RequestTargetCancel();
                    }*/
                } else {
                    console.info(`${(new Date()).toLocaleTimeString()} : MURDER TRAIN : Moving away from fight to buff`);
                    let moveDist = 300;
                    Send.MoveTo(Math.floor(Me.X+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))),Math.floor(Me.Y+((Math.floor(Math.random()*moveDist)+50)*(Math.round(Math.random()) ? 1: -1))));
                    if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(4000);} else {await sleep(4000);}
                }                    
            }
        }
		if ((__VERSION__.split(".")[0] >= 3) || (__VERSION__.split(".")[0] == 2 && __VERSION__.split(".")[1] >= 6)) {await Sleep(200);} else {await sleep(200);}
        
    }
})();