'use strict';

const loadDeck = (cardList, player) => {
    // cardList will be used later on, when deck building is implemented!
    // for now, decks will simply be five copies of each debug card.
    const thisDeckRaw = [];
    for (let i = 0; i < 4; i++) { // 20 cards in each deck
        // generate each card in a wrapping object, with a random sorting seed
        thisDeckRaw.push({card: createCard(getFromDB("Debug Fire")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Water")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Earth")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Heaven")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Reduce")), seed: Math.random()});
    }
    // using the random seeds, shuffle the deck
    thisDeckRaw.sort((cardOne, cardTwo) => { return cardOne.seed - cardTwo.seed; });
    // extract the cards from their object wrappers
    const thisDeck = thisDeckRaw.map(cardWrapper => cardWrapper.card);

    // put the cards in the correct player's deck
    return decks[player] = thisDeck;
}

const drawCard = (player, render = true) => {
    // fail if there are no cards to draw
    if (decks[player].length === 0) { return false; }

    // retrieve the index of the first empty handSpace
    const getFirstEmpty = hands[player].reduce((firstEmpty, toCheck) => {
        return (!toCheck.card && toCheck.index < firstEmpty ? toCheck.index : firstEmpty);
    }, Infinity);

    // fail if there are no empty spaces
    if (getFirstEmpty > HAND_SIZE_LIMIT - 1) { return false; }

    // if the draw is possible, pop last card in the deck to the player's hand
    hands[player][getFirstEmpty].card = decks[player].pop();

    if (render) { renderAll(); }
    return true;
}

const boardCardMouseover = (event) => {
    const boardSpace = (new CardDOMEvent(event.target)).spaceObj;
    if (!boardSpace.card) { return; }

    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = boardSpace.DOM.innerText;
    if (boardSpace.card.type === "spell") {
        detailZone.innerText += boardSpace.card.longdesc;
    }
    boardSpace.DOM.classList.add("hovered");
}

const boardCardMouseleave = (event) => {
    const boardSpace = event.target;
    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = "";
    boardSpace.classList.remove("hovered");
}

const cardToBoardDirect = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.card) { thisSpace.card = card; }

    if (render) { renderAll(); }
}

const replenishMana = (player) => {
    if (maxMana[player] < 10) { maxMana[player]++; }
    currentMana[player] = maxMana[player];
    renderMana(player);
}

// sets all natials' actions to their maximum and enables them to move
const refreshNatials = (player) => {
    natials[player].forEach(row => {
        row.forEach(natialSpace => {
            if (natialSpace.card) {
                natialSpace.card.currentActions = natialSpace.card.maxActions;
                natialSpace.card.canMove = true;
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

const initializeGameBoard = () => {
    const addHoverMagnifyEventListener = (domObj) => {
        domObj.addEventListener("mouseover", boardCardMouseover);
        domObj.addEventListener("mouseleave", boardCardMouseleave);
    }

    const addHoverMagnifyListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => addHoverMagnifyEventListener(element))
    }

    addHoverMagnifyListenerToAll("enemy-natial-space");
    addHoverMagnifyListenerToAll("friendly-natial-space");
    addHoverMagnifyListenerToAll("friendly-hand-card");

    const addRightClickListener = (domObj) => {
        domObj.addEventListener("contextmenu", natialRightClick);
    }

    const addRightClickListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => addRightClickListener(element));
    }

    addRightClickListenerToAll("friendly-natial-space");

    const addLeftClickListener = (domObj) => {
        domObj.addEventListener("click", natialLeftClick);
    }

    const addLeftClickListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => addLeftClickListener(element));
    }

    // addLeftClickListenerToAll("enemy-hand-card");
    addLeftClickListenerToAll("enemy-natial-space");
    addLeftClickListenerToAll("friendly-natial-space");
    // addLeftClickListenerToAll("enemy-hand-card");

    loadDeck(null, PLAYER_FRIENDLY);
    loadDeck(null, PLAYER_ENEMY);

    // both players start with four cards in hand
    // a mulligan feature will be added... later
    for (let i = 0; i < 4; i++) {
        drawCard(PLAYER_FRIENDLY, false);
        drawCard(PLAYER_ENEMY, false);
    }

    // both players start with their respective masters on back-1
    masters[PLAYER_FRIENDLY] = createCard(getFromDB("Sister"));
    masters[PLAYER_ENEMY] = createCard(getFromDB("Sister"));
    cardToBoardDirect(PLAYER_FRIENDLY, masters[PLAYER_FRIENDLY], ROW_BACK, 1, false);
    cardToBoardDirect(PLAYER_ENEMY, masters[PLAYER_ENEMY], ROW_BACK, 1, false);

    // set starting mana values
    maxMana[PLAYER_FRIENDLY] = masters[PLAYER_FRIENDLY].cost;
    currentMana[PLAYER_FRIENDLY] = maxMana[PLAYER_FRIENDLY];
    maxMana[PLAYER_ENEMY] = masters[PLAYER_ENEMY].cost;
    currentMana[PLAYER_ENEMY] = maxMana[PLAYER_ENEMY];

    // choose a random player to start
    (Math.random() > 0.5) ? friendlyStartTurn() : enemyStartTurn();
    renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();

    const addDragEventListener = (domObj) => {
        domObj.addEventListener("dragenter", cardDragEnterSpace);
        domObj.addEventListener("dragover", cardDraggedOverSpace);
        domObj.addEventListener("dragleave", dragLeave);
        domObj.addEventListener("drop", dragDrop);
    }

    const addDragEventListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => addDragEventListener(element));
    }

    addDragEventListenerToAll("enemy-hand-card");
    addDragEventListenerToAll("enemy-natial-space");
    addDragEventListenerToAll("friendly-natial-space");
    addDragEventListenerToAll("friendly-hand-card");

    document.addEventListener("contextmenu", e => e.preventDefault());

    document.querySelector("#end-turn").addEventListener("click", friendlyEndTurn);
});
