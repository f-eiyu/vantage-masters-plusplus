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

      - The code tries to avoid reading anything from the DOM except when
        absolutely necessary. Ideally, DOM is for UI only!
*/

class BoardSpace {
    constructor (owner, index) {
        this.containedCard = null;
        this.owner = owner;
        this.index = index;
    }

    get hasCard() { return (this.containedCard !== null); }
    get innerCard() { return this.containedCard; }

    get card() { throw "old .innerCard property; refactor this!"; }

    set innerCard(newCard) {
        if (this.hasCard) {
            
        }

    }

    // this function could use a good refactor or two
    renderCard() {
        let cardStr = null;

        // empty spaces in card or hand render as blanks
        if (!this.hasCard) {
            this.DOM.innerText = "";
        } else if (this.innerCard.type === "natial") {
            cardStr = `${this.innerCard.name}
            Element: ${getElementName(this.innerCard.element)}
            HP: ${this.innerCard.curHP}/${this.innerCard.maxHP}
            ATK: ${this.innerCard.attack}
            Cost: ${this.innerCard.isMaster ? this.innerCard.skillCost : this.innerCard.cost}
            Actions: ${this.innerCard.currentActions}
            ${this.innerCard.isRanged ? "R" : ""}${this.innerCard.isQuick ? "Q" : ""}
            `;
        } else { // (this.innerCard.type === "spell")
            cardStr = `${this.innerCard.name}
            Cost: ${this.innerCard.cost}
            `
        }

        if (this.owner !== PLAYER_ENEMY && this.hasCard) { setDraggable(this.DOM); }
        this.DOM.innerText = cardStr;
        return cardStr;
    }

    // removes the card in the current NatialSpace from the board
    destroyCard() {
        destroyedCards[this.owner].push(this.innerCard);
        this.innerCard = null;
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
    checkMovementPossible(targetSpace) { // ### belongs in Board class
        // fail if target space is not empty
        if (targetSpace.hasCard) { return false; }
        // fail if the card has no moves
        if (!this.innerCard.canMove) { return false; }

        return true;
    }

    // moves the card object from the calling NatialSpace into the requested
    // destination NatialSpace.
    moveNatial(targetSpace) { // ### belongs in Board class
        targetSpace.innerCard = this.innerCard;
        this.innerCard = null;

        targetSpace.innerCard.canMove = false;

        // movement will always require a re-render
        renderNatials(this.owner);

        return true;
    }

    // returns true if the card is in the back row and any cards exist in the
    // front row, and false otherwise
    hasCardInFront = () => { // ### belongs in Board class
        if (!this.isBackRow) { return false; }

        const inFront = natials[this.owner][ROW_FRONT].reduce((front, space) => {
            return (front || Boolean(space.innerCard));
        }, false);

        return inFront;
    }

    // calculates the damage that would be dealt if the card in this space
    // attacked the card at targetSpace. returns an array [damage to target,
    // counterattack damage to self].
    calculateDamage(targetSpace) { // ### belongs in Board class
        const myAtk = this.innerCard.attack;
        const myElement = this.innerCard.element;
        const oppAtk = targetSpace.innerCard.attack;
        const oppElement = targetSpace.innerCard.element;

        // all damage is floored at zero, and counterattacks do 1 less damage
        // than a directed attack
        let myDmg = Math.max(myAtk + TYPE_CHART[myElement][oppElement], 0);
        let counterDmg = Math.max(oppAtk + TYPE_CHART[oppElement][myElement] - 1, 0);

        // there's some nuance as to whether counterattacking is possible:
        // a ranged card attacking from the back will never be counterattacked.
        if (this.innerCard.isRanged && this.isBackRow) {
            counterDmg = 0;
        }
        // a ranged card attacking from the front might not be counterattacked.
        // if the target is in the back and there are cards in front of it,
        // the attacker will not be counterattacked (even if the target is
        // ranged). counterattacks will trigger as normal if the attacker hits
        // the front row or if the front row is empty.
        else if (this.innerCard.isRanged && targetSpace.isBackRow && targetSpace.hasCardInFront()) {
            counterDmg = 0;
        }
        // sealed units do not counterattack, though that's not implemented
        // as of right now.
        // else if (sealed)

        return [myDmg, counterDmg];
    }

    // removes one action for the card in the NatialSpace. if it still has
    // actions left, it can take another move.
    expendAction() { // belongs in Card class
        this.innerCard.currentActions--;
        this.innerCard.canMove = this.innerCard.currentActions > 0 ? true : false;
    }

    // checks whether an attack is possible. failure conditions include the
    // target space being empty, the card not having any attacks left, and a
    // non-ranged card attempting to atttack from the back row. returns the
    // (truthy) result of calculateDamage() above if the attack is allowable,
    // and false otherwise.
    checkAttackPossible(targetSpace) { // ### belongs in Board class, probably
        // fail if the target space is empty
        if (!targetSpace.hasCard) { return false; }
        // fail if the card has no actions
        if (!this.innerCard.currentActions) { return false; }
        // fail if attacker is not ranged and targeting the back and there's
        // anything in the target's front row
        if (!this.innerCard.isRanged && targetSpace.isBackRow && targetSpace.hasCardInFront()) {
            return false;
        }
        // fail if attacker is not ranged, in the back, and behind another card
        if (!this.innerCard.isRanged && this.isBackRow && this.hasCardInFront()){
            return false;
        }

        return this.calculateDamage(targetSpace);
    }

    // wrapper for dealing damage to the card contained in this NatialSpace;
    // also destroys the card if applicable
    dealDamageToInnerCard(dmg) {
        this.innerCard.takeDamage(dmg);
        if (this.innerCard.curHP <= 0) { this.destroyCard(); }
    }

    // attacks the opposing natial at the indicated opposing NatialSpace using
    // the natial in the current NatialSpace.
    attackNatial(defenderSpace) { // ### belongs in Board class
        const thisAttack = this.calculateDamage(defenderSpace);

        this.expendAction();

        // deal damage to enemy
        defenderSpace.dealDamageToContainedCard(thisAttack[0]);
        // deal counterattack damage to self
        this.dealDamageToInnerCard(thisAttack[1]);
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
    activateSkill(targetSpace) { // belongs in Card class, wrapper and logic here
        this.innerCard.skillCallback(targetSpace);
        if (this.innerCard.isMaster) { // masters use mana for skills
            currentMana[this.owner] -= this.innerCard.skillCost;
        } else { // regular natials' skills are one time use
            this.innerCard.skillReady = false;
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
        if (targetSpace.hasCard) { return false; }
        // fail if insufficient mana
        if (currentMana[this.owner] < this.innerCard.cost) { return false; }

        return true;
    }

    // move the card object from the calling HandSpace to the requested
    // NatialSpace on the board.
    summonNatial(targetSpace) {
        // summoning will almost always require mana
        if (currentMana[this.owner] < this.innerCard.cost) { return false; }
        currentMana[this.owner] -= this.innerCard.cost;

        // summon the specified natial!
        targetSpace.innerCard = this.innerCard;
        this.innerCard = null;

        // give the natial action(s) if it's quick
        if (targetSpace.innerCard.isQuick) {
            targetSpace.innerCard.currentActions = targetSpace.innerCard.maxActions;
            targetSpace.innerCard.canMove = true;
        } else {
            targetSpace.innerCard.currentActions = 0;
            targetSpace.innerCard.canMove = false;
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
        this.innerCard.spellCallback(targetSpace);
        currentMana[this.owner] -= this.innerCard.cost;
        this.destroyCard();
        renderAll();
    }
}

class Card {
    constructor(cardProto) {
        this.innerCardName = cardProto.name;
        this.innerCardPortrait = cardProto.portrait;
        this.innerCardCost = cardProto.cost;
        this.innerCardType = cardProto.type;
    }

    get name() { return this.innerCardName; }
    get portraitURL() { return this.innerCardPortrait; }
    get cost() { return this.innerCardCost; }
    get type() { return this.innerCardType; }

    // cost is the only changeable property here; all others should be read-only
    set cost(newCost) { this.innerCardCost = Math.max(newCost, 0); }
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
        this.innerCardElement = ELEMENT_NAMES[cardProto.element]
        this.innerCardMaxHP = cardProto.maxHP;
        this.innerCardCurrentHP = this.maxHP;
        this.innerCardAttack = cardProto.attack;

        // properties relating to whether a card can move/attack
        this.innerCardMaxActions = cardProto.maxActions;
        this.innerCardCurrentActions = 0;
        this.innerCardCanMove = false;

        // card flags
        this.innerCardIsRanged = cardProto.isRanged;
        this.innerCardIsQuick = cardProto.isQuick;
        this.innerCardIsMaster = cardProto.isMaster;

        // temporary status effects
        this.sealedTurns = 0;
        this.shieldedTurns = 0;
        this.protectedStatus = false;

        // passive callbacks - placeholder for now
        this.innerCardPassiveCbName = cardProto.passiveCallbackName;

        // skill callbacks
        this.innerCardSkillCbName = cardProto.skillCallbackName;
        this.innerCardSkillReady = Boolean(this.skillCallbackName);
        this.innerCardSkillCost = cardProto.skillCost;
    }

    get element() { return this.innerCardElement; }
    get curHP() { return this.innerCardCurrentHP; }
    get maxHP() { return this.innerCardMaxHP; }
    get attack() { return this.innerCardAttack; }
    get maxActions() { return this.innerCardMaxActions; }
    get currentActions() { return this.innerCardCurrentActions; }
    get canMove() { return this.innerCardCanMove; }
    get isRanged() { return this.innerCardIsRanged; }
    get isQuick() { return this.innerCardIsQuick; }
    get isMaster() { return this.innerCardIsMaster; }
    get sealed() { return this.sealedTurns; }
    get shielded() { return this.shieldedTurns; }
    get protected() { return this.protectedStatus; }
    get hasPassive() { return Boolean(this.innerCardPassiveCbName); }
    get passiveCbName() { return this.innerCardPassiveCbName; }
    get hasSkill() { return Boolean(this.innerCardSkillCbName); }
    get skillCbName() { return this.innerCardSkillCbName; }
    get skillReady() { return this.innerCardSkillReady; }
    get skillCost() { return this.innerCardSkillCost; }

    set element(newElement) {
        if (newElement >= ELEMENT_NONE && newElement <= ELEMENT_WATER) {
            this.innerCardElement = newElement;
        } else {
            this.innerCardElement = ELEMENT_NONE;
        }
    }
    set curHP(newHP) { // deck masters capped by their max HP, natials are not
        this.innerCardCurrentHP = newHP;
        if (this.innerCardIsMaster && this.innerCardCurrentHP > this.innerCardMaxHP) { 
            this.innerCardCurrentHP = this.innerCardMaxHP;
        }
    }
    set attack(newAtk) { this.innerCardAttack = Math.max(newAtk, 0); }
    set currentActions(newActions) { this.innerCardCurrentActions = newActions; }
    set canMove(newCanMove) { this.innerCardCanMove = newCanMove; }
    set sealed(newSealed) { this.sealedTurns = Math.max(newSealed, 0); }
    set shielded(newShield) { this.shieldedTurns = Math.max(newShield, 0); }
    set protected(newProt) { this.protectedStatus = newProt; }
    set skillReady(newReady) { this.innerCardSkillReady = newReady; }

    // deals the specified amount of damage to this natial, if applicable
    takeDamage(dmg) {
        if (this.shielded) { this.shielded--; }
        else { this.curHP -= dmg; }
    }

    // restores the card's HP by the specified amount.
    restoreHP(amount) {
        this.innerCard.curHP += amount;
    }

    // increases the card's attack stat by the specified amount
    buffAtk = (amount) => {
        this.attack = Math.max(this.attack + amount, 0);
    }

    skillCallback(target) {
        natialActiveCallbacks[this.innerCardSkillCallbackName](target);
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

        if (this.spaceObj.innerCard
            && this.spaceObj.innerCard.type === "spell") {
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