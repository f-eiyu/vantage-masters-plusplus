
const spellCallbacks = {
    cbSpellMagicCrystal: function (targetSpace) {

    },
    cbSpellMedic: function(targetSpace) {
        const targetCard = targetSpace.card;
        targetCard.currentHP = Math.min(targetCard.currentHP + 2, targetCard.maxHP);
        targetCard.sealed = 0;
        if (targetCard.element === ELEMENT_HEAVEN) { targetCard.attack++; }
    },
    cbSpellTransmute: function(targetSpace) {

    },
    cbSpellVanish: function(targetSpace) {

    },
    cbSpellUptide: function() {

    },
    cbSpellBlaze: function(targetSpace) {

    },
    cbSpellWall: function(targetSpace) {

    },
    cbSpellExpel: function(targetSpace) {

    },
    cbSpellReduce: function(targetSpace) {

    },
    cbSpellDisaster: function(targetSpace) {

    }
};