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

// gives click and drag functionality to a card on the board
const setPlayable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", event => event.target.classList.add("dragging"));
    thisCardDOM.addEventListener("dragend", event => event.target.classList.remove("dragging"));
}

// renders the card currently controlled by player in zone's position'th place
const renderCard = (thisCard, player, zone, position) => {
    // parse parameters to access the correct DOM element on the game board
    const playerIsEnemy = (player === PLAYER_ENEMY);
    const playerStr = (playerIsEnemy ? "enemy" : "friendly");
    const zoneStr = (zone === ZONE_HAND ? "hand" : `${zone === ZONE_NATIAL_FRONT ? "front" : "back"}`);
    const thisTileID = `#${playerStr}-${zoneStr}-${position}`;
    const thisTileDOM = document.querySelector(thisTileID);
    
    // create a card DOM based on the card object to place inside thisTileDOM
    const thisCardDOM = document.createElement("div");
    thisCardDOM.classList.add("live-card");

    // set everything properly on the card DOM...
    if (thisCard === undefined) { // there isn't actually a card in this spot
        thisCardDOM.innerText = `${zoneStr} ${position}`;
        thisCardDOM.setAttribute("draggable", false);
    } else { // eventually, the card will render something pretty instead of text
        const cardStr = `${playerIsEnemy ? "??? " : ""}${thisCard.name}
        Element: ${getElementName(thisCard.element)}
        HP: ${thisCard.currentHP}/${thisCard.maxHP}
        ATK: ${thisCard.attack}
        Cost: ${thisCard.cost}
        ${thisCard.isRanged ? "R" : ""}${thisCard.isQuick ? "Q" : ""}
        `;

        thisCardDOM.innerText = cardStr;
        if (!playerIsEnemy) { setPlayable(thisCardDOM); }
    }

    // ... and finally, display the card!
    thisTileDOM.appendChild(thisCardDOM);
}

const renderHand = (player) => {
    hands[player].forEach((card, index) => renderCard(card, player, ZONE_HAND, index));
}

const renderNatialZone = (player) => {
    natials[player][ROW_FRONT].forEach((card, index) => {
        renderCard(card, player, ZONE_NATIAL_FRONT, index);
    });

    natials[player][ROW_BACK].forEach((card, index) => {
        renderCard(card, player, ZONE_NATIAL_BACK, index);
    });
}