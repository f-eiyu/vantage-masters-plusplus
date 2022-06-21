// ========== Classes ==========

/*
    general hierarchy of organization:
      - each player contains a deck, hand, and natial zone.
      - a Hand instance holds six HandSpace object instances, each of which can
        hold up to one HandCard instance (or be empty).
      - a NatialZone instance holds up to seven NatialSpace instances, three
        in the back row and four in the front row. each NatialSpace instance
        can hold up to one NatialCard instance (or be empty).
      - Hand and Deck have mostly informational methods to faciliate card
        effects, and a handful of functional ones (ex. placing a card in the
        hand, shuffling the deck, etc).
      - Player tracks properties for the current player (ex. mana) and has
        methods and wrappers that interface with different aspects of player
        control (ex. drawing a card touches both the deck and the hand).
      - NatialSpace and HandSpace contain information about their position,
        some informational methods, and wrappers for methods in their
        contained card.
      - Card instances contain all the information about one specific card
        on the board, in the hand, or in the deck.
*/

class BoardSpace {
    constructor (owner, index) {
        this.card = null;
        this.owner = owner;
        this.index = index;
    }

    // this function could use a good refactor or two
    renderCard() {
        let cardStr = null;

        // empty spaces in card or hand render as blanks
        if (!this.card) {
            this.DOM.innerText = "";
        } else if (this.card.type === "natial") {
            cardStr = `${this.card.name}
            Element: ${getElementName(this.card.element)}
            HP: ${this.card.curHP}/${this.card.maxHP}
            ATK: ${this.card.attack}
            Cost: ${this.card.isMaster ? this.card.skillCost : this.card.cost}
            Actions: ${this.card.currentActions}
            ${this.card.isRanged ? "R" : ""}${this.card.isQuick ? "Q" : ""}
            `;
        } else { // (this.card.type === "spell")
            cardStr = `${this.card.name}
            Cost: ${this.card.cost}
            `
        }

        if (this.owner !== PLAYER_ENEMY && this.card) { setDraggable(this.DOM); }
        this.DOM.innerText = cardStr;
        return cardStr;
    }

    // removes the card in the current NatialSpace from the board
    destroyCard() {
        destroyedCards[this.owner].push(this.card);
        this.card = null;
    }
}

class NatialSpace extends BoardSpace {
    constructor (owner, index, isFrontRow) {
        super(owner, index);
        this.isFrontRow = isFrontRow;
        this.isBackRow = !isFrontRow;
        this.isNatialSpace = true;
        this.isHandSpace = false;

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

    // removes one action for the card in the NatialSpace. if it still has
    // actions left, it can take another move.
    expendAction() {
        this.card.currentActions--;
        this.card.canMove = this.card.currentActions > 0 ? true : false;
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

    // wrapper for dealing damage to the card contained in this NatialSpace;
    // also destroys the card if applicable
    dealDamageToContainedCard(dmg) {
        this.card.takeDamage(dmg);
        if (this.card.curHP <= 0) { this.destroyCard(); }
    }

    // attacks the opposing natial at the indicated opposing NatialSpace using
    // the natial in the current NatialSpace.
    attackNatial(defenderSpace) {
        const thisAttack = this.calculateDamage(defenderSpace);

        this.expendAction();

        // deal damage to enemy
        defenderSpace.dealDamageToContainedCard(thisAttack[0]);
        // deal counterattack damage to self
        this.dealDamageToContainedCard(thisAttack[1]);
        // perform attack

        // attacking will require re-rendering both natial zones
        renderNatials(PLAYER_FRIENDLY);
        renderNatials(PLAYER_ENEMY);

        // check if a player has won as a result of this turn
        checkVictory();

        return true;
    }

    // activates the skill on the currently selected card, on the target at
    // targetSpace, then flags the natial's skill as used.
    activateSkill(targetSpace) {
        this.card.skillCallback(targetSpace);
        if (this.card.isMaster) { // masters use mana for skills
            currentMana[this.owner] -= this.card.skillCost;
        } else { // regular natials' skills are one time use
            this.card.skillReady = false;
        }
        skillUsage.userSpace.expendAction();
        renderAll();
    }
}

class HandSpace extends BoardSpace {
    constructor (owner, index) {
        super(owner, index);

        const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        this.DOMId = `${playerStr}-hand-${this.index}`
        this.DOM = document.getElementById(this.DOMId);

        this.isNatialSpace = false;
        this.isHandSpace = true;
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

    // activates the spell currently contained in handSpace with the target
    // at targetSpace, and then destroys the spell.
    activateSpell(targetSpace) {
        this.card.spellCallback(targetSpace);
        currentMana[this.owner] -= this.card.cost;
        this.destroyCard();
        renderAll();
    }
}

class Card {
    constructor(cardProto) {
        this.cardName = cardProto.name;
        this.cardPortrait = cardProto.portrait;
        this.cardCost = cardProto.cost;
        this.cardType = cardProto.type;
    }

    get name() { return this.cardName; }
    get portraitURL() { return this.cardPortrait; }
    get cost() { return this.cardCost; }
    get type() { return this.cardType; }

    // cost is the only changeable property here
    set cost(newCost) { this.cardCost = Math.max(newCost, 0); }
}

class NatialCard extends Card {
    constructor(cardProto) {
        super(cardProto);

        // general card attributes
        const ELEMENT_NAMES = {
            "ELEMENT_NONE": ELEMENT_NONE,
            "ELEMENT_FIRE": ELEMENT_FIRE,
            "ELEMENT_HEAVEN": ELEMENT_HEAVEN,
            "ELEMENT_EARTH": ELEMENT_EARTH,
            "ELEMENT_WATER": ELEMENT_WATER
        }
        this.cardElement = ELEMENT_NAMES[cardProto.element]
        this.cardMaxHP = cardProto.maxHP;
        this.cardCurrentHP = this.maxHP;
        this.cardAttack = cardProto.attack;

        // properties relating to whether a card can move/attack
        this.cardMaxActions = cardProto.maxActions;
        this.cardCurrentActions = 0;
        this.cardCanMove = false;

        // card flags
        this.cardIsRanged = cardProto.isRanged;
        this.cardIsQuick = cardProto.isQuick;
        this.cardIsMaster = cardProto.isMaster;

        // temporary status effects
        this.sealedTurns = 0;
        this.shieldedTurns = 0;
        this.protectedStatus = false;

        // passive callbacks - placeholder for now
        this.cardPassiveCbName = cardProto.passiveCallbackName;

        // skill callbacks
        this.cardSkillCbName = cardProto.skillCallbackName;
        this.cardSkillReady = Boolean(this.skillCallbackName);
        this.cardSkillCost = cardProto.skillCost;
    }

    get element() { return this.cardElement; }
    get curHP() { return this.cardCurrentHP; }
    get maxHP() { return this.cardMaxHP; }
    get attack() { return this.cardAttack; }
    get maxActions() { return this.cardMaxActions; }
    get currentActions() { return this.cardCurrentActions; }
    get canMove() { return this.cardCanMove; }
    get isRanged() { return this.cardIsRanged; }
    get isQuick() { return this.cardIsQuick; }
    get isMaster() { return this.cardIsMaster; }
    get sealed() { return this.sealedTurns; }
    get shielded() { return this.shieldedTurns; }
    get protected() { return this.protectedStatus; }
    get hasPassive() { return Boolean(this.cardPassiveCbName); }
    get passiveCbName() { return this.cardPassiveCbName; }
    get hasSkill() { return Boolean(this.cardSkillCbName); }
    get skillCbName() { return this.cardSkillCbName; }
    get skillReady() { return this.cardSkillReady; }
    get skillCost() { return this.cardSkillCost; }

    set element(newElement) {
        if (newElement >= ELEMENT_NONE && newElement <= ELEMENT_WATER) {
            this.cardElement = newElement;
        } else {
            this.cardElement = ELEMENT_NONE;
        }
    }
    set curHP(newHP) { // deck masters capped by their max HP, natials are not
        this.cardCurrentHP = newHP;
        if (this.cardIsMaster && this.cardCurrentHP > this.cardMaxHP) { 
            this.cardCurrentHP = this.cardMaxHP;
        }
    }
    set attack(newAtk) { this.cardAttack = Math.max(newAtk, 0); }
    set currentActions(newActions) { this.cardCurrentActions = newActions; }
    set canMove(newCanMove) { this.cardCanMove = newCanMove; }
    set sealed(newSealed) { this.sealedTurns = Math.max(newSealed, 0); }
    set shielded(newShield) { this.shieldedTurns = Math.max(newShield, 0); }
    set protected(newProt) { this.protectedStatus = newProt; }
    set skillReady(newReady) { this.cardSkillReady = newReady; }

    // deals the specified amount of damage to this natial, if applicable
    takeDamage(dmg) {
        if (this.shielded) { this.shielded--; }
        else { this.curHP -= dmg; }
    }

    // restores the card's HP by the specified amount.
    restoreHP(amount) {
        this.card.curHP += amount;
    }

    // increases the card's attack stat by the specified amount
    buffAtk = (amount) => {
        this.attack = Math.max(this.attack + amount, 0);
    }

    skillCallback(target) {
        natialActiveCallbacks[this.cardSkillCallbackName](target);
    }
}

class SpellCard extends Card {
    constructor(cardProto) {
        super(cardProto);

        this.callbackName = cardProto.callbackName;
        this.longdesc = cardProto.longdesc;
    }

    // wrapper for the spell effect's callback
    spellCallback(target) {
        spellCallbacks[this.callbackName](target);
    }
}

// to be honest, this is mostly a wrapper for the actual javascript object that
// corresponds to the specified event.target DOM. however, it ended up being
// useful for the wrapper to have a bit of self-awareness, so here we are!
class CardDOMEvent {
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

        if (this.spaceObj.card
            && this.spaceObj.card.type === "spell") {
            this.isSpell = true;
        } else {
            this.isSpell = false;
        }
    }
}

class NatialSkillEvent {
    constructor(userSpace, skillSelection = true) {
        this.userSpace = userSpace;
        this.selected = skillSelection;
    }

    purge() {
        this.userSpace = null;
        this.selected = false;
    }
}

class NatialZone {

}

class Hand extends Array {
    constructor() {

    }

    countCards() {

    }

    isEmpty() {

    }

    isFull() {

    }
}

class Deck extends Array {

}

class Player {
    constructor() {
        
        this.natialZone = new NatialZone();
        this.hand = new Hand();
        this.deck = new Deck();
    }

    drawCard(n = 1) {
        return;
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

let skillUsage = new NatialSkillEvent(null, false);