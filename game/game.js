'use strict';

const boardCardMouseover = (event) => {
    const boardSpace = (new CardDOMEvent(event.target)).spaceObj;
    if (!boardSpace.hasCard) { return; }

    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = boardSpace._DOM.innerText;
    if (boardSpace.innerCard.type === "spell") {
        detailZone.innerText += boardSpace.innerCard.longdesc;
    }
    boardSpace._DOM.classList.add("hovered");
}

const boardCardMouseleave = (event) => {
    const boardSpace = event.target;
    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = "";
    boardSpace.classList.remove("hovered");
}

const cardToBoardDirect = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.hasCard) { thisSpace.innerCard = card; }

    if (render) { renderAll(); }
}

const replenishMana = (player) => {
    if (maxMana[player] < 10) { maxMana[player]++; }
    currentMana[player] = maxMana[player];
    renderMana(player);
}

// sets all natials' actions to their maximum and enables them to move
// please refactor this i am begging you
const refreshNatials = (player) => {
    natials[player].forEach(row => {
        row.forEach(natialSpace => {
            if (natialSpace.hasCard) {
                natialSpace.innerCard.currentActions = natialSpace.innerCard.maxActions;
                natialSpace.innerCard.canMove = true;
            }
        });
    });
}

const incrementTurnCounter = () => {
    // one full turn consists of both players making a move. in this way, we
    // can have an accurate counter for full turns regardless of who goes first.
    turnCounter += 0.5;
}

const friendlyStartTurn = () => {
    incrementTurnCounter();
    renderTurnCounter();

    replenishMana(PLAYER_FRIENDLY);
    refreshNatials(PLAYER_FRIENDLY);
    drawCard(PLAYER_FRIENDLY);

    playerCanInteract = true;
}

const friendlyEndTurn = () => {
    playerCanInteract = false;

    enemyStartTurn();
}

// most functions encoding actual AI behavior will be in the ai.js file
const enemyStartTurn = () => {
    incrementTurnCounter();
    renderTurnCounter();

    replenishMana(PLAYER_ENEMY);
    refreshNatials(PLAYER_ENEMY);
    drawCard(PLAYER_ENEMY);

    aiTurn();
}

const enemyEndTurn = () => {
    if (!gameEnd) { friendlyStartTurn(); }
}

// adds the specified listener and cb to every DOM element with className
const addListenerToAll = (listenerName, callback, className) => {
    const classList = document.querySelectorAll("." + className);
    classList.forEach(dom => {
        dom.addEventListener(listenerName, callback);
    });
}

const attachEventListeners = () => {
    addListenerToAll("mouseover", boardCardMouseover, "enemy-natial-space");
    addListenerToAll("mouseover", boardCardMouseover, "friendly-natial-space");
    addListenerToAll("mouseover", boardCardMouseover, "friendly-hand-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "friendly-natial-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "enemy-natial-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "friendly-hand-space");

    addListenerToAll("contextmenu", natialRightClick, "friendly-natial-space");

    // addListenerToAll("click", natialLeftClick, "enemy-hand-space");
    addListenerToAll("click", natialLeftClick, "enemy-natial-space");
    addListenerToAll("click", natialLeftClick, "friendly-natial-space");
    // addListenerToAll("click", natialLeftClick, "friendly-hand-space");

    const addDragListenerToAll = (className) => {
        addListenerToAll("dragenter", cardDragEnter, className)
        addListenerToAll("dragover", cardDragOver, className)
        addListenerToAll("dragleave", cardDragLeave, className)
        addListenerToAll("dragdrop", cardDragDrop, className)
    }

    addDragListenerToAll("enemy-hand-card");
    addDragListenerToAll("enemy-natial-space");
    addDragListenerToAll("friendly-natial-space");
    addDragListenerToAll("friendly-hand-card");

    document.addEventListener("contextmenu", e => e.preventDefault());

    document.querySelector("#end-turn").addEventListener("click", friendlyEndTurn);
}

const initializeGameBoard = () => {
    attachEventListeners();
    
    // instantiate players
    const _playerDeckTemplate = [];
    const _enemyDeckTemplate = [];
    { // all of this is for debugging until the deck builder goes in
        for (let i = 0; i < 4; i++) {
            _playerDeckTemplate.push(createCard(getFromDB("Debug Fire")));
            _playerDeckTemplate.push(createCard(getFromDB("Debug Water")));
            _playerDeckTemplate.push(createCard(getFromDB("Debug Earth")));
            _playerDeckTemplate.push(createCard(getFromDB("Debug Heaven")));
            _playerDeckTemplate.push(createCard(getFromDB("Uptide")));
            _enemyDeckTemplate.push(createCard(getFromDB("Debug Fire")));
            _enemyDeckTemplate.push(createCard(getFromDB("Debug Water")));
            _enemyDeckTemplate.push(createCard(getFromDB("Debug Earth")));
            _enemyDeckTemplate.push(createCard(getFromDB("Debug Heaven")));
            _enemyDeckTemplate.push(createCard(getFromDB("Uptide")));
        }
        _playerDeckTemplate.push(createCard(getFromDB("Sister")));
        _enemyDeckTemplate.push(createCard(getFromDB("Beast")));
    }
    players[PLAYER_FRIENDLY] = new Player(PLAYER_FRIENDLY, _playerDeckTemplate);
    players[PLAYER_ENEMY] = new Player(PLAYER_ENEMY, _enemyDeckTemplate);

    // both players start with three cards in hand.
    // a mulligan feature will be added... later.
    players[PLAYER_FRIENDLY].drawCard(3, false);
    players[PLAYER_ENEMY].drawCard(3, false);

    // choose a random player to start
    (Math.random() > 0.5) ? friendlyStartTurn() : enemyStartTurn();
    renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();
});