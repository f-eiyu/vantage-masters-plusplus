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
        this._containedCard = null;
        this._owner = owner;
        this._index = index;
    }

    get hasCard() { return (this._containedCard !== null); }
    get innerCard() { return this._containedCard; }

    get card() { throw "old .innerCard property; refactor this!"; }


    // only intended to be called by methods like Player.drawCard(). there is
    // no public method to replace the contents of a BoardSpace instance!
    _cardToSpace(cardObj) {
        if (cardObj && cardObj instanceof Card) {
            this._containedCard = cardObj;
        }
        else { throw "invalid object passed to BoardSpace!"; }
    }

    // removes the reference to the card contained in the current BoardSpace
    // instance, without any additional action. not intended to be used to clear
    // spaces by itself -- for regular gameplay use, destroyCard() is the
    // method to use!
    _clear() {
        this.innerCard = null;
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

        if (this._owner !== PLAYER_ENEMY && this.hasCard) { setDraggable(this.DOM); }
        this.DOM.innerText = cardStr;
        return cardStr;
    }

    // removes a card from the board or hand via regular gameplay
    destroyCard() {
        destroyedCards[this._owner].push(this.innerCard);
        this._clear();
    }
}

class NatialSpace extends BoardSpace {
    constructor (owner, index, isFrontRow) {
        super(owner, index);
        this._isFrontRow = isFrontRow;
        this._isBackRow = !isFrontRow;
        this._isNatialSpace = true;
        this._isHandSpace = false;

        const playerStr = (this._owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        const rowStr = (this._isFrontRow ? "front" : "back");
        this._DOMId = `${playerStr}-${rowStr}-${this._index}`
        this._DOM = document.getElementById(this._DOMId);
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
        renderNatials(this._owner);

        return true;
    }

    // returns true if the card is in the back row and any cards exist in the
    // front row, and false otherwise
    hasCardInFront = () => { // ### belongs in Board class
        if (!this._isBackRow) { return false; }

        const inFront = natials[this._owner][ROW_FRONT].reduce((front, space) => {
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
        if (this.innerCard.isRanged && this._isBackRow) {
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
        if (!this.innerCard.isRanged && this._isBackRow && this.hasCardInFront()){
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
            currentMana[this._owner] -= this.innerCard.skillCost;
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

        const playerStr = (this._owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        this._DOMId = `${playerStr}-hand-${this._index}`
        this._DOM = document.getElementById(this._DOMId);

        this._isNatialSpace = false;
        this._isHandSpace = true;
    }

    // checks to see whether the natial can be summoned to the target space.
    // failure conditions include the space already being occupied and having
    // insufficient mana to perform the summon. returns true if the summon is
    // allowed and false otherwise.
    checkSummonPossible(targetSpace) {
        // fail if target space is not tempty
        if (targetSpace.hasCard) { return false; }
        // fail if insufficient mana
        if (currentMana[this._owner] < this.innerCard.cost) { return false; }

        return true;
    }

    // move the card object from the calling HandSpace to the requested
    // NatialSpace on the board.
    summonNatial(targetSpace) {
        // summoning will almost always require mana
        if (currentMana[this._owner] < this.innerCard.cost) { return false; }
        currentMana[this._owner] -= this.innerCard.cost;

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
        renderHand(this._owner);
        renderNatials(this._owner);
        renderMana(this._owner);

        return true;
    }

    // activates the spell currently contained in handSpace with the target
    // at targetSpace, and then destroys the spell.
    activateSpell(targetSpace) {
        this.innerCard.spellCallback(targetSpace);
        currentMana[this._owner] -= this.innerCard.cost;
        this.destroyCard();
        renderAll();
    }
}

class Card {
    constructor(cardProto) {
        this._cardName = cardProto.name;
        this._cardPortrait = cardProto.portrait;
        this._cardCost = cardProto.cost;
        this._cardType = cardProto.type;
    }

    get name() { return this._cardName; }
    get portraitURL() { return this._cardPortrait; }
    get cost() { return this._cardCost; }
    get type() { return this._cardType; }

    // cost is the only changeable property here; all others should be read-only
    set cost(newCost) { this._cardCost = Math.max(newCost, 0); }
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
        this._cardElement = ELEMENT_NAMES[cardProto.element]
        this._cardMaxHP = cardProto.maxHP;
        this._cardCurrentHP = this.maxHP;
        this._cardAttack = cardProto.attack;

        // properties relating to whether a card can move/attack
        this._cardMaxActions = cardProto.maxActions;
        this._cardCurrentActions = 0;
        this._cardCanMove = false;

        // card flags
        this._cardIsRanged = cardProto.isRanged;
        this._cardIsQuick = cardProto.isQuick;
        this._cardIsMaster = cardProto.isMaster;

        // temporary status effects
        this._sealedTurns = 0;
        this._shieldedTurns = 0;
        this._protectedStatus = false;

        // passive callbacks - placeholder for now
        this._cardPassiveCbName = cardProto.passiveCallbackName;

        // skill callbacks
        this._cardSkillCbName = cardProto.skillCallbackName;
        this._cardSkillReady = Boolean(this.skillCallbackName);
        this._cardSkillCost = cardProto.skillCost;
    }

    get element() { return this._cardElement; }
    get curHP() { return this._cardCurrentHP; }
    get maxHP() { return this._cardMaxHP; }
    get attack() { return this._cardAttack; }
    get maxActions() { return this._cardMaxActions; }
    get currentActions() { return this._cardCurrentActions; }
    get canMove() { return this._cardCanMove; }
    get isRanged() { return this._cardIsRanged; }
    get isQuick() { return this._cardIsQuick; }
    get isMaster() { return this._cardIsMaster; }
    get sealed() { return this._sealedTurns; }
    get shielded() { return this._shieldedTurns; }
    get protected() { return this._protectedStatus; }
    get hasPassive() { return Boolean(this._cardPassiveCbName); }
    get passiveCbName() { return this._cardPassiveCbName; }
    get hasSkill() { return Boolean(this._cardSkillCbName); }
    get skillCbName() { return this._cardSkillCbName; }
    get skillReady() { return this._cardSkillReady; }
    get skillCost() { return this._cardSkillCost; }

    set element(newElement) {
        if (newElement >= ELEMENT_NONE && newElement <= ELEMENT_WATER) {
            this._cardElement = newElement;
        } else {
            this._cardElement = ELEMENT_NONE;
        }
    }
    set curHP(newHP) { // deck masters capped by their max HP, natials are not
        this._cardCurrentHP = newHP;
        if (this._cardIsMaster && this._cardCurrentHP > this._cardMaxHP) { 
            this._cardCurrentHP = this._cardMaxHP;
        }
    }
    set attack(newAtk) { this._cardAttack = Math.max(newAtk, 0); }
    set currentActions(newActions) { this._cardCurrentActions = newActions; }
    set canMove(newCanMove) { this._cardCanMove = newCanMove; }
    set sealed(newSealed) { this._sealedTurns = Math.max(newSealed, 0); }
    set shielded(newShield) { this._shieldedTurns = Math.max(newShield, 0); }
    set protected(newProt) { this._protectedStatus = newProt; }
    set skillReady(newReady) { this._cardSkillReady = newReady; }

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

        this._callbackName = cardProto.callbackName;
        this._longdesc = cardProto.longdesc;
    }

    // wrapper for the spell effect's callback
    spellCallback(target) {
        spellCallbacks[this._callbackName](target);
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
    constructor(player) {
        this._front = Array(4).fill(null).map((el, i) => new NatialSpace(player, i, true));
        this._back = Array(3).fill(null).map((el, i) => new NatialSpace(player, i, false));
    }
}

class Hand {
    constructor(player) {
        this._handCards = Array(6).fill(null).map((el, i) => new HandSpace(player, i));
    }

    // returns the HandSpace instance at the specified index
    getSpaceAt(index) {
        if (index < 0 || index >= HAND_SIZE_LIMIT) {
            throw "Hand index out of bounds!";
        }

        return this._handCards[index];
    }
    // returns the index of the first empty handSpace in Hand. if there are 
    // no empty handSpaces, returns HAND_SIZE_LIMIT.
    get firstEmpty() {
        let firstEmpty = 0;

        for(firstEmpty; firstEmpty < HAND_SIZE_LIMIT; firstEmpty++) {
            if (!this.getSpaceAt(firstEmpty).hasCard) { return firstEmpty; }
        }

        return firstEmpty;
    }
    get isFull() { return (this.firstEmpty === HAND_SIZE_LIMIT); }
    get isEmpty() { return (this.firstEmpty === 0); }
    get cardCount() {
        return this._handCards.reduce((cardTotal, nextSpace) => {
            return cardTotal + (nextSpace.hasCard ? 1 : 0);
        }, 0);
    }

    cardToHand(index, cardObj) {
        if (this.getSpaceAt(index).hasCard) {
            throw "assignment to occupied Hand index!"
        }

        this.getSpaceAt(index)._cardToSpace(cardObj);
    }
}

class Deck {
    constructor(player, deckCards) {
        this._deckCards = deckCards.slice();
        this.shuffle();
    }

    get length() { return this._deckCards.length; }
    
    pop() { return this._deckCards.pop(); }

    shuffle() {
        // wrap each card in an object to associate it with a random seed
        const toShuffle = this._deckCards.map((card) => {
            return {"card": card, "seed": Math.random()};
        });

        // order the cards according to their random seed
        toShuffle.sort((cardOne, cardTwo) => {
            return cardOne.seed - cardTwo.seed;
        });

        // extract the cards from their wrappers
        const shuffled = toShuffle.map(wrapper => wrapper.card);

        this._deckCards = shuffled;
    }
}

class Player {
    constructor(player, deckCards) {
        this._master = deckCards.pop();

        this._natialZone = new NatialZone(player);
        this._hand = new Hand(player);
        this._deck = new Deck(player, deckCards);
    }

    get hand() { return this._hand; }
    get deck() { return this._deck; }

    drawCard(n = 1, render = true) {
        if (!this._deck.length) { return false; }
        if (this._hand.isFull) { return false; }

        const firstEmpty = this.hand.firstEmpty;
        const drawnCard = this.deck.pop();

        this.hand.cardToHand(firstEmpty, drawnCard);

        if (render) { renderAll(); }
        return true;
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

const players = [];