
const loadDeck = (cardList, player) => {
    // cardList will be used later on, when deck building is implemented!
    // for now, decks will simply be five copies of each debug card.
    const thisDeckRaw = [];
    for (let i = 0; i < 5; i++) { // 20 cards in each deck
        // generate each card in a wrapping object, with a random sorting seed
        thisDeckRaw.push({card: Object.create(debugCardFire), seed: Math.random()});
        thisDeckRaw.push({card: Object.create(debugCardHeaven), seed: Math.random()});
        thisDeckRaw.push({card: Object.create(debugCardEarth), seed: Math.random()});
        thisDeckRaw.push({card: Object.create(debugCardWater), seed: Math.random()});
    }
    // using the random seeds, shuffle the deck
    thisDeckRaw.sort((cardOne, cardTwo) => { return cardOne.seed - cardTwo.seed; });
    // extract the cards from their object wrappers
    const thisDeck = thisDeckRaw.map(cardWrapper => cardWrapper.card);

    // put the cards in the correct player's deck
    return decks[player] = thisDeck;
}

const drawCard = (player) => {
    // hands can have six cards at most
    if (hands[player].length >= 6) { return false; }

    // can only draw if there are cards to draw
    if (decks[player].length === 0) { return false; }

    // if the draw is possible, pop last card in the deck to the player's hand
    hands[player].push(decks[player].pop());

    renderBoard();
    return true;
}

const renderBoard = () => {
    renderHand(PLAYER_ENEMY);
    renderHand(PLAYER_FRIENDLY);

    // render natial zone here
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
}

initializeGameBoard();