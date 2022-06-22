const skillValidators = {
    // ========== Generic validators ==========
    validateBuffGeneric: function(skillSpace, targetSpace) {
        // fail if trying to use on an opponent
        if (skillSpace.owner !== targetSpace.owner) { return false; }
        // fail if target is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if not targeting natial space
        if (!targetSpace.isNatial) { return false; }

        return true;
    },
    validateOffensiveGeneric: function(skillSpace, targetSpace) {
        // fail if trying to use on a friendly
        if (skillSpace.owner === targetSpace.owner) { return false; }
        // fail if target is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if not targeting natial space
        if (!targetSpace.isNatial) { return false; }

        return true;
    },
    validateTargetless: function(skillSpace, targetSpace) {
        // only succeed if target is user
        if (skillSpace != targetSpace) { return false; }

        return true;
    },
    validateCardAccel: function(skillSpace, targetSpace) {
        // fails if the user's hand is full
        return !getPlayer(skillSpace.owner).hand.isFull;
    },

    // ========== Master skill validators ==========
    cbSkillSister: function(skillSpace, targetSpace) {
        return this.validateBuffGeneric(skillSpace, targetSpace);
    },
    cbSkillKnight: function(skillSpace, targetSpace) {
        return this.validateTargetless(skillSpace, targetSpace);
    },
    cbSkillThief: function(skillSpace, targetSpace) {
        return (this.validateTargetless(skillSpace, targetSpace)
                && this.validateCardAccel(skillSpace, targetSpace));
    },
    cbSkillWitch: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillPaladin: function(skillSpace, targetSpace) {
        if (!this.validateTargetless(skillSpace, targetSpace)) { return false; }
        // fails if the user's natial zone is full
        const owner = skillSpace.owner;
        if (getPlayer(owner).natialZone.isFull) { return false; }
        // fails if the user has no destroyed natials
        if (!destroyedCards.listNatials(owner).length) { return false; }

        return true;

    },
    cbSkillBeast: function(skillSpace, targetSpace) {
        return (this.validateTargetless(skillSpace, targetSpace)
                && this.validateCardAccel(skillSpace, targetSpace));
    },
    cbSkillSwordsman: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillSorcerer: function(skillSpace, targetSpace) {
        return (this.validateTargetless(skillSpace, targetSpace)
                && this.validateCardAccel(skillSpace, targetSpace));
    },
    cbSkillShadow: function(skillSpace, targetSpace) {
        // fail if target is not opposing hand
        if (skillSpace.owner === targetSpace.owner) { return false; }
        if (!targetSpace.isHand) { return false; }
        // fail if targeting an empty space
        if (!targetSpace.hasCard) { return false; }

        return true;
    },
    cbSkillSpirit: function(skillSpace, targetSpace) {
        return this.validateBuffGeneric(skillSpace, targetSpace);
    },
    cbSkillBard: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillTyrant: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },

    // ========== Other natial skill validators ==========
}

const skillUseValidation = (userSpace, targetSpace) => {
    const player = getPlayer(userSpace.owner);
    const userCard = userSpace.innerCard;

    // always fail if natial skill and insufficient mana
    if (userCard.isMaster && userCard.skillCost > player.currentMana) {
        return false;
    }

    // validate the skill's usage based on the skill
    const cbName = userSpace.innerCard.skillCallbackName;
    return skillValidators[cbName](userSpace, targetSpace);



    // const userSpace = skillUsage.userSpace;

   



    switch(cbName) {

        // shadow: must check if enemy has a card in hand - after hand refactor
        case "cbSkillShadow":

        // paladin: must check if the player has dead cards and if board is full - after board refactor
        case "cbSkillPaladin":



        default: return false;
    }
}

const natialRightClick = (event) => {
    event.preventDefault();

    const thisRightClick = new CardDOMEvent(event.target);
    const userSpace = thisRightClick.spaceObj;
    const userCard = userSpace.innerCard;
    const player = getPlayer(userSpace.owner);

    if (!userSpace.hasCard) { return; }
    if (!userCard.skillReady) { return; }
    if (!userCard.currentActions) { return; }

    if (skillUsage.selected) {
        skillUsage.purge();
        event.target.classList.remove("skill-selected");
    } else if (player.currentMana >= userCard.skillCost) {
        skillUsage = new NatialSkillEvent(userSpace);
        event.target.classList.add("skill-selected");
    }
}

const natialLeftClick = (event) => {
    // left clicking is only used to confirm skill usage on a target natial.
    // if no skill is being used, left clicking should never succeed.
    if (!skillUsage.selected) { return; }

    const thisLeftClick = new CardDOMEvent(event.target);
    const thisLeftClickSpace = thisLeftClick.spaceObj;

    if (skillUseValidation(thisLeftClickSpace)) {
        skillUsage.userSpace.DOM.classList.remove("skill-selected");
        skillUsage.userSpace.activateSkill(thisLeftClickSpace);
        skillUsage.purge();
    }
}