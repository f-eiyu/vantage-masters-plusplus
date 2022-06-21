// ** important disambiguation: at all points in this file, "friendly" refers
// to the player's side of the board, and "enemy" refers to the computer's side
// of the board.

// looks for all valid places to move or place an enemy card.
// returns an array of [row, index] pairs if any exist, or false otherwise
const aiVerbose = true;

const aiFindEmptySpaces = () => {
    const emptySpaces = [];

    natials[PLAYER_ENEMY].forEach((rowArray, rowIndex) => {
        rowArray.forEach((space, spaceIndex) => {
            if (!space.hasCard) { emptySpaces.push([rowIndex, spaceIndex]); }
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
            if (space.hasCard) { foundNatials.push([rowIndex, spaceIndex]); }
        });
    });

    if (!foundNatials.length && aiVerbose) { alert("Logic error reached in ai.js/findNatials -- no natials found on the board"); }
    return foundNatials;
}

// summons as many natials from the hand as possible
const aiSummonNatials = () => {
    const emptyNatialSpaces = aiFindEmptySpaces();

    // halt if no space to summon
    if (!emptyNatialSpaces.length) { return false; }

    // ignore empty hand spaces and play everything that we can
    hands[PLAYER_ENEMY].filter(sp => sp.innerCard).forEach((thisHandSpace, i) => {
        // halt if card is a spell (we're not smart enough for that yet)
        if (thisHandSpace.innerCard.type === "spell") { return false; }

        const thisEmptySpace = emptyNatialSpaces[0];
        const emptyRow = thisEmptySpace[0];
        const emptyIndex = thisEmptySpace[1];

        const targetSpace = natials[PLAYER_ENEMY][emptyRow][emptyIndex];

        if (emptyNatialSpaces.length && thisHandSpace.checkSummonPossible(targetSpace)) {
            thisHandSpace.summonNatial(targetSpace);
            emptyNatialSpaces.shift();
            if (aiVerbose) {
                console.log("Hand card", i, "summoned to", thisEmptySpace);
            }
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

    while(attackers.length && attackTargets.length && !gameEnd) {
        // each natial can only attack once...
        const attackerSpace = attackers.pop();
        // .. but each natial can BE attacked more than once, so this can't pop
        const attackTargetSpace = attackTargets[0];

        // perform an attack, if possible
        if (attackerSpace.checkAttackPossible(attackTargetSpace)) {
            if (aiVerbose) {
                console.log("Attacking", attackTargetSpace.innerCard.name, "with", attackerSpace.innerCard.name);
                const calcedDmg = attackerSpace.calculateDamage(attackTargetSpace);
                console.log("Expected damage done:", calcedDmg[0]);
                console.log("Expected damage countered:", calcedDmg[1]);
            }
            attackerSpace.attackNatial(attackTargetSpace);
            if (aiVerbose) { console.log("Attack resolved."); }
            if (!attackTargetSpace.hasCard) { 
                if (aiVerbose) { console.log("Target destroyed."); }
                attackTargets.shift();
            }
        }
    }

    console.log("Finished attacking!");
}

// lets the AI take its turn
const aiTurn = () => {
    aiSummonNatials();
    aiAttack();
    enemyEndTurn();
}