
const loadDeck = (cardList) => {
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
    // extract the cards from their object wrappers and return
    const thisDeck = thisDeckRaw.map(cardWrapper => cardWrapper.card);

    return thisDeck;
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

document.addEventListener("DOMContentLoaded", () => {
    initializeGameBoard();
});