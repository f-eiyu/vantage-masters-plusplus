// as the CardDOMEvent object is updated, this code will need additional
// refactoring in order to prevent its interactions from being a convoluted mess

const dragStart = (event) => {
    if (!playerCanInteract || gameEnd || skillUsage.selected) { return; }

    thisDragFrom = new CardDOMEvent(event.target);
    event.target.classList.add("dragging");
}

const spellDragValidation = (dragFromSpace, dragToSpace) => {
    // sanity check
    if (!dragFromSpace.isHand) {
        alert("Error! Spell in natial zone!");
        return false;
    }

    // always fail if insufficient mana
    const spellUser = getPlayer(dragFromSpace.owner);
    if (dragFromSpace.innerCard.cost > spellUser.currentMana) { return false; }

    // validate the drag location based on the spell
    const cbName = dragFromSpace.innerCard.callbackName;
    return spellValidators[cbName](dragFromSpace, dragToSpace);
}

const cardDragEnter = (event) => {
    if (!playerCanInteract || gameEnd || skillUsage.selected) { return; 
    }
    event.preventDefault();

    const fromSpace = thisDragFrom.spaceObj;
    thisDragTo = new CardDOMEvent(event.target);
    const toSpace = thisDragTo.spaceObj;

    // sanity check
    if (thisDragFrom.owner !== PLAYER_FRIENDLY) { return false; }
    // prevent the card you just dragged for showing a border on itself
    if (fromSpace.DOM === toSpace.DOM) { return false; }

    const isToFriendlyNatial = (thisDragTo.owner === PLAYER_FRIENDLY && thisDragTo.isNatial);
    const isToEnemyNatial = (thisDragTo.owner === PLAYER_ENEMY && thisDragTo.isNatial);

    // decide what to do based on what kind of card was dragged where
    // spell: handle differently based on the specific spell
    if (thisDragFrom.isSpell
        && spellDragValidation(fromSpace, toSpace)) {
            toSpace.DOM.classList.add("target-valid");
    }
    // natial dragged onto empty friendly space: movement possible
    else if (thisDragFrom.isNatial
        && isToFriendlyNatial
        && game.validateMovement(fromSpace, toSpace)) {
        toSpace.DOM.classList.add("target-valid");
    }
    // natial dragged onto occupied enemy space: attack possible
    else if (thisDragFrom.isNatial
        && isToEnemyNatial
        && game.validateAttack(fromSpace, toSpace)) {
        toSpace.DOM.classList.add("target-attack");
    }
    // hand natial dragged onto empty friendly space: summoning possible
    else if (thisDragFrom.isHand
        && isToFriendlyNatial
        && game.validateSummon(fromSpace, toSpace)) {
        toSpace.DOM.classList.add("target-valid");
    }
    // no other moves are legal
    else {
        toSpace.DOM.classList.add("target-invalid");
    }
}

// we don't actually require any continunous action when a tile is being drag
// hovered. this function's sole purpose is to call preventDefault() on the
// dragover listener so that it's possible for the drop listener to fire.
const cardDragOver = (event) => {
    if (!playerCanInteract || gameEnd || skillUsage.selected) { return; }
    
    event.preventDefault();
}

const clearDragVisuals = (event) => {
    event.target.classList.remove("target-valid");
    event.target.classList.remove("target-attack");
    event.target.classList.remove("target-invalid");
}

const cardDragLeave = (event) => {
    clearDragVisuals(event);
}

// ### all of this code needs significant cleanup
const cardDragDrop = (event) => {
    if (!playerCanInteract || gameEnd || skillUsage.selected) { return; }

    event.preventDefault();

    clearDragVisuals(event);
    
    // extract destination information from the event object
    const fromSpace = thisDragFrom.spaceObj;
    thisDragTo = new CardDOMEvent(event.target);
    const toSpace = thisDragTo.spaceObj;

    const isToFriendlyNatial = (thisDragTo.owner === PLAYER_FRIENDLY && thisDragTo.isNatial);
    const isToEnemyNatial = (thisDragTo.owner === PLAYER_ENEMY && thisDragTo.isNatial);

    // decide what to do based on what was dragged into what
    // spells have special validation and should be handled case-by-case
    if (thisDragFrom.isSpell
        && spellDragValidation(fromSpace, toSpace)) {
            fromSpace.activateSpell(toSpace); // ###
    }
    // check for movement: card dragged from board to friendly space
    else if (thisDragFrom.isNatial
        && isToFriendlyNatial
        && game.validateMovement(fromSpace, toSpace)) {
        game.moveNatial(fromSpace, toSpace);
    }
    // check for attacking: card dragged from board to enemy space
    else if (thisDragFrom.isNatial
        && isToEnemyNatial
        && game.validateAttack(fromSpace, toSpace)) {
        game.attackNatial(fromSpace, toSpace);
    }
    // check for summoning: card dragged from hand onto friendly space
    else if (thisDragFrom.isHand
        && isToFriendlyNatial
        && game.validateSummon(fromSpace, toSpace)) {
        game.summonNatial(fromSpace, toSpace);
    }

    return;
}