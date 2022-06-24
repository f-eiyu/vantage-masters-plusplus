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
    // Fire natials
    cbSkillDullmdalla: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillXenofiend: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    // Heaven natials
    cbSkillPelitt: function(skillSpace, targetSpace) {
        // fail if target is not sealed
        return (this.validateBuffGeneric(skillSpace, targetSpace)
                && targetSpace.innerCard.sealed);
    },
    cbSkillGueneFoss: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillKyrierBell: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillFifenall: function(skillSpace, targetSpace) {
        return this.validateBuffGeneric(skillSpace, targetSpace);
    },
    cbSkillRegnaCroix: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    // Earth natials
    cbSkillDArma: function(skillSpace, targetSpace) {
        return this.validateBuffGeneric(skillSpace, targetSpace);
    },
    cbSkillGiaBro: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillMaGorb: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    // Water natials
    cbSkillMarme: function(skillSpace, targetSpace) {
        return this.validateBuffGeneric(skillSpace, targetSpace);
    },
    cbSkillZamilpen: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillNeptjuno: function(skillSpace, targetSpace) {
        return this.validateOffensiveGeneric(skillSpace, targetSpace);
    },
    cbSkillTentarch: function(skillSpace, targetSpace) {
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

const calculateSkillDamage = (userSpace, targetSpace, dmg) => {
    const userElement = userSpace.innerCard.element;
    const targetElement = targetSpace.innerCard.element;

    return dmg + TYPE_CHART[userElement][targetElement];
}

const natialActiveCallbacks = {
    // ========== Generic effects ==========
    genericHealTarget: function(userSpace, targetSpace, hp) {
        targetSpace.innerCard.restoreHP(hp);
    },
    genericDrawCard: function(userSpace, targetSpace, n = 1) {
        getPlayer(targetSpace.owner).drawCard(n);
    },
    genericDamageTarget: function(userSpace, targetSpace, dmg) {
        // this method checks for type advantage before passing the final damage
        // into dealDamage(). all natial skills that do damage should be
        // passed through this method before actually resolving.
        const finalDmg = calculateSkillDamage(userSpace, targetSpace, dmg);
        targetSpace.dealDamage(finalDmg, userSpace);
    },
    genericDamageRow: function(userSpace, targetSpace, dmg) {
        const natialZone = getPlayer(targetSpace.owner).natialZone;
        natialZone.forAllSpacesInRow(targetSpace.row, sp => {
            this.genericDamageTarget(userSpace, sp, dmg);
        });
    },
    genericDamageAll: function(userSpace, targetSpace, dmg) {
        // deals 3 damage to all enemies
        const natialZone = getPlayer(targetSpace.owner).natialZone;
        natialZone.forAllSpaces(sp => {
            this.genericDamageTarget(userSpace, sp, dmg);
        });
    },
    genericSealTarget: function(userSpace, targetSpace, turns = 1) {
        targetSpace.innerCard.sealed += turns;
    },

    // ========== Master active skills ==========
    cbSkillSister: function(userSpace, targetSpace) {
        // heals the target for 2 HP
        this.genericHealTarget(userSpace, targetSpace, 2);
    },
    cbSkillKnight: function(userSpace, targetSpace) {
        // all allied natials gain 1 ATK
        const player = getPlayer(targetSpace.owner);

        player.natialZone.forAllCards(card => card.buffAtk(1));
    },
    cbSkillThief: function(userSpace, targetSpace) {
        // draws a card
        this.genericDrawCard(userSpace, targetSpace);
    },
    cbSkillWitch: function(userSpace, targetSpace) {
        // deals 4 damage to the target
        this.genericDamageTarget(userSpace, targetSpace, 4);
    },
    cbSkillPaladin: function(userSpace, targetSpace) {
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
    cbSkillBeast: function(userSpace, targetSpace) {
        // draws a card
        this.genericDrawCard(userSpace, targetSpace);
    },
    cbSkillSwordsman: function(userSpace, targetSpace) {
        // deals 1 damage to the row containing the target
        this.genericDamageRow(userSpace, targetSpace, 1);
    },
    cbSkillSorcerer: function(userSpace, targetSpace) {
        // adds a Magic Crystal spell to the hand
        const player = getPlayer(targetSpace.owner);
        const firstEmpty = player.hand.firstEmpty;
        const magicCrystal = createCard(getFromDB("Magic Crystal"));
        
        player.hand.cardToHand(firstEmpty, magicCrystal);
    },
    cbSkillShadow: function(userSpace, targetSpace) {
        // destroys the target card (in the opponent's hand)
        targetSpace.destroyCard();
    },
    cbSkillSpirit: function(userSpace, targetSpace) {
        // gives the target an extra action (but not an extra move)
        targetSpace.innerCard.currentActions += 1;
    },
    cbSkillBard: function(userSpace, targetSpace) {
        // seals the target for 1 (additional) turn
        this.genericSealTarget(userSpace, targetSpace, 1);
    },
    cbSkillTyrant: function(userSpace, targetSpace) {
        this.genericDamageAll(userSpace, targetSpace, 3);
    },
    // ========== Regular natial active skills ==========
    // Fire natials
    cbSkillDullmdalla: function (targetSpace) {
        // deals 1 damage to the row containing the target
        this.genericDamageRow(userSpace, targetSpace, 1);
    },
    cbSkillXenofiend: function(userSpace, targetSpace) {
        // deals 5 damage to the target
        this.genericDamageTarget(userSpace, targetSpace, 5);
    },
    // Heaven natials
    cbSkillPelitt: function(userSpace, targetSpace) {
        // removes seal from the target
        targetSpace.innerCard.sealed = 0;
    },
    cbSkillGueneFoss: function(userSpace, targetSpace) {
        // deals 2 damage to the target
        this.genericDamageTarget(userSpace, targetSpace, 2);
    },
    cbSkillKyrierBell: function(userSpace, targetSpace) {
        // deals 2 damage to the row containing the target
        this.genericDamageRow(userSpace, targetSpace, 2);
    },
    cbSkillFifenall: function(userSpace, targetSpace) {
        // restores 6 HP to the target
        this.genericHealTarget(userSpace, targetSpace, 6);
    },
    cbSkillRegnaCroix: function(userSpace, targetSpace) {
        // deals 3 damage to thet row containing the target
        this.genericDamageRow(userSpace, targetSpace, 3);
    },
    // Earth natials
    cbSkillDArma: function(userSpace, targetSpace) {
        // restores 2 HP to target
        this.genericHealTarget(userSpace, targetSpace, 2);
    },
    cbSkillGiaBro: function(userSpace, targetSpace) {
        // deals 1 damage to the row containing the target
        this.genericDamageRow(userSpace, targetSpace, 1);
    },
    cbSkillMaGorb: function(userSpace, targetSpace) {
        this.genericSealTarget(userSpace, targetSpace, 2);
    },
    // Water natials
    cbSkillMarme: function(userSpace, targetSpace) {
        // restores 3 HP to the target
        this.genericHealTarget(userSpace, targetSpace, 3);
    },
    cbSkillZamilpen: function(userSpace, targetSpace) {
        // seals the target for 1 (additional) turn
        this.genericSealTarget(userSpace, targetSpace);
    },
    cbSkillNeptjuno: function(userSpace, targetSpace) {
        // deals 2 damage to the target
        this.genericDamageTarget(userSpace, targetSpace, 2);
    },
    cbSkillTentarch: function(userSpace, targetSpace) {
        // deals 4 damage to all enemies
        this.genericDamageAll(userSpace, targetSpace, 4);
    }
}

const recalculateAdjAuraPositions = (prevSpace, newSpace) => {
    const natialZone = getPlayer(prevSpace.owner).natialZone;
    const toRemove = natialZone.getAdjacents(prevSpace);
    const toAdd = natialZone.getAdjacents(newSpace);

    // skip anything that's targeted for both removal and addition
    const toRemoveFinal = toRemove.filter(sp => !toAdd.includes(sp));
    const toAddFinal = toAdd.filter(sp => !toRemove.includes(sp));

    return [toRemoveFinal, toAddFinal];
}

const setAuraFor = (spaces, cbName) => {
    for (let space of spaces) { space.setAura(cbName); }
}

const remAuraFor = (spaces, cbName) => {
    for (let space of spaces) { space.remAura(cbName); }
}

const natialPassiveCallbacks = {
    // callback when the card dies
    onDeath: {
        genericDrawCard: function(deathSpace) {
            getPlayer(deathSpace.owner).drawCard();
        },
        genericRemAuraAdj: function(deathSpace, cbName) {
            const natialZone = getPlayer(deathSpace.owner).natialZone;
            const adj = natialZone.getAdjacents(deathSpace);
            
            remAuraFor(adj, cbName);
        },

        cbPassivePaRancell: function(deathSpace) {
            this.genericRemAuraAdj(deathSpace, "cbPassivePaRancell");
        },
        cbPassiveDaColm: function(deathSpace) {
            const natialZone = getPlayer(deathSpace.owner).natialZone;
            natialZone.forAllSpacesInRow(deathSpace.row, sp => {
                sp.remAura("cbPassiveDaColm");
            }, false);
        },
        cbPassiveRequ: function(deathSpace) {
            this.genericDrawCard(deathSpace);
        },
        cbPassiveTarbyss: function(deathSpace) {
            this.genericDrawCard(deathSpace);
        },
        cbPassiveNeptjuno: function(deathSpace) {
            this.genericRemAuraAdj(deathSpace, "cbPassiveNeptjuno");
        },
        cbPassiveFifenall: function(deathSpace) {
            this.genericDrawCard(deathSpace);
        },
        cbPassiveRegnaCroix: function (deathSpace) {
            const natialZone = getPlayer(deathSpace.owner).natialZone;
            natialZone.forAllSpaces(sp => sp.remAura("cbPassiveRegnaCroix"), false);
        }
    },
    // callback when the card destroys an opposing natial
    onKill: {
        genericBuffAtk: function(attackerSpace, buff) {
            attackerSpace.innerCard.buffAtk(buff);
        },

        cbPassiveSwordsman: function(attackerSpace) {
            // +1 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 1);
        },
        cbPassiveMaGorb: function(attackerSpace) {
            // +1 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 1);
        },
        cbPassiveDullmdalla: function(attackerSpace) {
            // +1 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 1);
        },
        cbPassiveOonvievle: function(attackerSpace) {
            // +1 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 1);
        },
        cbPassiveXenofiend: function(attackerSpace) {
            // +2 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 2);
        },
        cbPassivePelitt: function(attackerSpace) {
            // +2 to Attack when it gets a kill
            this.genericBuffAtk(attackerSpace, 2);
        }
    },
    // callback after the card moves. the cards here with position-based 
    // effects (everything except Amoltamis) do not actually do their effects 
    // here, but rather modify the aura lists of the spaces they affect and 
    // were affecting. the effects themselves are handled in the onAuraEnter 
    // and onAuraLeave hooks.
    // ### could potentially refactor Amoltanis as a self-only aura?
    onMove: {
        genericSetAndRemAuras: function(prevSpace, nextSpace, cbName) {
            const toChange = recalculateAdjAuraPositions(prevSpace, nextSpace);
            remAuraFor(toChange[0], cbName);
            setAuraFor(toChange[1], cbName);
        },

        // auras
        cbPassiveTyrant: function(prevSpace, newSpace) {
            // grant +2 HP/ATK to adjacent spaces
            this.genericSetAndRemAuras(prevSpace, newSpace, "cbPassiveTyrant");
        },
        cbPassivePaRancell: function(prevSpace, newSpace) {
            // grant protection to adjacent spaces
            this.genericSetAndRemAuras(prevSpace, newSpace, "cbPassivePaRancell");
        },
        cbPassiveDaColm: function(prevSpace, newSpace) {
            // grant +1 HP to spaces in the same row
            if (prevSpace.row === newSpace.row) { return; }

            const natialZone = getPlayer(prevSpace.owner).natialZone;
            remAuraFor(natialZone.getRow(prevSpace.row), "cbPassiveDaColm");
            setAuraFor(natialZone.getRow(newSpace.row), "cbPassiveDaColm");

            // here, Da-Colm has "double-dipped" in its own aura, keeping the
            // aura from before it moved and applying the new one on its own
            // space after it moves. the solution is to simply remove one
            // instance of the aura.
            natialPassiveCallbacks.onAuraLeave["cbPassiveDaColm"](newSpace);
        },
        cbPassiveNeptjuno: function(prevSpace, newSpace) {
            // grant protection to adjacent spaces
            this.genericSetAndRemAuras(prevSpace, newSpace, "cbPassiveNeptjuno");
        },

        // the only non-aura effect
        cbPassiveAmoltamis: function(prevSpace, newSpace) {
            // +2 to Attack if on the front row
            if (prevSpace.row === newSpace.row) { return; }
            if (newSpace.row === ROW_FRONT) { newSpace.innerCard.buffAtk(2); }
            else { newSpace.innerCard.buffAtk(-2); }
        }
    },
    // callback when a natial is summoned
    onSummon: {
        genericSetAuraAdj: function(summonSpace, cbName) {
            const natialZone = summonSpace.container;
            const adj = natialZone.getAdjacents(summonSpace);
            
            setAuraFor(adj, cbName);
        },

        // auras
        cbPassivePaRancell: function(summonSpace) {
            this.genericSetAuraAdj(summonSpace, "cbPassivePaRancell");
        },
        cbPassiveDaColm: function(summonSpace) {
            const natialZone = getPlayer(summonSpace.owner).natialZone;
            natialZone.forAllSpacesInRow(summonSpace.row, sp => {
                sp.setAura("cbPassiveDaColm");
            }, false);
        },
        cbPassiveNeptjuno: function(summonSpace) {
            this.genericSetAuraAdj(summonSpace, "cbPassiveNeptjuno");
        },
        cbPassiveRegnaCroix: function(summonSpace) {
            const natialZone = getPlayer(summonSpace.owner).natialZone;
            natialZone.forAllSpaces(sp => sp.setAura("cbPassiveRegnaCroix"), false);
        },
        cbPassiveTyrant: function(summonSpace) {
            this.genericSetAuraAdj(summonSpace, "cbPassiveTyrant");
        },

        // the only non-aura effect
        cbPassiveAmoltamis: function(summonSpace) {
            // +2 to Attack if on the front row
            if (summonSpace.row === ROW_FRONT) {
                summonSpace.innerCard.buffAtk(2);
            }
        }
    },
    // callback when a card enters a space with an aura
    onAuraEnter: {
        cbPassiveTyrant: function(effectSpace) {
            console.log(effectSpace);
            // grant +2 HP/ATK to the effect space
            const card = effectSpace.innerCard;
            card.buffAtk(2);
            card.restoreHP(2);
        },
        cbPassivePaRancell: function(effectSpace) {
            // grant protection to the effect space
            effectSpace.innerCard.protected++;
        },
        cbPassiveDaColm: function(effectSpace) {
            // grant +1 HP to spaces in the same row
            effectSpace.innerCard.restoreHP(1);
        },
        cbPassiveNeptjuno: function(effectSpace) {
            // grant protection to the effect space
            effectSpace.innerCard.protected++;
        },
        cbPassiveRegnaCroix: function(effectSpace) {
            // grant +1 ATK to all Heaven elemental natials
            if (effectSpace.innerCard.element === ELEMENT_HEAVEN) {
                effectSpace.innerCard.buffAtk(1);
            }
        }
    },
    // callback when a card leaves a space with an aura, or when an aura is
    // removed from a space
    onAuraLeave: {
        cbPassiveTyrant: function(effectSpace) {
            // removes the +2 HP/ATK buff; this CAN kill a card
            const card = effectSpace.innerCard;
            card.buffAtk(-2);
            effectSpace.dealDamage(2);
        },
        cbPassivePaRancell: function(effectSpace) {
            // removes protection from the effect space
            effectSpace.innerCard.protected--;
        },
        cbPassiveDaColm: function(effectSpace) {
            // removes the +1 HP buff; this CAN kill a card
            effectSpace.dealDamage(1);
        },
        cbPassiveNeptjuno: function(effectSpace) {
            // remove protection from the effect space
            effectSpace.innerCard.protected--;
        },
        cbPassiveRegnaCroix: function(effectSpace) {
            // removes the +1 ATK buff from all Heaven elemental natials
            if (effectSpace.innerCard.element === ELEMENT_HEAVEN) {
                effectSpace.innerCard.buffAtk(-1);
            }
        }
    },
    // callback when the card takes damage
    onDamageTaken: {
        cbPassiveSpirit: function(damagedSpace, dmg) {
            // permanent +1 HP/ATK to all allies when falling below 10 HP. 
            // this effect can trigger repeatedly if Spirit falls below 10 HP
            // repeatedly.
            const curHP = damagedSpace.innerCard.curHP;
            const prevHP = curHP + dmg;

            if (prevHP >= 10 && curHP < 10) {
                const player = getPlayer(damagedSpace.owner);
                player.natialZone.forAllCards(card => {
                    card.restoreHP(1);
                    card.buffAtk(1);
                });
            }
        }
    },
    // callback when the card owner's turn ends
    onTurnEnd: {
        cbPassivePaladin: function(paladinSpace) {
            // restores 1 HP for the Paladin
            paladinSpace.innerCard.restoreHP(1);
        }
    }
}