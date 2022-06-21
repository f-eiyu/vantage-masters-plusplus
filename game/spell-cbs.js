const spellCallbacks = {
    cbSpellMagicCrystal: function(targetSpace) {
        // heals target by 1 HP, grants it +1 ATK, and allows it to use its
        // skill again; also grants the player +1 current mana, which can
        // temporarily exceed their current maximum mana.
        const targetCard = targetSpace.innerCard;

        targetCard.restoreHP(1);
        targetCard.buffAtk(1);
        // refresh natial skill - not yet implemented
        currentMana[targetSpace.owner]++;
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
        targetSpace.innerCard.sealed += 2;
        // the Witch master does not exist yet, so this card's 3-turn sealing
        // functionality is not implemented yet either
    },
    cbSpellVanish: function(targetSpace) {
        // deals 6 damage to the target card, or 7 if the user's master is
        // Paladin
        targetSpace.dealDamageToContainedCard(6);
        // the Paladin master does not exist yet, so this card's bonus damage
        // functionality is not implemented yet either
    },
    cbSpellUptide: function() {
        // all Water elemental natials gain +1 HP and ATK; all Earth, Fire,
        // and Heaven elemental Natials take 1 damage. this is a board-wide
        // effecft, and so no explicit target is defined or needed.

        // this code is actually awful, and is one reason i need to refactor
        // the board to be its own object...
        natials.forEach(player => {
            player.forEach(row => {
                row.forEach(natialSpace => {
                    const thisCard = natialSpace.innerCard;
                    // uptide's effect skips masters, who do not have an element
                    if (!thisCard || thisCard.isMaster) { return; }

                    if (thisCard.element === ELEMENT_WATER) {
                        thisCard.restoreHP(1);
                        thisCard.buffAtk(1);
                    } else {
                        natialSpace.dealDamageToInnerCard(1);
                    }
                });
            });
        });
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
        const oppOwner = targetSpace.owner;

        // determine the card owner's first free hand space. functions like this
        // are a very good case for REFACTORING MY DAMN CODE TO USE BOARD AND
        // HAND OBJECTS instead of coding one-offs like a caveman.
        // this is also not DRY with games.js > drawCard > getFirstEmpty!
        const freeIndex = hands[oppOwner].reduce((firstEmpty, handSpace) => {
            return (!handSpace.innerCard && handSpace.index < firstEmpty ? handSpace.index : firstEmpty);
        }, Infinity);

        // return card to deck if no free hand
        if (freeIndex > HAND_SIZE_LIMIT - 1) {
            decks[oppOwner].push(targetSpace.innerCard);
        }
        // otherwise, return the card to the hand
        else {
            hands[oppOwner][freeIndex].innerCard = targetSpace.innerCard;
        }

        targetSpace.innerCard = null;
    },
    cbSpellReduce: function(targetSpace) {
        // halves the mana cost of the targeted card, rounded down
        targetSpace.innerCard.cost = Math.floor(targetSpace.innerCard.cost / 2);
    },
    cbSpellDisaster: function(targetSpace) {
        // deals 4 damage to every card in the same row as the target
        const thisRow = targetSpace.isFrontRow ? ROW_FRONT : ROW_BACK;

        natials[targetSpace.owner][thisRow].forEach(natialSpace => {
            if (!natialSpace.hasCard) { return; }

            natialSpace.dealDamageToInnerCard(4);
        });
    }
};