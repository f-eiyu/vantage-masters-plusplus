const getPlayerStr = (player) => { return player === PLAYER_FRIENDLY ? "friendly" : "enemy"; }

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