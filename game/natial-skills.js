const skillUseValidation = (targetSpace) => {
    const userSpace = skillUsage.userSpace;

    const cbName = userSpace.card.skillCallbackName;
    switch(cbName) {
        // friendly buff skills: succeed if target is friendly natial, else fail
        case "cbSkillSister":
            if (targetSpace.card
                && targetSpace.owner === userSpace.owner
                && targetSpace.isNatialSpace) {
                return true;
            }
            return false;
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