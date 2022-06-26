'use strict';

const boardCardMouseover = (event) => {
    console.log(event);
    const boardSpace = (new CardDOMEvent(event.target)).spaceObj;
    if (!boardSpace.hasCard) { return; }

    const detailZone = document.querySelector("#card-largepic-zone");

    detailZone.innerText = boardSpace._DOM.innerText;
    if (boardSpace.innerCard.type === "spell") {
        detailZone.innerText += boardSpace.innerCard.longdesc;
    }
    detailZone.style.backgroundImage = `url('${boardSpace.innerCard.portraitURL}')`;
    detailZone.style.backgroundSize = "cover";
    boardSpace._DOM.classList.add("hovered");
}

const boardCardMouseleave = (event) => {
    const boardSpace = event.target;
    const largeCardZone = document.querySelector("#card-largepic-zone");

    largeCardZone.innerText = "";
    largeCardZone.style.backgroundImage = `url('../data/img/misc/card-back.png')`;
    largeCardZone.style.backgroundSize = "cover";
    boardSpace.classList.remove("hovered");
}

const cardToBoardDirect = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.hasCard) { thisSpace.innerCard = card; }

    if (render) { game.renderAll(); }
}

const incrementTurnCounter = () => {
    // one full turn consists of both players making a move. in this way, we
    // can have an accurate counter for full turns regardless of who goes first.
    turnCounter += 0.5;
}

const friendlyStartTurn = () => {
    incrementTurnCounter();
    renderTurnCounter();
    
    friendlyPlayer.refreshNatials();
    friendlyPlayer.refreshMana();
    friendlyPlayer.drawCard();

    playerCanInteract = true;
}

const friendlyEndTurn = () => {
    playerCanInteract = false;
    
    // onTurnEnd hook
    friendlyPlayer.natialZone.forAllSpaces(sp => {
        const card = sp.innerCard;
        if (card.hasPassive
            && natialPassiveCallbacks.onTurnEnd[card.passiveCbName]) {
            natialPassiveCallbacks.onTurnEnd[card.passiveCbName](sp);
        }
    });

    friendlyPlayer.natialZone.decrementSeal();
    enemyStartTurn();
}

// most functions encoding actual AI behavior will be in the ai.js file
const enemyStartTurn = () => {
    incrementTurnCounter();
    renderTurnCounter();

    enemyPlayer.refreshNatials();
    enemyPlayer.refreshMana();
    enemyPlayer.drawCard();

    aiTurn();
}

const enemyEndTurn = () => {
    if (!gameEnd) {
        // onTurnEnd hook
        enemyPlayer.natialZone.forAllSpaces(sp => {
            const card = sp.innerCard;
            if (card.hasPassive
                && natialPassiveCallbacks.onTurnEnd[card.passiveCbName]) {
                natialPassiveCallbacks.onTurnEnd[card.passiveCbName](sp);
            }
        });

        enemyPlayer.natialZone.decrementSeal();
        friendlyStartTurn();
    }
}

// adds the specified listener and cb to every DOM element with className
const addListenerToAll = (listenerName, callback, className) => {
    const classList = document.querySelectorAll("." + className);
    classList.forEach(dom => {
        dom.addEventListener(listenerName, callback);
    }, true);
}

const attachEventListeners = () => {
    addListenerToAll("mouseover", boardCardMouseover, "enemy-natial-space");
    addListenerToAll("mouseover", boardCardMouseover, "friendly-natial-space");
    addListenerToAll("mouseover", boardCardMouseover, "friendly-hand-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "friendly-natial-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "enemy-natial-space");
    addListenerToAll("mouseleave", boardCardMouseleave, "friendly-hand-space");

    addListenerToAll("contextmenu", natialRightClick, "friendly-natial-space");

    addListenerToAll("click", natialLeftClick, "enemy-hand-space");
    addListenerToAll("click", natialLeftClick, "enemy-natial-space");
    addListenerToAll("click", natialLeftClick, "friendly-natial-space");
    // addListenerToAll("click", natialLeftClick, "friendly-hand-space");

    const addDragListenerToAll = (className) => {
        addListenerToAll("dragenter", cardDragEnter, className)
        addListenerToAll("dragover", cardDragOver, className)
        addListenerToAll("dragleave", cardDragLeave, className)
        addListenerToAll("drop", cardDragDrop, className)
    }

    addDragListenerToAll("enemy-hand-space");
    addDragListenerToAll("enemy-natial-space");
    addDragListenerToAll("friendly-natial-space");
    addDragListenerToAll("friendly-hand-space");

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
            _playerDeckTemplate.push(createCard(getFromDB("Requ")));
            _playerDeckTemplate.push(createCard(getFromDB("Requ")));
            _playerDeckTemplate.push(createCard(getFromDB("Amoltamis")));
            _playerDeckTemplate.push(createCard(getFromDB("Amoltamis")));
            _playerDeckTemplate.push(createCard(getFromDB("Amoltamis")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
        }
        _playerDeckTemplate.push(createCard(getFromDB("Ranger")));
        _enemyDeckTemplate.push(createCard(getFromDB("Tyrant")));
    }
    friendlyPlayer = new Player(PLAYER_FRIENDLY, _playerDeckTemplate);
    friendlyPlayer._maxMana = 10;
    enemyPlayer = new Player(PLAYER_ENEMY, _enemyDeckTemplate);
    skillUsage = new NatialSkillEvent(null, false);
    game = new GameBoard();
    destroyedCards = new DestroyedCards();
    friendlyPlayer.loadIcon();
    enemyPlayer.loadIcon();

    // both players start with three cards in hand.
    // a mulligan feature will be added... later.
    friendlyPlayer.drawCard(3, false);
    enemyPlayer.drawCard(3, false);

    game.renderAll();

    // choose a random player to start
    (Math.random() > 0.5) ? friendlyStartTurn() : enemyStartTurn();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();
});