// returns the prototype of cardName from the database, or false if cardName is not found
const getFromDB = (cardName) => {
    const thisCard = cardDB.filter(card => card.name === cardName);
    if (thisCard.length) { return thisCard[0]; }
    else { return false; }
}

// returns a new copy of the card object indicated by cardPrototype
const createCard = (cardPrototype) => {
    const newCard = (cardPrototype.type === "natial" ?
                    new cardNatial(cardPrototype) :
                    new cardSpell(cardPrototype));

    return newCard;
}

// takes an ELEMENT_ constant and returns a string with the element's name
const getElementName = (element) => {
    switch(element) {
        case ELEMENT_FIRE:
            return "Fire";
        case ELEMENT_HEAVEN:
            return "Heaven";
        case ELEMENT_EARTH:
            return "Earth";
        case ELEMENT_WATER:
            return "Water";
        case ELEMENT_NONE:
            return "None";
        default:
            return "Error getting element name";
    }
}

// re-renders all cards in the specified player's hand.
const renderHand = (player) => {
    hands[player].forEach(space => space.renderCard());
}

// re-renders all cards in both of the specified player's natial zones. as
// above, forEach will not work here.
const renderNatials = (player) => {
    natials[player][ROW_FRONT].forEach(space => space.renderCard());
    natials[player][ROW_BACK].forEach(space => space.renderCard());
}

// renders the mana display for the specified player
const renderMana = (player) => {
    const playerStr = (player === PLAYER_FRIENDLY ? "friendly" : "enemy");
    const manaDOM = document.getElementById(`${playerStr}-portrait`);

    manaDOM.innerText = `${currentMana[player]}/${maxMana[player]}`;
}

// displays the current turn
const renderTurnCounter = () => {
    const turnDOM = document.getElementById("misc-container");

    turnDOM.innerText = Math.ceil(turnCounter);
}

// re-renders everything on the game screen that isn't guaranteed to be static
const renderAll = () => {
    for (player of [PLAYER_FRIENDLY, PLAYER_ENEMY]) {
        renderHand(player);
        renderNatials(player);
        renderMana(player);
    }

    renderTurnCounter();
}

// checks if either player has met the victory condition. returns true if the
// game ends and false if it does not. the game-ending code right now is VERY
// rudimentary, but will work for a MVP. it will be significantly expanded on.
const checkVictory = () => {
    let friendlyHP = masters[PLAYER_FRIENDLY].currentHP;
    let enemyHP = masters[PLAYER_ENEMY].currentHP;

    if (friendlyHP <= 0 && enemyHP <= 0) {
        console.log("it's a draw!");
        playerCanInteract = false;
    }
    else if (friendlyHP <= 0) {
        console.log("computer wins!");
        playerCanInteract = false;
    }
    else if (enemyHP <= 0) {
        console.log("you win!");
        playerCanInteract = false;
    }
    else {
        return false;
    }

    gameEnd = true;
    document.getElementById("end-turn").disabled = true;
    return true;
}