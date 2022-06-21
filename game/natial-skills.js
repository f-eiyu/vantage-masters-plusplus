const skillUseValidation = (targetSpace) => {
    const userSpace = skillUsage.userSpace;

    const cbName = userSpace.card.skillCallbackName;
    switch(cbName) {
        // team buff skills: succeed if target is friendly natial
        case "cbSkillSister":
        case "cbSkillSpirit":
            if (targetSpace.card
                && targetSpace.owner === userSpace.owner
                && targetSpace.isNatialSpace) {
                return true;
            }
            return false;

        // targeted/area offensive skills: succeed if target is opposing natial
        case "cbSkillWitch":
        case "cbSkillSwordsman":
        case "cbSkillBard":
        case "cbSkillTyrant":
            if (targetSpace.card
                && targetSpace.owner !== userSpace.owner
                && targetSpace.isNatialSpace) {
                    return true;
            }
            return false;

        // targetless skills: targets the skill user for validation
        case "cbSkillKnight":
            if (targetSpace.card
                && targetSpace.card === userSpace.card) {
                return true;
            }
            return false;

        // player hand adders: must check if hand is full - after hand refactor
        case "cbSkillSorceror":
        case "cbSkillThief":
        case "cbSkillBeast":

        // shadow: must check if enemy has a card in hand - after hand refactor
        case "cbSkillShadow":

        // paladin: must check if the player has dead cards and if board is full - after board refactor
        case "cbSkillPaladin":



        default: return false;
    }
}

const natialRightClick = (event) => {
    event.preventDefault();

    const thisRightClick = new cardDOMEvent(event.target);
    const userSpace = thisRightClick.spaceObj;

    if (!userSpace.card) { return; }
    if (!userSpace.card.skillReady) { return; }
    if (!userSpace.card.currentActions) { return; }

    if (skillUsage.selected) {
        skillUsage.purge();
        event.target.classList.remove("skill-selected");
    } else if (currentMana[userSpace.owner] >= userSpace.card.skillCost) {
        skillUsage = new NatialSkillEvent(userSpace);
        event.target.classList.add("skill-selected");
    }
}

const natialLeftClick = (event) => {
    // left clicking is only used to confirm skill usage on a target natial.
    // if no skill is being used, left clicking should never succeed.
    if (!skillUsage.selected) { return; }

    const thisLeftClick = new cardDOMEvent(event.target);
    const thisLeftClickSpace = thisLeftClick.spaceObj;

    if (skillUseValidation(thisLeftClickSpace)) {
        skillUsage.userSpace.DOM.classList.remove("skill-selected");
        skillUsage.userSpace.activateSkill(thisLeftClickSpace);
        skillUsage.purge();
    }
}