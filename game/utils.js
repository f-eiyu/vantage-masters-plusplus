const getPlayerStr = (player) => { return player === PLAYER_FRIENDLY ? "friendly" : "enemy"; }
const getRowStr = (row) => { return row === ROW_FRONT ? "front" : "back"; }

// this is obviously not the final version of this function, as it only outputs
// text, but it'll be good enough for our debugging purposes now
const renderHand = (player) => {
    const playerStr = getPlayerStr(player);

    for (let i = 0; i < 6; i++) {
        const card = hands[player][i];
        const handDOM = document.querySelector(`#${playerStr}-hand-${i}`);

        if (card === undefined) {
            handDOM.innerText = `hand ${i}`;
            handDOM.setAttribute("draggabble", "false");
        }
        else {
            const cardStr = `${player === PLAYER_ENEMY ? "???" : ""} ${card.name}
            Element: ${card.element}
            HP: ${card.currentHP}/${card.maxHP}
            ATK: ${card.attack}
            Cost: ${card.cost}
            ${card.isRanged ? "R" : ""}${card.isQuick ? "Q" : ""}`

            handDOM.innerText = cardStr;
            if (player === PLAYER_FRIENDLY) {
                handDOM.setAttribute("draggable", "true");
                handDOM.addEventListener("dragstart", event => event.target.classList.add("dragging"));
                handDOM.addEventListener("dragend", event => event.target.classList.remove("dragging"));
            }
        }
    }
}

const renderNatials = (player) => {
    return;
}

// and likewise with this. the render calls will be condensed into a single
// more DRY function later.
const renderNatialZone = (player) => {
    const playerStr = getPlayerStr(player);

    const renderNatialInternal = (card, natialDOM, position) => {
        if (card === undefined) {
            natialDOM.innerText = `natial ${position}`;
            natialDOM.setAttribute("draggabble", "false");}
        else {
            const cardStr = `${card.name}
            Element: ${card.element}
            HP: ${card.currentHP}/${card.maxHP}
            ATK: ${card.attack}
            Cost: ${card.cost}
            ${card.isRanged ? "R" : ""}${card.isQuick ? "Q" : ""}`

            natialDOM.innerText = cardStr;
            if (player === PLAYER_FRIENDLY) {
                natialDOM.setAttribute("draggable", "true");
                natialDOM.addEventListener("dragstart", event => event.target.classList.add("dragging"));
                natialDOM.addEventListener("dragend", event => event.target.classList.remove("dragging"));
            }
        }
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