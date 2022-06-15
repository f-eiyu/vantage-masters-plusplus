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

    renderNatialZone(PLAYER_FRIENDLY);
    renderNatialZone(PLAYER_ENEMY);
}


const initializeGameBoard = () => {
    const addHoverMagnifyEventListener = (domObj) => {
        const detailZone = document.querySelector("#card-detail-zone");
        domObj.addEventListener("mouseover", () => { detailZone.innerText = domObj.innerText; });
        domObj.addEventListener("mouseleave", () => { detailZone.innerText = ""; });
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
});