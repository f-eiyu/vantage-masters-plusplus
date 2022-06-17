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

    if (render) { renderBoard(); }
    return true;
}

const placeCardOnBoard = (player, card, row, position, render = true) => {
    const thisSpace = natials[player][row][position];
    if (!thisSpace.card) { thisSpace.card = card; }

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

const endTurn = () => {
    // placeholder for now
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();

    const addDragEventListener = (domObj) => {
        domObj.addEventListener("dragenter", cardDraggedToSpace);
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

    document.querySelector("#end-turn").addEventListener("click", endTurn);
});

// ========== FUNCTIONS HANDLING DRAGGING AND DROPPING ==========

const setDraggable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", dragStart)
    thisCardDOM.addEventListener("dragend", (event) => event.target.classList.remove("dragging"));
}

const dragStart = (event) => {
    thisDragFrom = new dragInfo(event.target);
    event.target.classList.add("dragging");
}

const cardDraggedToSpace = (event) => {
    event.preventDefault();

    thisDragTo = new dragInfo(event.target);
    
    const dragTo = event.target;

    // sanity check
    if (thisDragFrom.owner !== PLAYER_FRIENDLY) { return false; }
    // prevent the card you just dragged for showing a border on itself
    if (thisDragFrom.spaceObj.DOM === dragTo) { return false; }

    const isToFriendlyNatial = dragTo.classList.contains("friendly-natial-space");
    const isToEnemyNatial = dragTo.classList.contains("enemy-natial-space");

    // decide what to do based on what kind of card was dragged where
    // natial dragged onto empty friendly space: movement possible
    if (thisDragFrom.isNatial && isToFriendlyNatial && !thisDragTo.spaceObj.card) {
        dragTo.classList.add("drag-over-empty");
    }
    // natial dragged onto occupied enemy space: attack possible
    else if (thisDragFrom.isNatial && isToEnemyNatial && thisDragTo.spaceObj.card) {
        dragTo.classList.add("drag-over-attack");
    }
    // hand card dragged onto empty friendly space: summoning possible
    else if (thisDragFrom.isHandCard && isToFriendlyNatial && !thisDragTo.spaceObj.card) {
        dragTo.classList.add("drag-over-empty");
    }
    // special case: spell cards dragged over the field to activate
    // else if () {}
    // no other moves are legal
    else {
        dragTo.classList.add("drag-over-invalid");
    }
}

// we don't actually require any continunous action when a tile is being drag
// hovered. this function's sole purpose is to call preventDefault() on the
// dragover listener so that it's possible for the drop listener to fire.
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
    
    // extract destination information from the event object
    thisDragTo = new dragInfo(event.target);

    const isToFriendlyNatial = (thisDragTo.owner === PLAYER_FRIENDLY && thisDragTo.isNatial);
    const isToEnemyNatial = (thisDragTo.owner === PLAYER_ENEMY && thisDragTo.isNatial);

    // decide what to do based on what was dragged into what
    // prototype for movement: card dragged from board to empty friendly space
    if (thisDragFrom.isNatial && isToFriendlyNatial && !thisDragTo.spaceObj.card) {
        // extract target and destination from the event objects
        thisDragFrom.spaceObj.moveNatial(thisDragTo.spaceObj);
    }
    // prototype for attacking: card dragged from board to occupied enemy space
    else if (thisDragFrom.isNatial && isToEnemyNatial && thisDragTo.spaceObj.card) {
        thisDragFrom.spaceObj.attackNatial(thisDragTo.spaceObj);
    }
    // prototype for summoning: card dragged from hand onto empty friendly space
    else if (thisDragFrom.isHandCard && isToFriendlyNatial && !thisDragTo.spaceObj.card) {
        thisDragFrom.spaceObj.summonNatial(thisDragTo.spaceObj);
    }

    return;
}