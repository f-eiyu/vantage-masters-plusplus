'use strict';

const loadDeck = (cardList, player) => {
    // cardList will be used later on, when deck building is implemented!
    // for now, decks will simply be five copies of each debug card.
    const thisDeckRaw = [];
    for (let i = 0; i < 5; i++) { // 20 cards in each deck
        // generate each card in a wrapping object, with a random sorting seed
        thisDeckRaw.push({card: createCard(getFromDB("Debug Fire")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Water")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Earth")), seed: Math.random()});
        thisDeckRaw.push({card: createCard(getFromDB("Debug Heaven")), seed: Math.random()});
    }
    // using the random seeds, shuffle the deck
    thisDeckRaw.sort((cardOne, cardTwo) => { return cardOne.seed - cardTwo.seed; });
    // extract the cards from their object wrappers
    const thisDeck = thisDeckRaw.map(cardWrapper => cardWrapper.card);

    // put the cards in the correct player's deck
    return decks[player] = thisDeck;
}

const drawCard = (player, render = true) => {
    // hands can have six cards at most
    if (hands[player].length >= 6) { return false; }

    // can only draw if there are cards to draw
    if (decks[player].length === 0) { return false; }

    // if the draw is possible, pop last card in the deck to the player's hand
    hands[player].push(decks[player].pop());

    if (render) { renderBoard(); }
    return true;
}

const placeCardOnBoard = (player, card, row, position, render = true) => {
    if (!natials[player][row][position]) { natials[player][row][position] = card; }

    if (render) { renderBoard(); }
}

const renderBoard = () => {
    renderHand(PLAYER_FRIENDLY);
    renderHand(PLAYER_ENEMY);

    renderNatials(PLAYER_FRIENDLY);
    renderNatials(PLAYER_ENEMY);
}

const boardCardMouseover = (event) => {
    const boardSpace = event.target;
    if (!boardSpace.content) { return; }

    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = boardSpace.innerText;
    boardSpace.classList.add("hovered");
}

const boardCardMouseleave = (event) => {
    const boardSpace = event.target;
    const detailZone = document.querySelector("#card-detail-zone");

    detailZone.innerText = "";
    boardSpace.classList.remove("hovered");
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

    loadDeck(null, PLAYER_FRIENDLY);
    loadDeck(null, PLAYER_ENEMY);

    // both players start with four cards in hand
    // a mulligan feature will be added... later
    for (let i = 0; i < 4; i++) {
        drawCard(PLAYER_FRIENDLY, false);
        drawCard(PLAYER_ENEMY, false);
    }

    // both players start with their respective masters on back-1
    friendlyMaster = createCard(getFromDB("Debug Master"));
    enemyMaster = createCard(getFromDB("Debug Master"));
    placeCardOnBoard(PLAYER_FRIENDLY, friendlyMaster, ROW_BACK, 1, false);
    placeCardOnBoard(PLAYER_ENEMY, enemyMaster, ROW_BACK, 1, false);
    
    renderBoard();
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();

    const addDragEventListener = (domObj) => {
        domObj.addEventListener("dragenter", cardDraggedOnSpace);
        domObj.addEventListener("dragover", cardDraggedOverSpace);
        domObj.addEventListener("dragleave", dragLeave);
        domObj.addEventListener("drop", dragDrop);
    }

    const addDragEventListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => addDragEventListener(element));
    }

    addDragEventListenerToAll("enemy-hand-space");
    addDragEventListenerToAll("enemy-natial-space");
    addDragEventListenerToAll("friendly-natial-space");
    addDragEventListenerToAll("friendly-hand-card");
});


// ========== FUNCTIONS HANDLING DRAGGING AND DROPPING ==========

// gives click and drag functionality to a card on the board
const dragStart = (event) => {
    draggedCard = event.target;
    event.target.classList.add("dragging");
    console.log("drag start");
}

const setDraggable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", dragStart)
    thisCardDOM.addEventListener("dragend", (event) => event.target.classList.remove("dragging"));
}


const cardDraggedOnSpace = (event) => {
    event.preventDefault();
    
    const dragTo = event.target;

    // sanity check
    if (draggedCard.owner !== PLAYER_FRIENDLY) { return false; }
    if (draggedCard === dragTo) { return false; }

    const isFrontNatial = draggedCard.classList.contains("front-natial");
    const isBackNatial = draggedCard.classList.contains("back-natial");
    const isNatial = isFrontNatial || isBackNatial;
    const isHandCard = draggedCard.classList.contains("friendly-hand-card");

    const isToFriendlyNatial = dragTo.classList.contains("friendly-natial-space");
    const isToEnemyNatial = dragTo.classList.contains("enemy-natial-space");
    const isToHand = dragTo.classList.contains("friendly-hand-card");

    // decide what to do based on what kind of card was dragged where
    // natial dragged onto empty friendly space: movement possible
    if (isNatial && isToFriendlyNatial && !dragTo.content) {
        dragTo.classList.add("drag-over-empty");
    }
    // natial dragged onto occupied enemy space: attack possible
    else if (isNatial && isToEnemyNatial && dragTo.content) {
        dragTo.classList.add("drag-over-attack");
    }
    // hand card dragged onto empty friendly space: summoning possible
    else if (isHandCard && isToFriendlyNatial && !dragTo.content) {
        dragTo.classList.add("drag-over-empty");
    }
    // special case: spell cards dragged over the field to activate
    // else if () {}
    // no other moves are legal
    else {
        dragTo.classList.add("drag-over-invalid");
    }
}

// we don't require any continunous action when a tile is being drag hovered.
// this function's sole purpose is to call preventDefault() on the dragover
// listener so that it's possible for the drop listener to fire.
const cardDraggedOverSpace = (event) => {
    event.preventDefault();
}

const clearDragVisuals = (event) => {
    event.target.classList.remove("drag-over-empty");
    event.target.classList.remove("drag-over-attack");
    event.target.classList.remove("drag-over-invalid");
}

const dragLeave = (event) => {
    clearDragVisuals(event);
}

const dragDrop = (event) => {
    event.preventDefault();
    
    clearDragVisuals(event);

    const dragTo = event.target;

    // extract originating card's information
    const isFrontNatial = draggedCard.classList.contains("front-natial");
    const isBackNatial = draggedCard.classList.contains("back-natial");
    const isNatial = isFrontNatial || isBackNatial;
    const inRow = isFrontNatial ? ZONE_NATIAL_FRONT : ZONE_NATIAL_BACK;
    const isHandCard = draggedCard.classList.contains("friendly-hand-card");
    const index = draggedCard.id.slice(-1);

    // extract target and destination information from the event object
    const isToFriendlyNatial = dragTo.classList.contains("friendly-natial-space");
    const isToEnemyNatial = dragTo.classList.contains("enemy-natial-space");
    const targetID = dragTo.id.split("-");
    const targetRow = targetID[1] === "front" ? ZONE_NATIAL_FRONT : ZONE_NATIAL_BACK;
    const targetIndex = targetID[2];

    // decide what to do based on what was dragged into what
    // prototype for movement: card dragged from board to blank friendly space
    if (isNatial && isToFriendlyNatial && !dragTo.content) {
        // extract target and destination from the event objects
        moveNatial(PLAYER_FRIENDLY, inRow, index, targetRow, targetIndex);
    }
    // prototype for attacking: card dragged from board to occupied enemy space
    else if (isNatial && isToEnemyNatial && dragTo.content) {
        attackNatial(PLAYER_FRIENDLY, inRow, index, targetRow, targetIndex);
    }
    // prototype for summoning: card dragged from hand onto blank friendly space
    else if (isHandCard && isToFriendlyNatial && !dragTo.content) {
        summonNatial(PLAYER_FRIENDLY, index, targetRow, targetIndex);
    }
    else {
        draggedCard = null;
    }
}

const moveNatial = (player, originRow, originIndex, targetRow, targetIndex) => {
    // moves the card object's reference from one board tile to another
    natials[player][targetRow][targetIndex] = natials[player][originRow][originIndex];
    natials[player][originRow][originIndex] = null;

    // re-render the natial zone
    renderNatials(player);
}

const attackNatial = (attackingPlayer, attackerRow, attackerIndex, defenderRow, defenderIndex) => {
    // fetch the attacker and defender objects
    const defendingPlayer = (attackingPlayer === PLAYER_FRIENDLY ? PLAYER_ENEMY : PLAYER_FRIENDLY);
    const attacker = natials[attackingPlayer][attackerRow][attackerIndex];
    const defender = natials[defendingPlayer][defenderRow][defenderIndex];

    // perform the attack
    defender.currentHP -= attacker.attack;

    // remove the defender from the board if it dies
    if (defender.currentHP <= 0) {
        natials[defendingPlayer][defenderRow][defenderIndex] = null;
    }

    // re-render both natial zones
    renderNatials(PLAYER_FRIENDLY);
    renderNatials(PLAYER_ENEMY);
}

const summonNatial = (player, handIndex, targetRow, targetIndex) => {
    // move the card object's reference from hand to board
    natials[player][targetRow][targetIndex] = hands[player][handIndex];
    hands[player][handIndex] = null;

    // re-render the appropriate zones
    renderHand(player);
    renderNatials(player);
}