const restoreHP = (card, amount) => {
    card.currentHP = Math.min(card.currentHP + amount, card.maxHP);
}

const buffAtk = (card, amount) => {
    card.attack = Math.max(card.attack + amount, 0);
}

const spellCallbacks = {
    cbSpellMagicCrystal: function (targetSpace) {
        // heals target by 1 HP, grants it +1 ATK, and allows it to use its
        // skill again; also grants the player +1 current mana, which can
        // temporarily exceed their current maximum mana.
        const targetCard = targetSpace.card;

        restoreHP(targetCard, 1);
        buffAtk(targetCard, 1);
        // refresh natial skill - not yet implemented
        currentMana[targetSpace.owner]++;
    },
    cbSpellMedic: function(targetSpace) {
        // heals target by 2 HP and removes seal; if target is Heaven element,
        // also grants it +1 ATK.
        const targetCard = targetSpace.card;

        restoreHP(targetCard, 2);
        targetCard.sealed = 0;
        if (targetCard.element === ELEMENT_HEAVEN) {
            buffAtk(targetCard, 1);
        }
    },
    cbSpellTransmute: function(targetSpace) {

    },
    cbSpellVanish: function(targetSpace) {

    },
    cbSpellUptide: function() {

    },
    cbSpellBlaze: function(targetSpace) {
        // grants the target natial +2 ATK, or +3 if it's Fire elemental
        const targetCard = targetSpace.card;

        buffAtk(targetCard, targetCard.element === ELEMENT_FIRE ? 3 : 2);
    },
    cbSpellWall: function(targetSpace) {
        // places a barrier on the target that negates damage once, and heals 2
        // HP if the target is Earth elemental
        const targetCard = targetSpace.card;

        targetCard.shielded++;
        if (targetCard.element === ELEMENT_EARTH) { restoreHP(targetCard, 2); }
    },
    cbSpellExpel: function(targetSpace) {

    },
    cbSpellReduce: function(targetSpace) {

    },
    cbSpellDisaster: function(targetSpace) {

    }
};