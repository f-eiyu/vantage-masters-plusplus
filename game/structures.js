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
        this._cardSkillReady = Boolean(this._cardSkillCbName);
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
        if (dmg <= 0) { return; } // taking 0 damage should not break shields
        else if (this.shielded) { this.shielded--; }
        else { this.curHP -= dmg; }
    }

    // restores the card's HP by the specified amount.
    restoreHP(amount) {
        this.curHP += amount;
    }

    // increases the card's attack stat by the specified amount
    buffAtk(amount) {
        this.attack = Math.max(this.attack + amount, 0);
    }

    // removes one action for the current card. if it has any actions left, it
    // can perform another movement.
    expendAction() {
        this.currentActions--;
        this.canMove = (this.currentActions > 0);
    }

    // refunds all the natial's actions and enables it to move
    refresh() {
        this.currentActions = this.maxActions;
        this.canMove = true;
    }

    // wrapper for the skill effect's callback
    skillCallback(userSpace, targetSpace) {
        natialActiveCallbacks[this.skillCbName](userSpace, targetSpace);
    }
}

class SpellCard extends Card {
    constructor(cardProto) {
        super(cardProto);

        this._callbackName = cardProto.callbackName;
        this._longdesc = cardProto.longdesc;
    }

    get callbackName() { return this._callbackName; }
    get longdesc() { return this._longdesc; }
    
    // wrapper for the spell effect's callback
    spellCallback(target) {
        spellCallbacks[this._callbackName](target);
    }
}

class BoardSpace {
    constructor (owner, index) {
        this._containedCard = null;
        this._owner = owner;
        this._index = index;
    }

    get owner() { return this._owner; }
    get index() { return this._index; }
    get hasCard() { return (this._containedCard !== null); }
    get innerCard() { return this._containedCard; }

    get card() { throw "old .innerCard property; refactor this!"; }


    // places a card into a BoardSpace, only checking if the parameter is a Card
    // instance. only intended to be called by methods like Player.drawCard()!
    _cardToSpace(cardObj) {
        if (cardObj && cardObj instanceof Card) {
            this._containedCard = cardObj;
        }
        else { throw "invalid object passed to BoardSpace!"; }
    }

    // removes the reference to the card contained in the current BoardSpace
    // instance, without any additional action. not intended to be used for
    // normal destruction of a card; use destroyCard() for that!
    _clear() {
        this._containedCard = null;
    }

    // removes a card from the board or hand and adds it to the discard list
    destroyCard() {
        destroyedCards.byPlayer(this.owner).push(this.innerCard);
        this._clear();
    }

    // this function could use a good refactor or two
    render() {
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

        if (this.owner !== PLAYER_ENEMY && this.hasCard) {
            this.setDraggable();
        } else {
            this.clearDraggable();
        }

        this.DOM.innerText = cardStr;
        return cardStr;
    }

    setDraggable() {
        this.DOM.setAttribute("draggable", "true");
        this.DOM.addEventListener("dragstart", dragStart)
        this.DOM.addEventListener("dragend", (event) => event.target.classList.remove("dragging"));
    }

    clearDraggable() {
        this.DOM.setAttribute("draggable", "false");
        this.DOM.removeEventListener("dragstart", dragStart);
    }
}

class NatialSpace extends BoardSpace {
    constructor (owner, index, row) {
        super(owner, index);
        this._row = row;

        const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        const rowStr = (this.isFrontRow ? "front" : "back");
        this._DOMId = `${playerStr}-${rowStr}-${this._index}`
        this._DOM = document.getElementById(this._DOMId);
    }

    get isNatial() { return true; }
    get isHand() { return false; }
    get row() { return this._row; }
    get isFrontRow() { return this._row === ROW_FRONT; }
    get isBackRow() { return this._row === ROW_BACK; }
    get DOM() { return this._DOM; }

    // wrapper for dealing damage to the contained card instance
    dealDamage(dmg, dmgSource = null) {
        this.innerCard.takeDamage(dmg);
        if (this.innerCard.curHP <= 0) {
            this.destroyCard();
            // ### dmgSource hook/callbacks here
        }
    }

    // activates the skill on the currently selected card, on the target at
    // targetSpace, then flags the natial's skill as used.
    activateSkill(targetSpace) { // ### belongs in Card class, wrapper and logic here
        const player = getPlayer(this.owner);
        this.innerCard.skillCallback(this, targetSpace);
        if (this.innerCard.isMaster) { // masters use mana for skills
            player.currentMana -= this.innerCard.skillCost;
        } else { // regular natials' skills are one time use
            this.innerCard.skillReady = false;
        }
        skillUsage.userSpace.innerCard.expendAction();
        game.renderAll();
    }
}

class HandSpace extends BoardSpace {
    constructor (owner, index) {
        super(owner, index);

        const playerStr = (this._owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        this._DOMId = `${playerStr}-hand-${this._index}`
        this._DOM = document.getElementById(this._DOMId);
    }

    get isNatial() { return false; }
    get isHand() { return true; }
    get DOM() { return this._DOM; }

    // activates the spell currently contained in handSpace with the target
    // at targetSpace, and then destroys the spell.
    activateSpell(targetSpace) {
        this.innerCard.spellCallback(targetSpace);
        getPlayer(this.owner).currentMana -= this.innerCard.cost;
        this.destroyCard();
        game.renderAll();
    }
}

class NatialZone {
    constructor(player) {
        this._front = Array(4).fill(null).map((el, i) => new NatialSpace(player, i, ROW_FRONT));
        this._back = Array(3).fill(null).map((el, i) => new NatialSpace(player, i, ROW_BACK));
    }

    // returns all non-empty NatialSpace instances
    get nonEmpty() {
        const nonEmpty = [];
        nonEmpty.push(...this._front.filter(sp => sp.hasCard));
        nonEmpty.push(...this._back.filter(sp => sp.hasCard));

        // at least one natial (the master) should always be in the natial zone
        if (!nonEmpty.length) { throw "error: no natials found on the board!"; }
        return nonEmpty;
    }
    // returns all empty NatialSpace instances
    get empty() {
        const empty = []
        empty.push(...this._front.filter(sp => !sp.hasCard));
        empty.push(...this._back.filter(sp => !sp.hasCard));
        return empty;
    }
    // returns true if every NatialSpace instance has a card
    get isFull() {
        return (this.empty.length === 0);
    }
    // returns the specified row
    getRow(row) {
        return (row === ROW_FRONT ? this._front : this._back)
    }
    // returns the NatialSpace instance at the specified row and index
    getSpaceAt(row, index) {
        this.validateRowIndex(row, index);

        const thisRow = this.getRow(row);
        return thisRow[index];
    }
    // returns a random empty NatialSpace instance
    getRandomEmpty() {
        const empty = this.empty;
        return empty[Math.floor(Math.random() * empty.length)];
    }
    // returns true if the specified natial is occluded and false otherwise. a
    // natial is occluded if it is in the back row and there is at least one
    // other natial in the front row.
    isOccluded = (space) => {
        if (!space.isBackRow) { return false; }

        const frontRow = this.getRow(ROW_FRONT);
        for (let space of frontRow) {
            if (space.hasCard) { return true; }
        }

        return false;
    }
    
    // returns true if row and index are both valid parameters
    validateRowIndex(row, index) {
        if (row !== ROW_FRONT && row !== ROW_BACK) {
            throw "invalid row argument!";
        }

        const thisRow = this.getRow(row);
        if (index < 0 || index >= thisRow.length || index === undefined) {
            throw "invalid index argument!";
        }
    }
    // returns true if the card in moverSpace can move to targetSpace, and
    // false otherwise.
    validateMovement(moverSpace, targetSpace) {
        // fail if targetSpace is occupied
        if (targetSpace.hasCard) { return false; }
        // fail if the two spaces aren't owned by the same player
        if (moverSpace.owner !== targetSpace.owner) { return false;}
        // fail if mover doesn't have an available move
        if (!moverSpace.innerCard.canMove) { return false; }

        return true;
    }

    // places the specified card in targetSpace if targetSpace is empty
    cardToZone(targetSpace, card) {
        if (targetSpace.hasCard) {
            throw "already occupied natial space in cardToZone!";
        }

        targetSpace._cardToSpace(card);
    }

    // transfers the card instance in moverSpace to targetSpace
    moveNatial(moverSpace, targetSpace) {
        const mover = moverSpace.innerCard;

        this.cardToZone(targetSpace, mover);
        mover.canMove = false;
        moverSpace._clear();

        game.renderAll();
    }

    // performs the indicated callback with each NON-EMPTY space in the
    // indicated row.
    forAllSpacesInRow(row, callback) {
        if (row === ROW_FRONT) {
            this._front.filter(sp => sp.hasCard).forEach((space, i) => callback(space, i));
        } else if (row === ROW_BACK) {
            this._back.filter(sp => sp.hasCard).forEach((space, i) => callback(space, i));
        }
    }
    // performs the indicated callback with each NON-EMPTY natial space.
    forAllSpaces(callback) {
        const nonEmpty = this.nonEmpty;
        nonEmpty.forEach((natialSpace, i) => callback(natialSpace, i));
    }
    // as above, but on the cards in the spaces.
    forAllCards(callback) {
        const nonEmpty = this.nonEmpty;
        nonEmpty.forEach((natialSpace, i) => callback(natialSpace.innerCard, i));
    }

    // removes one turn of seal from every card
    decrementSeal() {
        this.forAllCards(card => card.sealed--);
    }

    // re-draws each NatialSpace instance, including empty ones
    render() {
        this._front.forEach(space => space.render());
        this._back.forEach(space => space.render());
    }
}

class Hand {
    constructor(player) {
        this._handSpaces = Array(6).fill(null).map((el, i) => new HandSpace(player, i));
    }

    // returns the HandSpace instance at the specified index
    getSpaceAt(index) {
        if (index < 0 || index >= HAND_SIZE_LIMIT) {
            throw "Hand index out of bounds!";
        }

        return this._handSpaces[index];
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
        return this._handSpaces.reduce((cardTotal, nextSpace) => {
            return cardTotal + (nextSpace.hasCard ? 1 : 0);
        }, 0);
    }
    // returns all non-empty HandSpace instances
    get nonEmpty() {
        return this._handSpaces.filter(sp => sp.hasCard);
    }

    // places the specified card in the indicated HandSpace instance if it
    // is empty
    cardToHand(index, cardObj) {
        if (this.getSpaceAt(index).hasCard) {
            throw "assignment to occupied Hand index!"
        }

        this.getSpaceAt(index)._cardToSpace(cardObj);
    }

    // performs the indicated callback with each NON-EMPTY hand space.
    forAllSpaces(callback) {
        const nonEmpty = this.nonEmpty;
        nonEmpty.forEach((handSpace, i) => callback(handSpace, i));
    }
    // as above, but on the cards in the spaces.
    forAllCards(callback) {
        const nonEmpty = this.nonEmpty;
        nonEmpty.forEach((handSpace, i) => callback(handSpace.innerCard, i));
    }

    // re-draws each HandSpace, including empty ones
    render() {
        this._handSpaces.forEach(space => space.render());
    }
}

class Deck {
    constructor(player, deckCards) {
        this._deckCards = deckCards.slice();
        this._owner = player;
        this.shuffle();
    }

    get owner() { return this._owner; }
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
        this._playerID = player;
        this._master = deckCards.pop();

        this._natialZone = new NatialZone(player);
        this._hand = new Hand(player);
        this._deck = new Deck(player, deckCards);

        this._maxMana = this._master.cost;
        this._currentMana = this._maxMana;

        // players always start with their master on the middle of the back row
        const targetSpace = this._natialZone.getSpaceAt(ROW_BACK, 1);
        this._natialZone.cardToZone(targetSpace, this._master);
    }

    get natialZone() { return this._natialZone; }
    get hand() { return this._hand; }
    get deck() { return this._deck; }
    get master() { return this._master; }
    get currentMana() { return this._currentMana; }
    get maxMana() { return this._maxMana; }
    set currentMana(newMana) { this._currentMana = newMana; }

    // transfers up to n cards from the deck to the hand. will automatically
    // terminate if the number of cards to draw exceeds the hand size.
    drawCard(n = 1, render = true) {
        for (let i = 0; i < n; i++) {
            if (!this._deck.length) { return false; }
            if (this._hand.isFull) { return false; }

            const firstEmpty = this.hand.firstEmpty;
            const drawnCard = this.deck.pop();

            this.hand.cardToHand(firstEmpty, drawnCard);
        }

        if (render) { game.renderAll(); }
        return true;
    }

    // checks whether a natial can be summoned to the desired space. does not
    // actually summon the natial.
    validateSummon(toSummonSpace, targetSpace) {
        // fail if the two spaces aren't owned by the same player
        if (toSummonSpace.owner !== targetSpace.owner) { return false; }
        // fail if the card to summon is a spell
        if (toSummonSpace.innerCard.type === "spell") { return false; }
        // fail if target space is occupied
        if (targetSpace.hasCard) { return false; }
        // fail if insufficient mana
        if (this.currentMana < toSummonSpace.innerCard.cost) { return false; }

        return true;
    }

    // moves a natial from the hand to the board, deducting the necessary mana
    summonNatial(toSummonSpace, targetSpace) {
        // deduct mana and transfer the card to the board
        const summonedNatial = toSummonSpace.innerCard;
        this.currentMana -= summonedNatial.cost;
        this.natialZone.cardToZone(targetSpace, summonedNatial);
        toSummonSpace._clear();
        
        // give the natial actions if it's quick
        if (summonedNatial.isQuick) {
            summonedNatial.currentActions = summonedNatial.maxActions;
            summonedNatial.canMove = true;
        } else {
            summonedNatial.currentActions = 0;
            summonedNatial.canMove = false;
        }

        // summoning will always require a re-render
        game.renderAll();

        return true;
    }

    // increments the player's max mana if it's less than 10, and fully
    // replenishes their available mana
    refreshMana() {
        if (this.maxMana < 10) { this._maxMana++; }
        this.currentMana = this.maxMana;
        this.render();
    }

    // wrapper for allowing each natial to act again
    refreshNatials() {
        this.natialZone.forAllCards(card => card.refresh());
    }

    // currently just renders the player's mana display, but may be expanded
    // in the future
    render() {
        const playerStr = (this === friendlyPlayer ? "friendly" : "enemy");
        const manaDOM = document.getElementById(`${playerStr}-portrait`);

        manaDOM.innerText = `${this.currentMana}/${this.maxMana}`;
    }
}

class GameBoard {
    constructor() {}

    renderAll() {
        for (let player of [PLAYER_FRIENDLY, PLAYER_ENEMY]) {
            const thisPlayer = getPlayer(player);
            thisPlayer.hand.render();
            thisPlayer.natialZone.render();
            thisPlayer.render();
        }
    
        renderTurnCounter();
    }

    // checks if either player has met the victory condition. returns true if the
    // game ends and false if it does not. the game-ending code right now is VERY
    // rudimentary, but will work for a MVP. it will be significantly expanded on.
    checkVictory() {
        let friendlyHP = friendlyPlayer.master.curHP;
        let enemyHP = enemyPlayer.master.curHP;

        if (friendlyHP <= 0 && enemyHP <= 0) {
            console.log("it's a draw!");
            playerCanInteract = false;
        }
        else if (friendlyHP <= 0) {
            console.log("computer wins!");
            playerCanInteract = false;
        }
        else if (enemyHP <= 0) {
            console.log("you win!");
            playerCanInteract = false;
        }
        else {
            return false;
        }

        gameEnd = true;
        document.getElementById("end-turn").disabled = true;
        return true;
    }

    // technically, the movement functions below could live in NatialZone and
    // be just fine, since they don't require interaction with a different
    // player or a different part of the board. they're here for consistency
    // and ease of use more than anything else.

    // returns true if the card in moverSpace can move to targetSpace, and
    // false otherwise.
    validateMovement(moverSpace, targetSpace) {
        const player = getPlayer(moverSpace.owner);
        return player.natialZone.validateMovement(moverSpace, targetSpace);
    }

    // transfers the card instance in moverSpace to targetspace
    moveNatial(moverSpace, targetSpace) {
        const player = getPlayer(moverSpace.owner);
        player.natialZone.moveNatial(moverSpace, targetSpace);
    }

    // calculates the damage that would be dealt if the card in attackerSpace
    // attacks the card in targetSpace. returns the array of damage values
    // [damage, counterattack damage].
    calculateDamage(attackerSpace, targetSpace) {
        const attacker = attackerSpace.innerCard;
        const target = targetSpace.innerCard;
        const targetOwner = getPlayer(targetSpace.owner);

        const myAtk = attacker.attack;
        const myElement = attacker.element;
        const oppAtk = target.attack;
        const oppElement = target.element;

        // all damage is floored at zero, and counterattacks do 1 less damage
        // than a directed attack
        let attackerDmg = Math.max(myAtk + TYPE_CHART[myElement][oppElement], 0);
        let counterDmg = Math.max(oppAtk + TYPE_CHART[oppElement][myElement] - 1, 0);

        // sealed natials do not counterattack
        if (target.sealed) { counterDmg = 0; }

        // there's some nuance as to whether counterattacking is possible:
        // a ranged card attacking from the back will never be counterattacked.
        if (attacker.isRanged && attackerSpace.isBackRow) {
            counterDmg = 0;
        }
        // a ranged card attacking from the front might not be counterattacked.
        // if the target is in the back and there are cards in front of it,
        // the attacker will not be counterattacked (even if the target is
        // ranged). counterattacks will trigger as normal if the attacker hits
        // the front row or if the front row is empty.
        else if (attacker.isRanged
            && targetSpace.isBackRow
            && targetOwner.natialZone.isOccluded(targetSpace)) {
            counterDmg = 0;
        }

        return [attackerDmg, counterDmg];
    }

    // checks whether an attack is possible. returns the (truthy) result of 
    // calculateDamage() above if the attack is allowable, and false otherwise.
    validateAttack(attackerSpace, targetSpace) {
        const attacker = attackerSpace.innerCard;
        const attackerOwner = getPlayer(attackerSpace.owner);
        const target = targetSpace.innerCard;
        const targetOwner = getPlayer(targetSpace.owner);

        // fail if either attacker or target does not exist
        if (!attacker || !target) { return false; }
        // fail if attacker and target aren't opposed
        if (attackerSpace.owner === targetSpace.owner) { return false; }
        // fail if the card can't act
        if (!attacker.currentActions) { return false; }
        // fail if the attacker is sealed
        if (attacker.sealed) { return false; }
        // fail if the attacker is not ranged and targeting occluded back row
        if (!attacker.isRanged
            && targetSpace.isBackRow
            && targetOwner.natialZone.isOccluded(targetSpace)) {
            return false;
        }
        // fail if attacker is not ranged and is occluded
        if (!attacker.isRanged
            && attackerSpace.isBackRow
            && attackerOwner.natialZone.isOccluded(attackerSpace)) {
            return false;
        }

        return this.calculateDamage(attackerSpace, targetSpace);
    }

    // performs an attack on the natial in targetSpace using the natial
    // in attackerSpace, and a counterattack vice versa
    attackNatial(attackerSpace, targetSpace) {
        const thisAttack = this.calculateDamage(attackerSpace, targetSpace);
        const attacker = attackerSpace.innerCard;
        const target = targetSpace.innerCard;

        // deduct an action and perform attack and counterattack
        attacker.expendAction();
        targetSpace.dealDamage(thisAttack[0]);
        attackerSpace.dealDamage(thisAttack[1]);

        this.renderAll();
        this.checkVictory();
    }

    // wrapper for validating a natial summon
    validateSummon(toSummonSpace, targetSpace) {
        const player = toSummonSpace.owner;
        return getPlayer(player).validateSummon(toSummonSpace, targetSpace);
    }

    // wrapper for summoning a natial
    summonNatial(toSummonSpace, targetSpace) {
        const player = getPlayer(toSummonSpace.owner);
        player.summonNatial(toSummonSpace, targetSpace);
    }
}

class DestroyedCards {
    constructor() {
        this._friendlyDestroyed = [];
        this._enemyDestroyed = [];
    }

    byPlayer(player) {
        if (player === PLAYER_FRIENDLY) { return this._friendlyDestroyed; }
        else if (player === PLAYER_ENEMY) { return this._enemyDestroyed; }
    }

    listNatials(player) {
        return this.byPlayer(player).filter(card => card.type === "natial");
    }
}

// mostly contains wrappers for the BoardSpace instance corresponding to the
// DOM that was clicked on. serves to seamlessly bridge the DOM with the actual
// objects on the board when needed, and the wrappers inside serve as shortcuts 
// to give event listeners more convenient access to logic and validation.
class CardDOMEvent {
    constructor(draggedDOM) {
        this._spaceObj = this.domIDToSpaceObj(draggedDOM.id);
    }

    // all of the following getters are read-only wrappers
    get spaceObj() { return this._spaceObj; }
    get hasCard() { return this._spaceObj.hasCard; }
    get isNatial() { return this._spaceObj.isNatial; }
    get isHand() { return this._spaceObj.isHand; }
    get isFrontNatial() { return this._spaceObj.isFrontRow; }
    get isBackNatial() { return this._spaceObj.isBackRow; }
    get isSpell() { return (this.hasCard
                            && this._spaceObj.innerCard.type === "spell");}
    get owner() { return this._spaceObj.owner; }

    // fetches the BoardSpace instance corresponding to the desired DOM ID
    domIDToSpaceObj(domID) {
        const domIDParts = domID.split("-");
        const owner = (domIDParts[0] === "friendly" ? friendlyPlayer : enemyPlayer);
        const zone = domIDParts[1];
        const index = parseInt(domIDParts[2]);

        if (zone === "hand") {
            return owner.hand.getSpaceAt(index);
        }
        else if (zone === "front") {
            return owner.natialZone.getSpaceAt(ROW_FRONT, index);
        }
        else { // (zone === "back")
            return owner.natialZone.getSpaceAt(ROW_BACK, index);
        }
    }
}

// might be refactored out in the future if i find a better way to handle this
// but it's here to stay for now
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