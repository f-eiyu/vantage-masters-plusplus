

const initializeGameBoard = () => {
    const addHoverMagnifyEventListener = (domObj) => {
        const detailZone = document.querySelector("#card-detail-zone");
        domObj.addEventListener("mouseover", () => { detailZone.innerText = domObj.innerText; });
        domObj.addEventListener("mouseleave", () => { detailZone.innerText = ""; });
    }

    const addHoverMagnifyListenerToAll = (className) => {
        const thisClassList = document.querySelectorAll("." + className);
        thisClassList.forEach(element => { addHoverMagnifyEventListener(element); })
    }

    addHoverMagnifyListenerToAll("enemy-natial-space");
    addHoverMagnifyListenerToAll("friendly-natial-space");
    addHoverMagnifyListenerToAll("friendly-hand-card");
}

document.addEventListener("DOMContentLoaded", initializeGameBoard());