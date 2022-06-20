// as the cardDOMEvent object is updated, this code will need additional
// refactoring in order to prevent its interactions from being a convoluted mess

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

const spellDragValidation = (dragFromSpace, dragToSpace) => {
    // sanity check
    if (!dragFromSpace.isHandSpace) {
        alert("Error! Spell in natial zone!");
        return false;
    }

    // always fail if insufficient mana
    if (dragFromSpace.card.cost > currentMana[dragFromSpace.owner]) {
        return false;
    }

    // validate the drag location based on the spell
    switch(dragFromSpace.card.callbackName) {
        // friendly buff spells: succeed if target is friendly natial, else fail
        case "cbSpellMagicCrystal":
        case "cbSpellMedic":
        case "cbSpellBlaze":
        case "cbSpellWall":
            // succeed if there is a target natial and the target natial is in 
            // the same natial zone as the spell's owner; fail otherwise.
            // *** should include a check for whether the spell will actually
            //     do anything, and fail if it wouldn't!
            if (dragToSpace.card
                && dragToSpace.owner === dragFromSpace.owner
                && dragToSpace.isNatialSpace) {
                return true;
            }
            return false;
        
        // natial zone-wide spells: always succeed if a natial space is targeted
        case "cbSpellUptide":
            if (dragToSpace.isNatialSpace) { return true; }
            return false;
        
        default: return false;
    }
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
    // spell: handle differently based on the specific spell
    if (thisDragFrom.isSpell
        && spellDragValidation(thisDragFromSpace, thisDragToSpace)) {
            thisDragToSpace.DOM.classList.add("drag-over-valid");
    }
    // natial dragged onto empty friendly space: movement possible
    else if (thisDragFrom.isNatial
        && isToFriendlyNatial
        && thisDragFromSpace.checkMovementPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-valid");
    }
    // natial dragged onto occupied enemy space: attack possible
    else if (thisDragFrom.isNatial
        && isToEnemyNatial
        && thisDragFromSpace.checkAttackPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-attack");
    }
    // hand natial dragged onto empty friendly space: summoning possible
    else if (thisDragFrom.isHandCard
        && !thisDragFrom.isSpell
        && isToFriendlyNatial
        && thisDragFromSpace.checkSummonPossible(thisDragToSpace)) {
        thisDragToSpace.DOM.classList.add("drag-over-valid");
    }
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
    event.target.classList.remove("drag-over-valid");
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
    // spells have special validation and should be handled case-by-case
    if (thisDragFrom.isSpell
        && spellDragValidation(thisDragFromSpace, thisDragToSpace)) {
            thisDragFromSpace.activateSpell(thisDragToSpace);
    }
    // check for movement: card dragged from board to friendly space
    else if (thisDragFrom.isNatial
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