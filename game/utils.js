const getPlayerStr = (player) => { return player === PLAYER_FRIENDLY ? "friendly" : "enemy"; }
const getRowStr = (row) => { return row === ROW_FRONT ? "front" : "back"; }

// this is obviously not the final version of this function, as it only outputs
// text, but it'll be good enough for our debugging purposes now
const renderHand = (player) => {
    const playerStr = getPlayerStr(player);

    for (let i = 0; i < 6; i++) {
        const thisCard = hands[player][i];
        const thisHandDOM = document.querySelector(`#${playerStr}-hand-${i}`);

        if (thisCard === undefined) { thisHandDOM.innerText = `hand ${i}`; }
        else {
            thisHandDOM.innerText = `${player === PLAYER_ENEMY ? "???" : ""} ${thisCard.name}`;
        }
    }
}

const renderNatials = (player) => {
    return;
}

// and likewise with this
const renderNatialZone = (player) => {
    const playerStr = getPlayerStr(player);

    const renderNatialInternal = (card, natialDOM, position) => {
        if (card === undefined) { natialDOM.innerText = `natial ${position}`; }
        else { natialDOM.innerText = card.name; }
    }

    for (let i = 0; i < 4; i++) {
        const thisCard = natials[player][ROW_FRONT][i];
        const thisNatialDOM = document.querySelector(`#${playerStr}-front-${i}`);

        renderNatialInternal(thisCard, thisNatialDOM, i);
    }

    for (let i = 0; i < 3; i ++) {
        const thisCard = natials[player][ROW_BACK][i];
        const thisNatialDOM = document.querySelector(`#${playerStr}-back-${i}`);

        renderNatialInternal(thisCard, thisNatialDOM, i);
    }
}

const placeCardOnBoard = (player, card, row, position) => {
    if (!natials[player][row][position]) { natials[player][row][position] = card; }
}