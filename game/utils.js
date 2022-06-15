// gives click and drag functionality to a card on the board
const setPlayable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", event => event.target.classList.add("dragging"));
    thisCardDOM.addEventListener("dragend", event => event.target.classList.remove("dragging"));
}

// renders the card currently controlled by player in zone's position'th place
const renderCard = (player, zone, position) => {
    // parse parameters to access the correct DOM element on the game board
    const playerIsEnemy = (player === PLAYER_ENEMY);
    const playerStr = (playerIsEnemy ? "enemy" : "friendly");
    const zoneStr = (zone === ZONE_HAND ? "hand" : `${zone === ZONE_NATIAL_FRONT ? "front" : "back"}`);
    const thisTileID = `#${playerStr}-${zoneStr}-${position}`;
    const thisTileDOM = document.querySelector(thisTileID);

    // pull the card object from the appropriate hand/natial array
    const thisCard = (zone === ZONE_HAND ?
                      hands[player][position] :
                      natials[player][zone === ZONE_NATIAL_FRONT ? ROW_FRONT : ROW_BACK][position]);


    console.log(playerStr, zoneStr, position, thisCard);
    
    // create a card DOM based on the card object to place inside thisTileDOM
    const thisCardDOM = document.createElement("div");

    // set everything properly on the card DOM...
    if (thisCard === undefined) { // there isn't actually a card in this spot
        thisCardDOM.innerText = `${zoneStr} ${position}`;
        thisCardDOM.setAttribute("draggable", false);
    } else { // eventually, the card will render something pretty instead of text
        const cardStr = `${playerIsEnemy ? "??? " : ""}${thisCard.name}
        Element: ${thisCard.element}
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

// this is obviously not the final version of this function, as it only outputs
// text, but it'll be good enough for our debugging purposes now
const renderHand = (player) => {
    for (let i = 0; i < 6; i++) { renderCard(player, ZONE_HAND, i); }
}

// and likewise with this. the render calls will be condensed into a single
// more DRY function later.
const renderNatialZone = (player) => {
    for (let i = 0; i < 4; i++) { renderCard(player, ZONE_NATIAL_FRONT, i); }

    for (let i = 0; i < 3; i ++) { renderCard(player, ZONE_NATIAL_BACK, i); }
}