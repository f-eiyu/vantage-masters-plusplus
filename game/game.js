const canUpdateFeedback = (boardSpace) => {
    const canUpdate =  !(game.enemyTurn
            || !playerControl
            || skillUsage.selected);

    return canUpdate;
}

const hoverLongdesc = (boardSpace) => {
    const card = boardSpace.innerCard;
    let detailStr = "";

    if (card.skillDesc) { detailStr += `<p><strong>Active</strong>: ${card.skillDesc}${card.isMaster ? " (" + card.skillCost + " mana)" : ""}</p>`; }
    if (card.passiveDesc) { detailStr += `<p><strong>Passive</strong>: ${card.passiveDesc}</p>`; }
    if (card.longdesc) { detailStr += `<p><strong>Effect</strong>: ${card.longdesc}`; }
    if (!detailStr) { detailStr += `<p>${card.name} has no special abilities.</p>`; }
    detailStr = `<h3>${card.name}</h3>
    ${card.isMaster ? "<p>Deck Master</p>" : "<p>Costs <strong>" + card.cost + "</strong> mana</p>"}
    ${detailStr}`;

    return detailStr;
}

const hoverFeedback = (boardSpace) => {
    const card = boardSpace.innerCard;
    let feedbackStr = "";

    if (boardSpace.owner !== PLAYER_FRIENDLY) { feedbackStr += "<p>You cannot control this card.</p>"; }
    else if (!card.currentActions && boardSpace.isNatial) { feedbackStr += "<p>This card is out of actions.</p>"; }
    else if (friendlyPlayer.currentMana < card.cost && !card.isMaster && boardSpace.isHand) { feedbackStr += "<p>Insufficient mana.</p>"}
    else if (boardSpace.isHand && card.type === "spell") { feedbackStr += "<p>Click and drag to a target to activate this spell.</p>"; }
    else if (boardSpace.isHand && card.type === "natial") { feedbackStr += "<p>Click and drag to an open space to summon this natial.</p>"; }
    else {
        if (card.canMove) { feedbackStr += "<p>Click and drag to move.</p>"; }
        feedbackStr += "<p>Click and drag to an enemy to attack.</p>";
        if (card.skillReady || (card.isMaster && friendlyPlayer.currentMana >= card.cost)) { feedbackStr += "<p>Right click to activate this card's skill.</p>"; }
    }

    return feedbackStr;
}

const boardCardMouseover = (event) => {
    const boardSpace = (new CardDOMEvent(event)).spaceObj;
    if (!boardSpace.hasCard) { return; }

    boardSpace.DOM.classList.add("hovered");

    // set image
    const largeCardZone = document.querySelector("#card-largepic-zone");
    largeCardZone.style.backgroundImage = `url('${boardSpace.innerCard.portraitURL}')`;
    largeCardZone.style.backgroundSize = "cover";

    const detailZone = document.getElementById("card-detail-zone");
    detailZone.innerHTML = hoverLongdesc(boardSpace);

    if (!canUpdateFeedback(boardSpace)) { return; }
    const feedbackZone = document.getElementById("feedback-zone");
    feedbackZone.innerHTML = hoverFeedback(boardSpace);
}

const boardCardMouseleave = (event) => {
    const boardSpace = (new CardDOMEvent(event)).spaceObj;
    const largeCardZone = document.querySelector("#card-largepic-zone");

    // reset large image to card background
    largeCardZone.innerText = "";
    largeCardZone.style.backgroundImage = `url('../data/img/misc/card-back.png')`;
    largeCardZone.style.backgroundSize = "cover";

    // reset card detail text
    const detailZone = document.getElementById("card-detail-zone");
    detailZone.innerHTML = "";

    // reset feedback text
    if (canUpdateFeedback(boardSpace)) {
        const feedbackZone = document.getElementById("feedback-zone");
        feedbackZone.innerHTML = "";
    }

    boardSpace.DOM.classList.remove("hovered");
}

const cardToBoardDirect = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.hasCard) { thisSpace.innerCard = card; }

    if (render) { game.renderAll(); }
}

const friendlyStartTurn = () => {
    game.incrementTurnCounter();
    game.renderTurnCounter();
    game.enemyTurn = false;

    const feedback = document.getElementById("feedback-zone");
    feedback.innerHTML = "<p><h1>It's your turn!</h1></p>";
    
    setTimeout(() => {
        friendlyPlayer.refreshNatials();
        friendlyPlayer.refreshMana();
        friendlyPlayer.drawCard();
    
        game.playerGainControl();
    }, 1000)
}

const friendlyEndTurn = () => {
    game.playerLoseControl();
    
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
    game.enemyTurn = true;

    const feedback = document.getElementById("feedback-zone");
    feedback.innerHTML = "<p>The computer is thinking...</p>";

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
    document.querySelector("#restart-game").addEventListener("click", initializeGameBoard);
}

const generateDeck = (player) => {
    const permittedCards = [];
    const generatedDeck = []

    for(let i = NATIAL_ID_START; i <= NATIAL_ID_END; i++) {
        permittedCards.push(cardDB.find(card => card.id === i));
    }
    if (player === PLAYER_FRIENDLY) {
        for(let i = SPELL_ID_START; i <= SPELL_ID_END; i++) {
            permittedCards.push(cardDB.find(card => card.id === i));
        }
    }

    for (let i = 0; i < DECK_SIZE_LIMIT; i++) {
        const randomCardID = Math.floor(Math.random() * permittedCards.length);
        generatedDeck.push(createCard(permittedCards[randomCardID]));
    }

    const randomMasterID = Math.floor(Math.random() * (MASTER_ID_END - MASTER_ID_START) + MASTER_ID_START);
    generatedDeck.push(createCard(cardDB.find(card => card.id === randomMasterID)));

    return generatedDeck;
}

const initializeGameBoard = () => {

    attachEventListeners();
    
    const playerDeckTemplate = generateDeck(PLAYER_FRIENDLY);
    const enemyDeckTemplate = generateDeck(PLAYER_ENEMY);
    friendlyPlayer = new Player(PLAYER_FRIENDLY, playerDeckTemplate);
    enemyPlayer = new Player(PLAYER_ENEMY, enemyDeckTemplate);
    skillUsage = new NatialSkillEvent(null, false);
    game = new GameBoard();
    game.playerLoseControl();
    destroyedCards = new DestroyedCards();
    friendlyPlayer.loadIcon();
    enemyPlayer.loadIcon();

    friendlyPlayer.drawCard(3, false);
    enemyPlayer.drawCard(3, false);

    game.renderAll();

    // choose a random player to start
    if (Math.random() > 0.5) {
        friendlyStartTurn();
    } else {
        game.playerLoseControl();
        enemyStartTurn();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();
});