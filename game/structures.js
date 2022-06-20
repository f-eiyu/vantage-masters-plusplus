// ========== Classes ==========

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
            Actions: ${this.card.currentActions}
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

    // checks whether movement is possible. failure conditions include the card
    // having no more movement available or the space already being occupied.
    // returns true if the movement is allowable, and false otherwise.
    checkMovementPossible(targetSpace) {
        // fail if target space is not empty
        if (targetSpace.card) { return false; }
        // fail if the card has no moves
        if (!this.card.canMove) { return false; }

        return true;
    }

    // moves the card object from the calling NatialSpace into the requested
    // destination NatialSpace.
    moveNatial(targetSpace) {
        targetSpace.card = this.card;
        this.card = null;

        targetSpace.card.canMove = false;

        // movement will always require a re-render
        renderNatials(this.owner);

        return true;
    }

    // returns true if the card is in the back row and any cards exist in the
    // front row, and false otherwise
    hasCardInFront = () => {
        if (!this.isBackRow) { return false; }

        const inFront = natials[this.owner][ROW_FRONT].reduce((front, space) => {
            return (front || Boolean(space.card));
        }, false);

        return inFront;
    }

    // calculates the damage that would be dealt if the card in this space
    // attacked the card at targetSpace. returns an array [damage to target,
    // counterattack damage to self].
    calculateDamage(targetSpace) {
        const myAtk = this.card.attack;
        const myElement = this.card.element;
        const oppAtk = targetSpace.card.attack;
        const oppElement = targetSpace.card.element;

        // all damage is floored at zero, and counterattacks do 1 less damage
        // than a directed attack
        let myDmg = Math.max(myAtk + TYPE_CHART[myElement][oppElement], 0);
        let counterDmg = Math.max(oppAtk + TYPE_CHART[oppElement][myElement] - 1, 0);

        // there's some nuance as to whether counterattacking is possible:
        // a ranged card attacking from the back will never be counterattacked.
        if (this.card.isRanged && this.isBackRow) {
            counterDmg = 0;
        }
        // a ranged card attacking from the front might not be counterattacked.
        // if the target is in the back and there are cards in front of it,
        // the attacker will not be counterattacked (even if the target is
        // ranged). counterattacks will trigger as normal if the attacker hits
        // the front row or if the front row is empty.
        else if (this.card.isRanged && targetSpace.isBackRow && targetSpace.hasCardInFront()) {
            counterDmg = 0;
        }
        // sealed units do not counterattack, though that's not implemented
        // as of right now.
        // else if (sealed)

        return [myDmg, counterDmg];
    }

    // checks whether an attack is possible. failure conditions include the
    // target space being empty, the card not having any attacks left, and a
    // non-ranged card attempting to atttack from the back row. returns the
    // (truthy) result of calculateDamage() above if the attack is allowable,
    // and false otherwise.
    checkAttackPossible(targetSpace) {
        // fail if the target space is empty
        if (!targetSpace.card) { return false; }
        // fail if the card has no actions
        if (!this.card.currentActions) { return false; }
        // fail if attacker is not ranged and targeting the back and there's
        // anything in the target's front row
        if (!this.card.isRanged && targetSpace.isBackRow && targetSpace.hasCardInFront()) {
            return false;
        }
        // fail if attacker is not ranged, in the back, and behind another card
        if (!this.card.isRanged && this.isBackRow && this.hasCardInFront()){
            return false;
        }

        return this.calculateDamage(targetSpace);
    }

    // attacks the opposing natial at the indicated opposing NatialSpace using
    // the natial in the current NatialSpace.
    attackNatial(defenderSpace) {
        const attacker = this.card;
        const defender = defenderSpace.card;
        const thisAttack = this.calculateDamage(defenderSpace);

        // perform attack
        defender.currentHP -= thisAttack[0];
        
        // perform counterattack
        attacker.currentHP -= thisAttack[1];

        // remove one action for the attacker. if it still has actions left,
        // it gains a move; otherwise, it cannot move after attacking.
        attacker.currentActions--;
        attacker.canMove = attacker.currentActions > 0 ? true : false;

        // remove either card if its HP falls to zero
        if (attacker.currentHP <= 0) { this.destroyCard(); }
        if (defender.currentHP <= 0) { defenderSpace.destroyCard(); }

        // attacking will require re-rendering both natial zones
        renderNatials(PLAYER_FRIENDLY);
        renderNatials(PLAYER_ENEMY);

        // check if a player has won as a result of this turn
        checkVictory();

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

    // checks to see whether the natial can be summoned to the target space.
    // failure conditions include the space already being occupied and having
    // insufficient mana to perform the summon. returns true if the summon is
    // allowed and false otherwise.
    checkSummonPossible(targetSpace) {
        // fail if target space is not tempty
        if (targetSpace.card) { return false; }
        // fail if insufficient mana
        if (currentMana[this.owner] < this.card.cost) { return false; }

        return true;
    }

    // move the card object from the calling HandSpace to the requested
    // NatialSpace on the board.
    summonNatial(targetSpace) {
        // summoning will almost always require mana
        if (currentMana[this.owner] < this.card.cost) { return false; }
        currentMana[this.owner] -= this.card.cost;

        // summon the specified natial!
        targetSpace.card = this.card;
        this.card = null;

        // give the natial action(s) if it's quick
        if (targetSpace.card.isQuick) {
            targetSpace.card.currentActions = targetSpace.card.maxActions;
            targetSpace.card.canMove = true;
        } else {
            targetSpace.card.currentActions = 0;
            targetSpace.card.canMove = false;
        }

        // summoning will always require a re-render
        renderHand(this.owner);
        renderNatials(this.owner);
        renderMana(this.owner);

        return true;
    }

    // activates a spell. to be implemented.
    activateSpell() {
        return false;
    }
}

class card {
    constructor(cardProto) {
        this.name = cardProto.name;
        this.portrait = cardProto.portrait;
        this.cost = cardProto.cost;
        this.type = cardProto.type;
    }
}

class cardNatial extends card {
    constructor(cardProto) {
        super(cardProto);

        // general card attributes
        this.element = eval(cardProto.element);
        this.maxHP = cardProto.maxHP;
        this.currentHP = this.maxHP;
        this.attack = cardProto.attack;

        // properties relating to whether a card can move/attack
        this.maxActions = cardProto.maxActions;
        this.currentActions = 0;
        this.canMove = false;

        // card flags
        this.isRanged = cardProto.isRanged;
        this.isQuick = cardProto.isQuick;
        this.isMaster = cardProto.isMaster;

        // temporary status effects
        this.sealed = 0;
        this.shielded = 0;
        this.protected = false;

        // passive callbacks - placeholder for now
        this.hasPassive = cardProto.hasPassive;

        // active callbacks - placeholder for now
        this.hasSkill = cardProto.hasSkill;
    }
}

class cardSpell extends card {
    constructor(cardProto) {
        super(cardProto);

        // placeholder for now
    }
}

// to be honest, this is mostly a wrapper for the actual javascript object that
// corresponds to the specified event.target DOM. however, it ended up being
// useful for the wrapper to have a bit of self-awareness, so here we are!
class cardDOMEvent {
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


// ========== Non-class structures ==========

const decks = [[], []]; // friendly, enemy
const hands = [
    Array(6).fill(null).map((el, i) => new HandSpace(PLAYER_FRIENDLY, i)), // friendly
    Array(6).fill(null).map((el, i) => new HandSpace(PLAYER_ENEMY, i)) // enemy
];
const natials = [
    [ // friendly
        Array(4).fill(null).map((el, i) => new NatialSpace(PLAYER_FRIENDLY, i, true)), // front
        Array(3).fill(null).map((el, i) => new NatialSpace(PLAYER_FRIENDLY, i, false)), // back
    ],
    [ // enemy
        Array(4).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, true)), // front
        Array(3).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, false)) // back
    ]
];
const destroyedCards = [[], []]; // friendly, enemy

let masters = [null, null]; // friendly, enemy

let maxMana = [null, null]; // friendly, enemy
let currentMana = [null, null] // friendly, enemy