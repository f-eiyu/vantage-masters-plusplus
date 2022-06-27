// ** important disambiguation: at all points in this file, "friendly" refers
// to the player's side of the board, and "enemy" refers to the computer's side
// of the board.

// looks for all valid places to move or place an enemy card.
// returns an array of [row, index] pairs if any exist, or false otherwise
const aiVerbose = true;

const aiThinkingTime = (lower = 200, upper = 700) => {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

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
    let summonTime = aiThinkingTime();
    toSummon.forEach((toSummonSpace, i) => {
        // halt if no empty spaces on board
        if (!emptyNatialSpaces.length) { return; }

        const thisEmptySpace = emptyNatialSpaces[0];

        setTimeout(() => {
            if (!game.validateSummon(toSummonSpace, thisEmptySpace)) { return false; }
            game.summonNatial(toSummonSpace, thisEmptySpace);
        }, summonTime);
        emptyNatialSpaces.shift();

        summonTime += game.fadeoutTime + game.fadeinTime + aiThinkingTime();
    });

    return summonTime;
}

// attacks with as many natials as possible
const aiAttack = () => {
    const attackers = aiFindNatials(enemyPlayer);
    const attackTargets = aiFindNatials(friendlyPlayer);

    console.log(attackers);
    console.log(attackTargets);

    let attackTime = aiThinkingTime();
    while (attackers.length && attackTargets.length && !gameEnd) {
        // each natial attacks once
        const attackerSpace = attackers.shift();

        setTimeout(() => {
            if (!attackTargets.length)  { return; }
            let targetSpace = attackTargets[0];
            while (!targetSpace.hasCard) {
                attackTargets.shift();
                targetSpace = attackTargets[0];
            }

            // perform an attack if possible
            if (!game.validateAttack(attackerSpace, targetSpace)) { return; }

            game.attackNatial(attackerSpace, targetSpace);
            // remove target from attackTargets if destroyed
            // if (!targetSpace.hasCard) { attackTargets.shift(); }
        }, attackTime);

        attackTime += 2 * game.attackTime + aiThinkingTime();
    }

    return attackTime;
}

// lets the AI take its turn
const aiTurn = () => {
    let summonTime = 0;
    let attackTime = 0;
    
    summonTime = aiSummonNatials();
    setTimeout(() => {
        attackTime = aiAttack();
        setTimeout(enemyEndTurn, attackTime + 1000);
    }, summonTime);
}