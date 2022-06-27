const spellValidators = {
    // ========== Generic validators ==========
    validateBuffGeneric: function(spellSpace, targetSpace) {
        // fail if trying to use on an opponent
        if (spellSpace.owner !== targetSpace.owner) { return false; }
        // fail if target space is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if not targeting the natial zone
        if (!targetSpace.isNatial) { return false; }

        return true;
    },
    validateOffensiveGeneric: function(spellSpace, targetSpace) {
        // fail if trying to use on a friendly
        if (spellSpace.owner === targetSpace.owner) { return false; }
        // fail if the target space is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if not targeting the natial zone
        if (!targetSpace.isNatial) { return false; }

        return true;
    },

    // ========== Specific spell validators ==========
    cbSpellMagicCrystal: function(spellSpace, targetSpace) {
        return this.validateBuffGeneric(spellSpace, targetSpace);
    },
    cbSpellMedic: function(spellSpace, targetSpace) {
        return this.validateBuffGeneric(spellSpace, targetSpace);
    },
    cbSpellTransmute: function(spellSpace, targetSpace) {
        return this.validateOffensiveGeneric(spellSpace, targetSpace);
    },
    cbSpellVanish: function(spellSpace, targetSpace) {
        return this.validateOffensiveGeneric(spellSpace, targetSpace);
    },
    cbSpellUptide: function(spellSpace, targetSpace) {
        // fail only if not targeting a natial space
        if (!targetSpace.isNatial) { return false; }

        return true;
    },
    cbSpellBlaze: function(spellSpace, targetSpace) {
        return this.validateBuffGeneric(spellSpace, targetSpace);
    },
    cbSpellWall: function(spellSpace, targetSpace) {
        return this.validateBuffGeneric(spellSpace, targetSpace);
    },
    cbSpellExpel: function(spellSpace, targetSpace) {
        // perform regular offensive validation, but also fail if the target
        // is a master -- expel cannot bounce a master back to the hand
        return (this.validateOffensiveGeneric(spellSpace, targetSpace)
                && !targetSpace.innerCard.isMaster);
    },
    cbSpellReduce: function(spellSpace, targetSpace) {
        // fail if trying to use on an opponent
        if (spellSpace.owner !== targetSpace.owner) { return false; }
        // fail if target space is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if not targeting the hand
        if (!targetSpace.isHand) { return false; }
        // fail if the targeted card costs no mana
        if (targetSpace.innerCard.cost <= 0) { return false; }

        return true;
    },
    cbSpellDisaster: function(spellSpace, targetSpace) {
        return this.validateOffensiveGeneric(spellSpace, targetSpace);
    }
}

const spellCallbacks = {
    cbSpellMagicCrystal: function(targetSpace) {
        // heals target by 1 HP, grants it +1 ATK, and allows it to use its
        // skill again; also grants the player +1 current mana, which can
        // temporarily exceed their current maximum mana.
        const targetCard = targetSpace.innerCard;
        const player = getPlayer(targetSpace.owner);

        targetCard.restoreHP(1);
        targetCard.buffAtk(1);
        if (targetCard.hasSkill) { targetCard.skillReady = true; }
        player.currentMana++;
    },
    cbSpellMedic: function(targetSpace) {
        // heals target by 2 HP and removes seal; if target is Heaven element,
        // also grants it +1 ATK.
        const targetCard = targetSpace.innerCard;

        targetCard.restoreHP(2);
        targetCard.sealed = 0;
        if (targetCard.element === ELEMENT_HEAVEN) {
            buffAtk(targetCard, 1);
        }
    },
    cbSpellTransmute: function(targetSpace) {
        // seals the target card for 2 (more) turns, or 3 if the user's master
        // is Witch
        const masterName = (targetSpace.owner === PLAYER_FRIENDLY ? enemyPlayer : friendlyPlayer).master.name;
        if (masterName === "Witch")
        {
            targetSpace.innerCard.sealed += 3;
        } else {
            targetSpace.innerCard.sealed += 2;
        }
    },
    cbSpellVanish: function(targetSpace) {
        // deals 6 damage to the target card, or 7 if the user's master is
        // Paladin
        const masterName = (targetSpace.owner === PLAYER_FRIENDLY ? enemyPlayer : friendlyPlayer).master.name;
        if (masterName === "Paladin")
        {
            targetSpace.dealDamage(7);
        } else {
            targetSpace.dealDamage(6);
        }

        // the Paladin master does not exist yet, so this card's bonus damage
        // functionality is not implemented yet either
    },
    cbSpellUptide: function() {
        // all Water elemental natials gain +1 HP and ATK; all Earth, Fire,
        // and Heaven elemental Natials take 1 damage. this is a board-wide
        // effect, and so no explicit target is defined or needed.
        const uptideEffect = (sp) => {
            const thisCard = sp.innerCard;
            // uptide's effect skips masters, who do not have an element
            if (thisCard.isMaster) { return; }

            if (thisCard.element === ELEMENT_WATER) {
                thisCard.restoreHP(1);
                thisCard.buffAtk(1);
            } else {
                sp.dealDamage(1);
            }
        }

        friendlyPlayer.natialZone.forAllSpaces(sp => uptideEffect(sp));
        enemyPlayer.natialZone.forAllSpaces(sp => uptideEffect(sp));
    },
    cbSpellBlaze: function(targetSpace) {
        // grants the target natial +2 ATK, or +3 if it's Fire elemental
        const targetCard = targetSpace.innerCard;

        targetCard.buffAtk(targetCard.element === ELEMENT_FIRE ? 3 : 2);
    },
    cbSpellWall: function(targetSpace) {
        // places a barrier on the target that negates damage once, and heals 2
        // HP if the target is Earth elemental
        const targetCard = targetSpace.innerCard;

        targetCard.shielded++;
        if (targetCard.element === ELEMENT_EARTH) { targetCard.restoreHP(2); }
    },
    cbSpellExpel: function(targetSpace) {
        // returns the target card to the opponent's hand, or to the top of
        // their deck if the hand is full
        const oppPlayer = getPlayer(targetSpace.owner);
        const freeIndex = oppPlayer.hand.firstEmpty;
        if (freeIndex === HAND_SIZE_LIMIT) {
            // hand totally full; return card to top of deck
            oppPlayer.deck.push()
        } else {
            // return card to first free hand space
            oppPlayer.hand.cardToHand(freeIndex, targetSpace.innerCard);
        }

        targetSpace._clear();
    },
    cbSpellReduce: function(targetSpace) {
        // halves the mana cost of the targeted card, rounded down
        targetSpace.innerCard.cost = Math.floor(targetSpace.innerCard.cost / 2);
    },
    cbSpellDisaster: function(targetSpace) {
        // deals 4 damage to every card in the same row as the target
        const player = getPlayer(targetSpace.owner);
        const thisRow = targetSpace.row;
        player.natialZone.forAllSpacesInRow(thisRow, (space, i) => {
            space.dealDamage(4);
        });
    }
};

const spellDragValidation = (dragFromSpace, dragToSpace) => {
    // sanity check
    if (!dragFromSpace.isHand) {
        alert("Error! Spell in natial zone!");
        return false;
    }

    // always fail if insufficient mana
    const player = getPlayer(dragFromSpace.owner);
    if (dragFromSpace.innerCard.cost > player.currentMana) { return false; }

    // validate the drag location based on the spell
    const cbName = dragFromSpace.innerCard.callbackName;
    return spellValidators[cbName](dragFromSpace, dragToSpace);
}