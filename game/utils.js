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

// renders the card currently controlled by player in zone's position'th place
const renderCard = (player, zone, position) => {
    const thisCard = (zone === ZONE_HAND ? hands[player][position] : natials[player][zone][position]);

    // parse parameters to access the correct DOM element on the game board
    const playerIsEnemy = (player === PLAYER_ENEMY);
    const playerStr = (playerIsEnemy ? "enemy" : "friendly");
    const zoneStr = (zone === ZONE_HAND ? "hand" : `${zone === ZONE_NATIAL_FRONT ? "front" : "back"}`);
    const thisTileID = `#${playerStr}-${zoneStr}-${position}`;
    const thisBoardSpaceDOM = document.querySelector(thisTileID);

    // set everything properly on the card DOM...
    if (!thisCard) { // there isn't actually a card in this spot
        thisBoardSpaceDOM.innerText = `${zoneStr} ${position}`;
        thisBoardSpaceDOM.setAttribute("draggable", false);
        thisBoardSpaceDOM.content = null;
    } else { // eventually, the card will render something pretty instead of text
        const cardStr = `${playerIsEnemy ? "??? " : ""}${thisCard.name}
        Element: ${getElementName(thisCard.element)}
        HP: ${thisCard.currentHP}/${thisCard.maxHP}
        ATK: ${thisCard.attack}
        Cost: ${thisCard.cost}
        ${thisCard.isRanged ? "R" : ""}${thisCard.isQuick ? "Q" : ""}
        `;

        thisBoardSpaceDOM.owner = player;
        thisBoardSpaceDOM.content = thisCard;
        thisBoardSpaceDOM.innerText = cardStr;
        
        if (!playerIsEnemy) { setDraggable(thisBoardSpaceDOM); }
    }
}

// re-renders all cards in the specified player's hand. we cannot use forEach
// here, because we want the empty places to be rendered correctly as well.
const renderHand = (player) => {
    for(let i = 0; i < HAND_SIZE_LIMIT; i++) {
        renderCard(player, ZONE_HAND, i);
    }
}

// re-renders all cards in both of the specified player's natial zones. as
// above, forEach will not work here.
const renderNatials = (player) => {
    for(let i = 0; i < NATIAL_FRONT_CAPACITY; i++) {
        renderCard(player, ZONE_NATIAL_FRONT, i);
    }

    for(let i = 0; i < NATIAL_BACK_CAPACITY; i++) {
        renderCard(player, ZONE_NATIAL_BACK, i);
    }
}