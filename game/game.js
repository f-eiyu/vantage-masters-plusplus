const boardCardMouseover = (event) => {
    console.log(event);
    const boardSpace = (new CardDOMEvent(event)).spaceObj;
    const card = boardSpace.innerCard;
    if (!boardSpace.hasCard) { return; }

    // set image
    const largeCardZone = document.querySelector("#card-largepic-zone");
    largeCardZone.style.backgroundImage = `url('${boardSpace.innerCard.portraitURL}')`;
    largeCardZone.style.backgroundSize = "cover";

    // set description text
    const detailZone = document.getElementById("card-detail-zone");
    let detailStr = "";
    if (card.skillDesc) { detailStr += `<p><strong>Active</strong>: ${card.skillDesc}${card.isMaster ? " (" + card.skillCost + " mana)" : ""}</p>`; }
    if (card.passiveDesc) { detailStr += `<p><strong>Passive</strong>: ${card.passiveDesc}</p>`; }
    if (card.longdesc) { detailStr += `<p><strong>Effect</strong>: ${card.longdesc}`; }
    if (!detailStr) { detailStr += `<p>${card.name} has no special abilities.</p>`; }

    detailStr = `<h3>${card.name}</h3>
    ${card.isMaster ? "<p></p>" : "<p>Costs <strong>" + card.cost + "</strong> mana</p>"}
    ${detailStr}`;

    detailZone.innerHTML = detailStr;

    boardSpace._DOM.classList.add("hovered");
}

const boardCardMouseleave = (event) => {
    const boardSpace = event.target;
    const largeCardZone = document.querySelector("#card-largepic-zone");

    // reset large image to card background
    largeCardZone.innerText = "";
    largeCardZone.style.backgroundImage = `url('../data/img/misc/card-back.png')`;
    largeCardZone.style.backgroundSize = "cover";

    // reset card detail text
    const detailZone = document.getElementById("card-detail-zone");
    detailZone.innerText = "";

    boardSpace.classList.remove("hovered");
}

const cardToBoardDirect = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.hasCard) { thisSpace.innerCard = card; }

    if (render) { game.renderAll(); }
}

const friendlyStartTurn = () => {
    game.incrementTurnCounter();
    game.renderTurnCounter();
    
    friendlyPlayer.refreshNatials();
    friendlyPlayer.refreshMana();
    friendlyPlayer.drawCard();

    playerControl = true;
}

const friendlyEndTurn = () => {
    playerControl = false;
    
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
    game.incrementTurnCounter();
    game.renderTurnCounter();

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
            _playerDeckTemplate.push(createCard(getFromDB("Magic Crystal")));
            _playerDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _playerDeckTemplate.push(createCard(getFromDB("Requ")));
            _playerDeckTemplate.push(createCard(getFromDB("Blyx")));
            _playerDeckTemplate.push(createCard(getFromDB("Dullmdalla")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
            _enemyDeckTemplate.push(createCard(getFromDB("Pelitt")));
        }
        _playerDeckTemplate.push(createCard(getFromDB("Bard")));
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