if(!this['sleep']) Sleep = sleep;

const trySkillDelay = 1000;
const maxAttempts = 5;
var debuffSkill = null;
var checkDelay = 25000;
var expectResult = true;
var hasSkill = false;
var hpThreshold = 20000;
var trySkill = true;
var mpReserve = 10; // MP Percentage required to cast, reserve MP if below this threshold
var currentAttempts = 0;
var verboseLog = 0;

function consoleTime(logType, logLevel, logText) {
	if ( verboseLog == null || verboseLog >= logLevel) {
		let logString = `${(new Date()).toLocaleTimeString()} : ${logText}`;
		switch (logType) {
			case 'log': console.log(logString); break;
			case 'info': console.info(logString); break;
			case 'warn': console.warn(logString); break;
			case 'error': console.error(logString); break;
			case 'debug': console.debug(logString); break;
			default:
				console.debug(logString);
		}
	}
}

async function SelectClassSkill() {
	consoleTime("log",0,`Selecting class based skill for ${Me.ClassName}`);
	expectResult = true;
    switch (Me.ClassName) {
		case 'Soul Breaker Female':
		case 'Soul Hound Female':
			debuffSkill = 1435; // Death Mark
			break;
        case 'Berserker':
        case 'Doombringer':
            debuffSkill = 501; // Violent Temper
            break;
        case 'Adventurer':
            debuffSkill = 409; // Critical Blow
			expectResult = false;
            break;
		case 'Temple Knight':
		case 'Evas Templar':
        case 'Paladin':
        case 'Phoenix Knight':
            debuffSkill = 400; // Tribunal
            break;
	case 'Shillien Knight':
	case 'Shillien Templar':
		debuffSkill = 122; // Hex
		break;
        case 'Shillien Elder':
        case 'Shillien Saint':
    	case 'Cardinal':
            debuffSkill = 1539; // Stigma of Shilien
		expectResult = false;
            break;        
        default: debuffSkill = null;
    }
	consoleTime("log",3,`Selection done`);
    if (SkillsList.GetItemByID(debuffSkill) != null) {
        hasSkill = true;
		let testDebuffTime = /([0-9]+) seconds/.exec(SkillsList.GetItemByID(debuffSkill).Description)[1];
		if (testDebuffTime != null) {
			checkDelay = Math.max(testDebuffTime*1000,SkillsList.GetItemByID(debuffSkill).ReuseDelay);
		}
        consoleTime("log",0,`Skill selected - ${SkillsList.GetItemByID(debuffSkill).Name} - Timer ${checkDelay/1000}s - Attempts ${maxAttempts}`);
    } else {
        hasSkill = false;
		consoleTime("error",0,`Skill not found`);
    }
}

async function OnSystemMessage(id,msg) {
    // 139 skill Failed
	if (id == 139) {
        if (msg.skillId == debuffSkill) {
			consoleTime("error",1,`[${id}] ${SkillsList.GetItemByID(msg.skillId).Name} Failed`);
            trySkill = true;
        }
	// skill was cast - some skills like Stigma of Shilen don't return a result
	} else if (id == 46) {
        if (msg.skillId == debuffSkill) {
			currentAttempts++;
			consoleTime("log",1,`[${id}] ${SkillsList.GetItemByID(msg.skillId).Name} Cast (Attempt ${currentAttempts})`);
			if (expectResult == false) {
				trySkill = false;
			}
        }
	// 1595 skill Succeeded
	} else if (id == 1595) {
        if (msg.skillId == debuffSkill) {
			consoleTime("warn",1,`[${id}] ${SkillsList.GetItemByID(msg.skillId).Name} Succeeded`);
            trySkill = false;
        }
	} 
}

function CheckConditions() {
	consoleTime("log",3,`Condition hasSkill    : ${hasSkill}`);
	consoleTime("log",3,`Condition trySkill    : ${trySkill}`);
	consoleTime("log",3,`Condition Target      : ${Target}`);
	consoleTime("log",3,`Condition Target HP   : ${Target.HP > (Me.HP*2.5)} (${Target.HP} > ${Me.HP*2.5})`);
	consoleTime("log",3,`Condition MP Reserved : ${Me.MpPercent >= mpReserve}`);
	consoleTime("log",3,`Condition Target Mob  : ${Target.crtType.ToString() == "Mob"} (${Target.crtType.ToString()})`);
    if (hasSkill == true && trySkill == true && Target != null && Target.HP > (Me.HP*2.5) && Me.MpPercent >= mpReserve && Target.crtType.ToString() == "Mob") {
		consoleTime("log",3,`Check conditions : TRUE`);
        return true;
    }
	consoleTime("log",3,`Check conditions : FALSE`);
    return false;
}

async function OnDie(objId) {
    if (objId == Target.objId) {
        currentAttempts = 0;
    }
}

(async function main() {
    console.info("=".repeat(54) + "\n========= Vykaax's Class Debuff Script 1.00 =========\n" + "=".repeat(54));
    await sleep(3000);
    
    SelectClassSkill();
        
	for (;;) {
		if (Context.IsConnected && debuffSkill != null) {
			for (;;) {
				if (CheckConditions() && currentAttempts < maxAttempts) {
					consoleTime("log",3,`Trying to use skill ${SkillsList.GetItemByID(debuffSkill).Name}`);
					//console.log(`${(new Date()).toLocaleTimeString()} : Trying to use skill ${SkillsList.GetItemByID(debuffSkill).Name}`);
					Send.RequestMagicSkillUse(debuffSkill);
					await Sleep(150);
					Send.RequestMagicSkillUse(debuffSkill);
					await Sleep(trySkillDelay);
				} else {
					break;
				}
			}
		}
        currentAttempts = 0;
		await Sleep(checkDelay);
		trySkill = true;
	}
})();
