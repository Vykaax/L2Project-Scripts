if(!this['sleep']) Sleep = sleep;
const updateRate = 5000;

const ID_MAGES = [10,11,12,13,14,25,26,27,28,38,39,40,41,51,52,94,95,96,103,104,110,111,115,116,143,144,145,166,167,168,169,170,174,175,176,177,178,187];
const ID_FIGHTERS = [0,1,2,3,18,19,20,21,31,34,44,45,46,47,48,49,50,53,54,55,56,57,88,89,100,107,113,114,117,118,123,124,125,126,127,128,129,131,132,133,134,135,136,140,152,153,154,155,156,157,172,173,182,183,184,185,186,189];
const ID_SUPPORTS = [15,16,17,29,30,42,43,97,98,105,112,146,171,179,180,181];
const ID_TANKS = [4,5,6,32,33,90,91,99,106,139,148,149,150,151];
const ID_DAGGERS = [7,8,22,23,35,36,93,101,108,141,158,159,160,161,165,188];
const ID_ARCHERS = [9,24,37,92,102,109,130,142,162,163,164];

const AdenaID = 57;
const ManaPotionID = 728;
const SpiritOreID = 3031;

var InventoryString = "";
var primaryShotID = null;

function OnSystemMessage(msgId) {
    if (msgId == 49) {
        SetShotID();
    }
}

function InventoryToString() {
    InventoryString = "";
    Inventory.forEach((item) => {InventoryString += `{"ID":"${item.Id}","Name":"${item.Name}","Quantity":"${item.Count}","Grade":"${item.Grade.ToString()}"},`});
    //Inventory.forEach((item) => {InventoryString += `{"ID":${item.Id},"Name":${item.Name},"Quantity":${item.Count},"Grade":${item.Grade.ToString()}},`});
    InventoryString = InventoryString.substring(0,InventoryString.length-1);
}

function SetShotID() {
    let gradeLetter = null;
    let primaryShotItem = null;
    Inventory.forEach ((item) => {if (item.IsEquiped && item.IsWeapon()) {gradeLetter = item.Grade.ToString();} })
    //console.log(`gradeLetter = ${gradeLetter}`);
    if ((ID_FIGHTERS + ID_TANKS + ID_DAGGERS + ID_ARCHERS).includes(Me.ClassId)) {
        primaryShotItem = (Inventory.GetItemByName(`Soulshot (${gradeLetter}-Grade)`));
    } else {
        primaryShotItem = (Inventory.GetItemByName(`Blessed Spiritshot (${gradeLetter}-Grade)`));
    }
    
    if (primaryShotItem == null) {
        primaryShotID = null;
        console.warn(`Primary shots : none selected`);
    } else {
        primaryShotID = primaryShotItem.Id;
        console.log(`Primary shots: ${Inventory.GetItemByID(primaryShotID).Name}`);
    }
}


(async function main() {
    console.info("=".repeat(54) + "\n====== Vykaax's Bot Status to Title Script v1.00 =====\n" + "=".repeat(54));
    await sleep(10000);
    SetShotID();
    var myName = Me.Name;
    
    for (;;) {
        if (Context.IsConnected()) {
            //Inventory.GetItemByID(primaryShotID) == null ? "" : Inventory.GetItemByID(primaryShotID).Name
            try {
                InventoryToString()
                //console.log(`${Inventory.GetItemByID(728) == null ? 0 : Inventory.GetItemByID(728).Count},Mana Potion,${Inventory.GetItemByID(3031) == null ? 0 : Inventory.GetItemByID(3031).Count},Spirit Ore`);
                //console.log(`${Inventory.GetItemByID(728) == null ? 0 : Inventory.GetItemByID(728).Count},Mana Potion`);
            } catch {
                //console.error(`Unable to write consumables line`);
            }
            //mana potion and spirit ore
            //${Inventory.GetItemByID(728) == null ? "" : Inventory.GetItemByID(728).Count},Mana Potion,${Inventory.GetItembyID(3031) == null ? "" : Inventory.GetItembyID(3031).Count},Spirit Ore
            //${Inventory.GetItemByID(primaryShotID) == null ? 0 : Inventory.GetItemByID(primaryShotID).Count},${Inventory.GetItemByID(primaryShotID) == null ? "" : Inventory.GetItemByID(primaryShotID).Name},${Inventory.GetItemByName("Mana Potion") == null ? "" : Inventory.GetItemByName("Mana Potion").Count},Mana Potion,${Inventory.GetItembyName("Spirit Ore") == null ? "" : Inventory.GetItembyName("Spirit Ore").Count},Spirit Ore
            //${Inventory.GetItemByName("Mana Potion") == null ? "" : Inventory.GetItemByName("Mana Potion").Count},"Mana Potion",${Inventory.GetItembyName("Spirit Ore") == null ? "" : Inventory.GetItembyName("Spirit Ore").Count},"Spirit Ore"
            //SetWindowTitle(`${Me.Name},Online,${Me.ClassName},${Me.Level},${Me.HP},${Me.MaxHP},${Me.MP},${Me.MaxMP},${Me.CP},${Me.MaxCP},${Me.Exp},${Me.IsDead},${PartyList.Count == 0 || Context.IsPartyLeader() ? Me.Name : PartyList[0].Name }`);
            //SetWindowTitle(`${Me.Name},1,${Me.HP},${Me.MaxHP},${Me.MP},${Me.MaxMP},${Me.CP},${Me.MaxCP},${Me.ClassName},${Me.ExpPercent},${Me.Level},${!Me.IsDead},${PartyList.Count == 0 || Context.IsPartyLeader() ? Me.Name : PartyList[0].Name },${Inventory.GetItemByName("Adena").Count},${Target == null ? "" : Target.Name},${Target == null ? 0 : Target.HP},${Target == null ? 0 : Target.MaxHP},${Target == null ? 0 : Target.HpPercent},${Inventory.Count},${Inventory.GetItemByID(primaryShotID) == null ? 0 : Inventory.GetItemByID(primaryShotID).Count},${Inventory.GetItemByID(primaryShotID) == null ? "" : Inventory.GetItemByID(primaryShotID).Name},${Inventory.GetItemByID(728) == null ? 0 : Inventory.GetItemByID(728).Count},Mana Potion,${Inventory.GetItemByID(3031) == null ? 0 : Inventory.GetItemByID(3031).Count},Spirit Ore`);
            try {
                //console.log(`Writing title`);
                //SetWindowTitle(`${Me.Name},1,${Me.HP},${Me.MaxHP},${Me.MP},${Me.MaxMP},${Me.CP},${Me.MaxCP},${Me.ClassName},${Me.ExpPercent},${Me.Level},${!Me.IsDead},${PartyList.Count == 0 || Context.IsPartyLeader() ? Me.Name : PartyList[0].Name },${Inventory.GetItemByID(57).Count},${Target == null ? "" : Target.Name},${Target == null ? 0 : Target.HP},${Target == null ? 0 : Target.MaxHP},${Target == null ? 0 : Target.HpPercent},${Inventory.Count},${primaryShotID == null ? 0 : Inventory.GetItemByID(primaryShotID).Count},${primaryShotID == null ? "" : Inventory.GetItemByID(primaryShotID).Name}`);
                SetWindowTitle(`${Me.Name}|1|${Me.HP}|${Me.MaxHP}|${Me.MP}|${Me.MaxMP}|${Me.CP}|${Me.MaxCP}|${Me.ClassName}|${Me.ExpPercent}|${Me.Level}|${!Me.IsDead}|${PartyList.Count == 0 || Context.IsPartyLeader() ? Me.Name : PartyList[0].Name }|${Inventory.GetItemByID(57).Count}|${Target == null ? "" : Target.Name}|${Target == null ? 0 : Target.HP}|${Target == null ? 0 : Target.MaxHP}|${Target == null ? 0 : Target.HpPercent}|${Inventory.Count}|${primaryShotID == null ? 0 : Inventory.GetItemByID(primaryShotID).Count}|${primaryShotID == null ? "-" : Inventory.GetItemByID(primaryShotID).Name}|${InventoryString}`);
            } catch(err) {
                console.error(`Failed to write title: ${err.message}`);
                SetWindowTitle(`${Me.Name}|1`);
            }
        } else {
            SetWindowTitle(`${myName}|0`);
        }
        await sleep(updateRate);
    }
})();