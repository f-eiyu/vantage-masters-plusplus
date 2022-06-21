const natialActiveCallbacks = {
    cbSkillSister: function(targetSpace) {
        // heals the target for 2 HP
        const targetCard = targetSpace.card;
        
        restoreHP(targetCard, 2);
    },
}

const natialPassiveCallbacks = {

}