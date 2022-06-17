// ** important disambiguation: at all points in this file, "friendly" refers
// to the player's side of the board, and "enemy" refers to the computer's side
// of the board.

// looks for all valid places to move or place an enemy card.
// returns an array of [row, index] pairs if any exist, or false otherwise
const aiFindEmptySpaces = () => {
    const emptySpaces = [];

    natials[PLAYER_ENEMY].forEach((rowArray, rowIndex) => {
        rowArray.forEach((space, spaceIndex) => {
            if (!space.card) { emptySpaces.push([rowIndex, spaceIndex]); }
        });
    });

    if (emptySpaces.length) { return emptySpaces; }
    else { return false; }
}

// looks for all natials for a specified player, returning an array of
// [row, index] pairs. note that at least one natial for each player -- the
// deck master -- has to exist at all times.
const aiFindNatials = (player) => {
    const foundNatials = [];

    natials[player].forEach((rowArray, rowIndex) => {
        rowArray.forEach((space, spaceIndex) => {
            if (space.card) { foundNatials.push([rowIndex, spaceIndex]); }
        });
    });

    if (!foundNatials.length) { alert("Logic error reached in ai.js/findNatials -- no natials found on the board"); }
    return foundNatials;
}

// summons as many natials from the hand as possible
const aiSummonNatials = () => {
    const emptySpaces = aiFindEmptySpaces();
    hands[PLAYER_ENEMY].forEach((space, index) => {
        if (emptySpaces.length && space.card) {
            const thisEmptySpace = emptySpaces.pop();
            const emptyRow = thisEmptySpace[0];
            const emptyIndex = thisEmptySpace[1];

            space.summonNatial(natials[PLAYER_ENEMY][emptyRow][emptyIndex]);
            console.log("Hand card", index, "summoned to", thisEmptySpace);
        }
    });
}

// attacks with as many natials as possible
const aiAttack = () => {
    const attackers = aiFindNatials(PLAYER_ENEMY).map(pos => {
        return natials[PLAYER_ENEMY][pos[0]][pos[1]];
    });
    const attackTargets = aiFindNatials(PLAYER_FRIENDLY).map(pos => {
        return natials[PLAYER_FRIENDLY][pos[0]][pos[1]];
    });

    while(attackers.length && attackTargets.length) {
        // each natial can only attack once...
        const attackerSpace = attackers.pop();
        // .. but each natial can BE attacked more than once, so this can't pop
        const attackTargetSpace = attackTargets[0];

        console.log("Attacking!")
        attackerSpace.attackNatial(attackTargetSpace);
        if (!attackTargetSpace.card) { attackTargets.shift(); }
    }

    console.log("finished attacking!");
}

// lets the AI take its turn
const aiTurn = () => {
    aiSummonNatials();
    aiAttack();
    enemyEndTurn();
}