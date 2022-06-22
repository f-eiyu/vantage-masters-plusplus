// ** important disambiguation: at all points in this file, "friendly" refers
// to the player's side of the board, and "enemy" refers to the computer's side
// of the board.

// looks for all valid places to move or place an enemy card.
// returns an array of [row, index] pairs if any exist, or false otherwise
const aiVerbose = true;

const aiFindEmptySpaces = () => {
    return enemyPlayer.natialZone.empty;
}

const aiFindNatials = (player) => {
    return player.natialZone.nonEmpty;
}

// summons as many natials from the hand as possible
const aiSummonNatials = () => {
    const emptyNatialSpaces = aiFindEmptySpaces();

    // halt if no space to summon
    if (!emptyNatialSpaces.length) { return false; }

    // play as many natials from the hand as possible
    // (we're not smart enough to handle spells yet)
    const toSummon = enemyPlayer.hand.nonEmpty.filter(sp => sp.innerCard.type !== "spell");
    toSummon.forEach((toSummonSpace, i) => {
        // halt if no empty spaces on board
        if (!emptyNatialSpaces.length) { return; }

        const thisEmptySpace = emptyNatialSpaces[0];
        if (!game.validateSummon(toSummonSpace, thisEmptySpace)) { return false; }

        game.summonNatial(toSummonSpace, thisEmptySpace);
        emptyNatialSpaces.shift();
        if (aiVerbose) {
            console.log("AI: Hand card", i, "summoned to", thisEmptySpace.row, thisEmptySpace.index);
        }
    });
}

// attacks with as many natials as possible
const aiAttack = () => {
    const attackers = aiFindNatials(enemyPlayer);
    const attackTargets = aiFindNatials(friendlyPlayer);

    console.log(attackers);
    console.log(attackTargets);

    while (attackers.length && attackTargets.length && !gameEnd) {
        // each natial attacks once
        const attackerSpace = attackers.pop();
        // each target can be attacked more than once, so don't pop here
        const targetSpace = attackTargets[0];

        // perform an attack if possible
        if (!game.validateAttack(attackerSpace, targetSpace)) { continue; }
        game.attackNatial(attackerSpace, targetSpace);
        if (aiVerbose) {
            console.log("AI: Attacking", targetSpace.innerCard.name, "with", attackerSpace.innerCard.name);
            const calcedDmg = game.calculateDamage(attackerSpace, targetSpace);
            console.log("    Damage done:", calcedDmg[0]);
            console.log("    Damage countered:", calcedDmg[1]);
        }
        // remove target from attackTargets if destroyed
        if (!targetSpace.hasCard) { 
            if (aiVerbose) { console.log("Target destroyed."); }
            attackTargets.shift();
        }
    }
    if (aiVerbose) { console.log("Finished attacking."); }
}

// lets the AI take its turn
const aiTurn = () => {
    aiSummonNatials();
    aiAttack();
    enemyEndTurn();
}