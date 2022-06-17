class boardSpace {
    constructor (owner, index) {
        this.card = null;
        this.owner = owner;
        this.index = index;
    }

    renderCard() {
        // empty spaces in card or hand render as blanks
        if (!this.card) {
            this.DOM.innerText = "";
            this.DOM.setAttribute("draggable", false);
        } else {
            const cardStr = `${this.owner === PLAYER_ENEMY ? "??? " : ""}${this.card.name}
            Element: ${getElementName(this.card.element)}
            HP: ${this.card.currentHP}/${this.card.maxHP}
            ATK: ${this.card.attack}
            Cost: ${this.card.cost}
            ${this.card.isRanged ? "R" : ""}${this.card.isQuick ? "Q" : ""}
            `;

            this.DOM.innerText = cardStr;

            if (this.owner !== PLAYER_ENEMY) { setDraggable(this.DOM); }
        }
    }

    // removes the card in the current NatialSpace from the board
    destroyCard() {
        destroyedCards[this.owner].push(this.card);
        this.card = null;
    }
}

class NatialSpace extends boardSpace {
    constructor (owner, index, isFrontRow) {
        super(owner, index);
        this.isFrontRow = isFrontRow;
        this.isBackRow = !isFrontRow;

        const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        const rowStr = (this.isFrontRow ? "front" : "back");
        this.DOMId = `${playerStr}-${rowStr}-${this.index}`
        this.DOM = document.getElementById(this.DOMId);
    }

    // moves the card object from the calling NatialSpace into the requested
    // destination NatialSpace.
    moveNatial(targetSpace) {

        targetSpace.card = this.card;
        this.card = null;

        // movement will always require a re-render
        renderNatials(this.owner);

        return true;
    }

    // attacks the opposing natial at the indicated opposing NatialSpace using
    // the natial in the current NatialSpace.
    attackNatial(defenderSpace) {
        const opponent = defenderSpace.owner;

        // perform the attack
        const attacker = this.card;
        defenderSpace.card.currentHP -= attacker.attack;

        // remove the defender from the board if it dies
        if (defenderSpace.card.currentHP <= 0) {
            defenderSpace.destroyCard();
        }

        // attacking will generally require re-rendering both natial zones
        renderNatials(this.owner);
        renderNatials(opponent);

        return true;
    }
}

class HandSpace extends boardSpace {
    constructor (owner, index) {
        super(owner, index);

        const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        this.DOMId = `${playerStr}-hand-${this.index}`
        this.DOM = document.getElementById(this.DOMId);
    }

    // move the card object from the calling HandSpace to the requested
    // NatialSpace on the board.
    summonNatial(targetSpace) {
        targetSpace.card = this.card;
        this.card = null;

        // summoning will always require a re-render
        renderHand(this.owner);
        renderNatials(this.owner);

        return true;
    }

    // activates a spell. to be implemented.
    activateSpell() {
        return false;
    }
}

class card {

}

class cardNatial extends card {

}

class cardSpell extends card {

}

class dragInfo {
    constructor(draggedDOM) {
        this.isFrontNatial = draggedDOM.classList.contains("front-natial");
        this.isBackNatial = draggedDOM.classList.contains("back-natial");
        this.isNatial = this.isFrontNatial || this.isBackNatial;
        this.isHandCard = !this.isNatial;

        this.inRow = this.isFrontNatial ? ROW_FRONT : ROW_BACK;
        this.index = parseInt(draggedDOM.id.slice(-1));
        this.owner = draggedDOM.classList.contains("friendly") ? PLAYER_FRIENDLY : PLAYER_ENEMY;

        this.spaceObj = (this.isNatial ? 
            natials[this.owner][this.inRow][this.index] :
            hands[this.owner][this.index]);
    }
}