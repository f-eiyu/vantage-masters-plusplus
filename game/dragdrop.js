const setDraggable = (thisCardDOM) => {
    thisCardDOM.setAttribute("draggable", "true");
    thisCardDOM.addEventListener("dragstart", dragStart)
    thisCardDOM.addEventListener("dragend", (event) => event.target.classList.remove("dragging"));
}

const dragStart = (event) => {
    if (!playerCanInteract) { return; }

    thisDragFrom = new dragInfo(event.target);
    event.target.classList.add("dragging");
}

const cardDraggedToSpace = (event) => {
    if (!playerCanInteract) { return; 
    }
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
    if (!playerCanInteract) { return; }
    
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
    if (!playerCanInteract) { return; }

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