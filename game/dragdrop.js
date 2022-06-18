const setDraggable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", dragStart)
    thisCardDOM.addEventListener("dragend", (event) => event.target.classList.remove("dragging"));
}

const dragStart = (event) => {
    if (!playerCanInteract || gameEnd) { return; }

    thisDragFrom = new cardDOMEvent(event.target);
    event.target.classList.add("dragging");
}

const cardDragEnterSpace = (event) => {
    if (!playerCanInteract || gameEnd) { return; 
    }
    event.preventDefault();

    const thisDragFromSpace = thisDragFrom.spaceObj;
    thisDragTo = new cardDOMEvent(event.target);
    const thisDragToSpace = thisDragTo.spaceObj;

    // sanity check
    if (thisDragFrom.owner !== PLAYER_FRIENDLY) { return false; }
    // prevent the card you just dragged for showing a border on itself
    if (thisDragFromSpace.DOM === thisDragToSpace.DOM) { return false; }

    const isToFriendlyNatial = (thisDragTo.owner === PLAYER_FRIENDLY && thisDragTo.isNatial);
    const isToEnemyNatial = (thisDragTo.owner === PLAYER_ENEMY && thisDragTo.isNatial);

    // decide what to do based on what kind of card was dragged where
    // natial dragged onto empty friendly space: movement possible
    if (thisDragFrom.isNatial
        && isToFriendlyNatial
        && thisDragFromSpace.checkMovementPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-empty");
    }
    // natial dragged onto occupied enemy space: attack possible
    else if (thisDragFrom.isNatial
        && isToEnemyNatial
        && thisDragFromSpace.checkAttackPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-attack");
    }
    // hand card dragged onto empty friendly space: summoning possible
    else if (thisDragFrom.isHandCard
        && isToFriendlyNatial
        && thisDragFromSpace.checkSummonPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-empty");
    }
    // special case: spell cards dragged over the field to activate
    // else if () {}
    // no other moves are legal
    else {
        thisDragToSpace.DOM.classList.add("drag-over-invalid");
    }
}

// we don't actually require any continunous action when a tile is being drag
// hovered. this function's sole purpose is to call preventDefault() on the
// dragover listener so that it's possible for the drop listener to fire.
const cardDraggedOverSpace = (event) => {
    if (!playerCanInteract || gameEnd) { return; }
    
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
    if (!playerCanInteract || gameEnd) { return; }

    event.preventDefault();
    
    clearDragVisuals(event);
    
    // extract destination information from the event object
    const thisDragFromSpace = thisDragFrom.spaceObj;
    thisDragTo = new cardDOMEvent(event.target);
    const thisDragToSpace = thisDragTo.spaceObj;

    const isToFriendlyNatial = (thisDragTo.owner === PLAYER_FRIENDLY && thisDragTo.isNatial);
    const isToEnemyNatial = (thisDragTo.owner === PLAYER_ENEMY && thisDragTo.isNatial);

    // decide what to do based on what was dragged into what
    // check for movement: card dragged from board to friendly space
    if (thisDragFrom.isNatial
        && isToFriendlyNatial
        && thisDragFromSpace.checkMovementPossible(thisDragToSpace)) {
        thisDragFromSpace.moveNatial(thisDragToSpace);
    }
    // check for attacking: card dragged from board to enemy space
    else if (thisDragFrom.isNatial
        && isToEnemyNatial
        && thisDragFromSpace.checkAttackPossible(thisDragToSpace)) {
        thisDragFromSpace.attackNatial(thisDragToSpace);
    }
    // check for summoning: card dragged from hand onto friendly space
    else if (thisDragFrom.isHandCard
        && isToFriendlyNatial
        && thisDragFromSpace.checkSummonPossible(thisDragToSpace)) {
        thisDragFromSpace.summonNatial(thisDragToSpace);
    }

    return;
}