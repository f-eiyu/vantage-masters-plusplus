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
        // fail if targeting self (mostly because it's useless)
        return (this.validateBuffGeneric(skillSpace, targetSpace)
                && skillSpace !== targetSpace);
    },
    cbSkillBard: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillTyrant: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },

    // ========== Regular natial skill validators ==========
    cbSkillDullmdalla: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillXenofiend: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    }
}

const skillUseValidation = (userSpace, targetSpace) => {
    const player = getPlayer(userSpace.owner);
    const userCard = userSpace.innerCard;

    // always fail if master skill and insufficient mana
    if (userCard.isMaster && userCard.skillCost > player.currentMana) {
        return false;
    }

    // validate the skill's usage based on the skill
    const cbName = userSpace.innerCard.skillCbName;
    return skillValidators[cbName](userSpace, targetSpace);
}

const natialRightClick = (event) => {
    event.preventDefault();

    const thisRightClick = new CardDOMEvent(event.target);
    const userSpace = thisRightClick.spaceObj;
    const userCard = userSpace.innerCard;
    const player = getPlayer(userSpace.owner);

    console.log(userCard.skillReady);

    if (!userSpace.hasCard) { return; }
    if (!userCard.skillReady) { return; }
    if (!userCard.currentActions) { return; }

    if (skillUsage.selected) {
        skillUsage.purge();
        event.target.classList.remove("skill-selected");
    } else if (!userCard.isMaster || player.currentMana >= userCard.skillCost) {
        skillUsage = new NatialSkillEvent(userSpace);
        event.target.classList.add("skill-selected");
    }
}

const natialLeftClick = (event) => {
    // left clicking is only used to confirm skill usage on a target natial.
    // if no skill is being used, left clicking should never succeed.
    if (!skillUsage.selected) { return; }

    const skillUser = skillUsage.userSpace;
    const thisLeftClick = new CardDOMEvent(event.target);
    const thisLeftClickSpace = thisLeftClick.spaceObj;

    if (skillUseValidation(skillUser, thisLeftClickSpace)) {
        skillUser.DOM.classList.remove("skill-selected");
        skillUser.activateSkill(thisLeftClickSpace);
        skillUsage.purge();
    }
}

const natialActiveCallbacks = {
    // Generic effects
    genericDrawCard: function(targetSpace, n = 1) {
        getPlayer(targetSpace.owner).drawCard(n);
    },
    genericDamageTarget: function(targetSpace, dmg) {
        targetSpace.dealDamage(dmg);
    },
    genericDamageRow: function(targetSpace, dmg) {
        const natialZone = getPlayer(targetSpace.owner).natialZone;

        natialZone.forAllSpacesInRow(targetSpace.row, sp => sp.dealDamage(dmg));
    },

    // ========== Master active skills ==========
    cbSkillSister: function(targetSpace) {
        // heals the target for 2 HP
        const targetCard = targetSpace.innerCard;

        restoreHP(targetCard, 2);
    },
    cbSkillKnight: function(targetSpace) {
        // all allied natials gain 1 ATK
        const player = getPlayer(targetSpace.owner);

        player.natialZone.forAllCards(card => card.buffAtk(1));
    },
    cbSkillThief: function(targetSpace) {
        // draws a card
        this.genericDrawCard(targetSpace);
    },
    cbSkillWitch: function(targetSpace) {
        // deals 4 damage to the target
        this.genericDamageTarget(targetSpace, 4);
    },
    cbSkillPaladin: function(targetSpace) {
        // revives a random destroyed natial
        // ### probably refactor this along with DestroyedCards in the future
        const owner = targetSpace.owner;
        const natialZone = getPlayer(owner).natialZone;

        const deadNatials = destroyedCards.listNatials(owner);
        const cardToRevive = deadNatials[Math.floor(Math.random() * deadNatials.length)];

        // bring the selected natial back to the board with restored HP, no
        // actions, and no seal; carry over its other pre-death stats
        cardToRevive.curHP = cardToRevive.maxHP;
        cardToRevive.currentActions = 0;
        cardToRevive.canMove = false;
        cardToRevive.sealed = 0;
        const destSpace = natialZone.getRandomEmpty();
        natialZone.cardToZone(destSpace, cardToRevive);

        // remove the revived natial from destroyedCards
        const revivedIndex = destroyedCards.byPlayer(owner).indexOf(cardToRevive);
        destroyedCards.byPlayer(owner).splice(revivedIndex, 1);
    },
    cbSkillBeast: function(targetSpace) {
        // draws a card
        this.genericDrawCard(targetSpaec);
    },
    cbSkillSwordsman: function(targetSpace) {
        // deals 1 damage to the row containing the target
        this.genericDamageRow(targetSpace, 1);
    },
    cbSkillSorcerer: function(targetSpace) {
        // adds a Magic Crystal spell to the hand
        const player = getPlayer(targetSpace.owner);
        const firstEmpty = player.hand.firstEmpty;
        const magicCrystal = createCard(getFromDB("Magic Crystal"));
        
        player.hand.cardToHand(firstEmpty, magicCrystal);
    },
    cbSkillShadow: function(targetSpace) {
        // destroys the target card (in the opponent's hand)
        targetSpace.destroyCard();
    },
    cbSkillSpirit: function(targetSpace) {
        // gives the target an extra action (but not an extra move)
        targetSpace.innerCard.currentActions += 1;
    },
    cbSkillBard: function(targetSpace) {
        // seals the target for 1 (additional) turn
        targetSpace.innerCard.sealed++;
    },
    cbSkillTyrant: function(targetSpace) {
        // deals 3 damage to all enemies
        const natialZone = getPlayer(targetSpace.owner).natialZone;
        natialZone.forAllSpaces(sp => sp.dealDamage(3));
    },
    // ========== Regular natial active skills ==========
    cbSkillDullmdalla: function (targetSpace) {
        // deals 1 damage to the row containing the target
        this.genericDamageRow(targetSpace, 1);
    },
    cbSkillXenofiend: function(targetSpace) {
        // deals 5 damage to the target
        this.genericDamageTarget(targetSpace, 5);
    }
}

const natialPassiveCallbacks = {

}