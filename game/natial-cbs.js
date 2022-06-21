const natialActiveCallbacks = {
    cbSkillSister: function(targetSpace) {
        // heals the target for 2 HP
        const targetCard = targetSpace.innerCard;

        restoreHP(targetCard, 2);
    },
    cbSkillKnight: function() {

    },
    cbSkillThief: function() {

    },
    cbSkillWitch: function(targetSpace) {

    },
    cbSkillPaladin: function() {

    },
    cbSkillBeast: function() {

    },
    cbSkillSwordsman: function(targetSpace) {

    },
    cbSkillSorceror: function() {

    },
    cbSkillShadow: function() {

    },
    cbSkillSpirit: function(targetSpace) {

    },
    cbSkillBard: function(targetSpace) {

    },
    cbSkillTyrant: function() {

    }
}

const natialPassiveCallbacks = {

}