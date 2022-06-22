const getPlayer = (player) => {
    switch (player) {
        case PLAYER_FRIENDLY: return friendlyPlayer;
        case PLAYER_ENEMY: return enemyPlayer;
        default: return null;
    }
}

// returns the prototype of cardName from the database, or false if cardName is not found
const getFromDB = (cardName) => {
    const thisCard = cardDB.filter(card => card.name === cardName);
    if (thisCard.length) { return thisCard[0]; }
    else { return false; }
}

// returns a new copy of the card object indicated by cardPrototype
const createCard = (cardPrototype) => {
    const newCard = (cardPrototype.type === "natial" ?
                    new NatialCard(cardPrototype) :
                    new SpellCard(cardPrototype));

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
    getPlayer(player).hand.forEach(space => space.renderCard());
}

// re-renders all cards in both of the specified player's natial zones. as
// above, forEach will not work here.
const renderNatials = (player) => {
    natials[player][ROW_FRONT].forEach(space => space.renderCard());
    natials[player][ROW_BACK].forEach(space => space.renderCard());
}

// displays the current turn
const renderTurnCounter = () => {
    const turnDOM = document.getElementById("misc-container");

    turnDOM.innerText = Math.ceil(turnCounter);
}