// returns the prototype of cardName from the database, or false if cardName is not found
const getFromDB = (cardName) => {
    const thisCard = cardDB.filter(card => card.name === cardName);
    if (thisCard.length) { return thisCard[0]; }
    else { return false; }
}

// returns a new copy of the card object indicated by cardPrototype
const createCard = (cardPrototype) => {
    const newCard = Object.create(cardPrototype);
    newCard.element = eval(newCard.element); // here to let cardDB use the
                                             // ELEMENT_ consts for consistency

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

    manaDOM.innerText = `${maxMana[player]}/${currentMana[player]}`;
}

// re-renders everything on the board that isn't guaranteed to be static
const renderBoard = () => {
    for (player of [PLAYER_FRIENDLY, PLAYER_ENEMY]) {
        renderHand(player);
        renderNatials(player);
        renderMana(player);
    }
}