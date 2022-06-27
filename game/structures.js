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
        this._protected = 0;

        // skill callbacks
        this._cardSkillCbName = cardProto.skillCallbackName;
        this._cardSkillReady = Boolean(this._cardSkillCbName);
        this._cardSkillCost = cardProto.skillCost;
        this._cardSkillCbDesc = cardProto.skillCallbackDesc;

        // passive callbacks
        this._cardPassiveCbName = cardProto.passiveCallbackName;
        this._cardPassiveCbDesc = cardProto.passiveCallbackDesc;

        // cosmetic
        this._playerIcon = cardProto.playerIcon;
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
    get protected() { return this._protected; }
    get hasSkill() { return Boolean(this._cardSkillCbName); }
    get skillCbName() { return this._cardSkillCbName; }
    get skillReady() { return this._cardSkillReady; }
    get skillCost() { return this._cardSkillCost; }
    get skillDesc() { return this._cardSkillCbDesc; }
    get hasPassive() { return Boolean(this._cardPassiveCbName); }
    get passiveCbName() { return this._cardPassiveCbName; }
    get passiveDesc() { return this._cardPassiveCbDesc; }
    get playerIcon() { return this._playerIcon; }

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
    set protected(newProt) { this._protected = newProt; }
    set skillReady(newReady) { this._cardSkillReady = newReady; }

    // deals the specified amount of damage to this natial, if applicable
    takeDamage(dmg) {
        if (dmg <= 0) { return; } // taking 0 damage should not break shields
        else if (this.shielded) { this.shielded--; }
        else { this.curHP = Math.max(this.curHP - dmg, 0); }
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
        game.fadeout(this);
        this._clear();
    }

    // this is pretty ugly but what can you do
    render(invis = false) {
        const getDomIdName = () => {
            // returns the id name of the DOM element associated with this space
            let domName = "";

            const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
            let zoneStr = null;
            if (this.isHand) { zoneStr = "hand"; }
            else if (this.isFrontRow) { zoneStr = "front"; }
            else { zoneStr = "back"; }
            const indexStr = this.index;

            domName = `${playerStr}-${zoneStr}-${indexStr}`

            return domName;
        }

        const card = this.innerCard;
        const domID = getDomIdName();
        const thisDOM = document.getElementById(domID);
        const nameBanner = document.getElementById(`name-${domID}`);
        const hpOrb = document.getElementById(`hp-${domID}`);
        const atkOrb = document.getElementById(`atk-${domID}`);
        const manaOrb = document.getElementById(`mana-${domID}`);
        const icons = document.getElementById(`icons-${domID}`);
        const sealBanner = document.getElementById(`seal-${domID}`);

        if (invis) { thisDOM.style.opacity = 0; }
        else { thisDOM.style.opacity = 1; }

        // enemy hand cards are the only ones the player can't view
        if (this.owner === PLAYER_ENEMY && this.isHand && this.hasCard) {
            this.DOM.style.backgroundImage = "url('../data/img/misc/card-back.png')";
            this.DOM.style.backgroundSize = "cover";
        }

        // always display blanks if the card has no content
        else if (!this.hasCard) {
            nameBanner.style.display = "none";
            hpOrb.style.display = "none";
            atkOrb.style.display = "none";
            manaOrb.style.display = "none";
            icons.style.display = "none";

            this.DOM.style.backgroundImage = "none";
            this.DOM.style.backgroundColor = "rgba(0, 0, 0, 0)"
        }

        // render the card background and various properties
        else {
            nameBanner.style.display = "block";
            if (card.type === "spell") {
                hpOrb.style.display = "none";
                atkOrb.style.display = "none";
                icons.style.display = "none";
            }
            else {
                hpOrb.style.display = "flex";
                atkOrb.style.display = "flex";
                icons.style.display = "flex";
            }
            if (card.isMaster && card.skillCost === null) {
                // don't display mana orbs for skill-less masters
                manaOrb.style.display = "none";
            } else {
                manaOrb.style.display = "flex";
            }

            nameBanner.innerText = card.name;
            hpOrb.innerText = card.curHP;
            atkOrb.innerText = card.attack;
            if (card.isMaster) { manaOrb.innerText = card.skillCost; }
            else { manaOrb.innerText = card.cost; }
            icons.innerHTML = "";
            if (card.isRanged) { icons.innerHTML += "<img src='../data/img/misc/icon-ranged.png' class='icon' />"; }
            if (card.isQuick) { icons.innerHTML += "<img src='../data/img/misc/icon-quick.png' class='icon' />"; }
            if (this.isNatial && card.sealed && !this.isHand) {
                sealBanner.style.display = "flex";
                sealBanner.innerText = `Sealed: ${card.sealed}`;
            } else if (!this.isHand) { sealBanner.style.display = "none"; }

            let bgColor = "";
            if (card.type === "spell") { bgColor = "green"; }
            else {
                switch (card.element) {
                    case ELEMENT_FIRE:
                        bgColor = "rgba(255, 50, 50, 0.8)";
                        break;
                    case ELEMENT_HEAVEN:
                        bgColor = "rgba(211, 211, 211, 0.8)";
                        break;
                    case ELEMENT_EARTH:
                        bgColor = "rgba(210, 180, 140, 0.8)";
                        break;
                    case ELEMENT_WATER:
                        bgColor = "rgba(40, 220, 230, 0.8)";
                        break;
                    default:
                        bgColor = "rgba(147, 112, 219, 0.8)";
                }
            }
            nameBanner.style.backgroundColor = bgColor;

            this.DOM.style.backgroundImage = `url('${card.portraitURL}')`;
            this.DOM.style.backgroundSize = "cover";
        }

        if (this.owner === PLAYER_FRIENDLY
            && this.hasCard
            && !invis
            && !game.enemyTurn
            && !card.sealed) {
            this.setDraggable();
        } else { this.clearDraggable(); }
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

class AuraHandler {
    constructor(natialSpace) {
        this._auraList = [];
        this._addQueueRaw = [];
        this._removeQueueRaw = [];
        this._container = natialSpace;

        this._addQueue = [];
        this._removeQueue = [];
    }

    get list() { return this._auraList; }

    addAura(cbName) {
        this._addQueueRaw.push(cbName);
    }

    remAura(cbName) {
        this._removeQueueRaw.push(cbName);
    }

    // returns [arrayOne, arrayTwo] after any elements that they both share
    // have been removed
    removeIntersection(arrayOne, arrayTwo) {
        const arrayOneFiltered = [];
        const arrayTwoFiltered = arrayTwo.slice();

        while (arrayOne.length) {
            const thisElement = arrayOne.pop();
            const indexInArrayTwo = arrayTwoFiltered.indexOf(thisElement);

            if (indexInArrayTwo === -1) { // element is not in arrayTwo
                arrayOneFiltered.push(thisElement);
            } else { // element is in arrayTwo
                // discard the first matching element in arrayTwoFiltered
                // don't push anything into arrayOneFiltered
                arrayTwoFiltered.splice(indexInArrayTwo, 1);
            }
        }

        return [arrayOneFiltered, arrayTwoFiltered];
    }

    applyAura(cbName) {
        this._auraList.push(cbName);

        const space = this._container;
        const card = space.innerCard;
        if (card
            && natialPassiveCallbacks.onAuraApply[cbName]) {
            natialPassiveCallbacks.onAuraApply[cbName](space);
        }
    }

    unapplyAura(cbName) {
        const index = this._auraList.indexOf(cbName);
        if (index !== -1) {
            // unapply aura effects here
        }
        this._auraList.splice(index, 1);

        const space = this._container;
        const card = space.innerCard;
        if (card
            && natialPassiveCallbacks.onAuraUnapply[cbName]) {
            natialPassiveCallbacks.onAuraUnapply[cbName](space);
        }
    }

    processRawQueues() {
        // clear anything that's in both the add queue and remove queue
        // (this helps prevent wonky behavior with eg. cards immediately dying
        // when an aura is removed and instantly replaced)
        const toApply = this.removeIntersection(this._addQueueRaw, this._removeQueueRaw);
        this._addQueue.push(...toApply[0]);
        this._removeQueue.push(...toApply[1]);

        // reset raw queues
        this._addQueueRaw = [];
        this._removeQueueRaw = [];
    }

    applyQueues() {
        // doing aura addition before aura removal helps preserve natial lives
        // in as many cases as possible. if a 2 HP natial is sitting in a +2
        // HP aura and the aura becomes a +1 HP, it would die immediately if
        // the +2 HP aura were removed first.
        while (this._addQueue.length) {
            const thisCb = this._addQueue.pop();
            this.applyAura(thisCb);
        }
        while (this._removeQueue.length) {
            const thisCb = this._removeQueue.pop();
            this.unapplyAura(thisCb);
        }
    }

    applyAurasMovement(originSpace) {
        // we use similar logic to the aura queues above: ignore every aura
        // that's present in both the origin and destination spaces, apply any
        // auras exclusive to the destination space, and remove any auras
        // exclusive to the origin space.
        const originAuras = originSpace.isNatial ? originSpace.auraHandler.list.slice() : [];
        const destAuras = this._auraList.slice();
        const space = this._container;
        const card = space.innerCard;

        const [toApply, toUnapply] = this.removeIntersection(destAuras, originAuras);
       
        while (toApply.length) {
            const thisCb = toApply.pop();

            if (card
                && natialPassiveCallbacks.onAuraApply[thisCb]) {
                natialPassiveCallbacks.onAuraApply[thisCb](space);
            }
        }
        while (toUnapply.length) {
            const thisCb = toUnapply.pop();

            if (card
                && natialPassiveCallbacks.onAuraUnapply[thisCb]) {
                natialPassiveCallbacks.onAuraUnapply[thisCb](space);
            }
        }

    }

    viewAuras() { // for debugging purposes
        console.log(this._auraList);
    }
}

class NatialSpace extends BoardSpace {
    constructor (owner, index, row, container) {
        super(owner, index);
        this._row = row;
        this._container = container;

        this._auraHandler = new AuraHandler(this);

        const playerStr = (this.owner === PLAYER_FRIENDLY ? "friendly" : "enemy");
        const rowStr = (this.isFrontRow ? "front" : "back");
        this._DOMId = `${playerStr}-${rowStr}-${this._index}`
        this._DOM = document.getElementById(this._DOMId);
    }

    get isNatial() { return true; }
    get isHand() { return false; }
    get row() { return this._row; }
    get container() { return this._container; }
    get auraHandler() { return this._auraHandler; }
    get isFrontRow() { return this._row === ROW_FRONT; }
    get isBackRow() { return this._row === ROW_BACK; }
    get DOM() { return this._DOM; }

    // applies the specific named aura to this space
    applyAura(cbName) {
        // do not apply Pa-Rancell auras to each other
        if (this.innerCard.name === "Pa-Rancell"
            && cbName === "cbPassivePaRancell") { return; }

        natialPassiveCallbacks.onAuraEnter[cbName](this);
    }

    // wrapper for dealing damage to the contained card instance
    dealDamage(dmg, attackerSpace = null) {
        game.playerLoseControl();

        const target = this.innerCard;
        const attacker = (attackerSpace ? attackerSpace.innerCard : null);
        const dmgRibbon = this.DOM.querySelector(".dmg-ribbon");

        // disallow overkilling target
        if (dmg > target.curHP) { dmg = target.curHP; }
        target.takeDamage(dmg);

        dmgRibbon.innerText = `-${dmg}`;
        dmgRibbon.style.display = "block";
        this.DOM.querySelector(".hp-orb").innerText = target.curHP;

        if (game.checkVictory()) { return; }
        setTimeout(() => {
            dmgRibbon.style.display = "none";
            if (!game.enemyTurn) { game.playerGainControl(); }
        }, game.attackTime)

        // onDamageTaken hook
        if (target.hasPassive
            && natialPassiveCallbacks.onDamageTaken[target.passiveCbName]) {
            natialPassiveCallbacks.onDamageTaken[target.passiveCbName](this, dmg);
        }

        // destroy and run relevant callbacks if target dies
        if (target.curHP <= 0) {
            // currently, no card cares about the properties of the card it
            // killed, so it's fine to put this here to avoid a possible
            // infinite recursion in the onDeath hook. if such a natial were
            // to be added in the future, this block and associated code may
            // have to be restructured or expanded.
            this.destroyCard();

            // onDeath hook
            if (target.hasPassive
                && natialPassiveCallbacks.onDeath[target.passiveCbName]) {
                natialPassiveCallbacks.onDeath[target.passiveCbName](this);
            }

            // onKill hook
            // specifically structured to NOT run if a counterattacker both got
            // a kill and died simultaneously.
            if (attacker
                && attacker.hasPassive
                && natialPassiveCallbacks.onKill[attacker.passiveCbName]) {
                natialPassiveCallbacks.onKill[attacker.passiveCbName](attackerSpace);
            }
        }
    }

    // activates the skill on the currently selected card, on the target at
    // targetSpace, then flags the natial's skill as used.
    activateSkill(targetSpace) {
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
        this._front = Array(4).fill(null).map((el, i) => new NatialSpace(player, i, ROW_FRONT, this));
        this._back = Array(3).fill(null).map((el, i) => new NatialSpace(player, i, ROW_BACK, this));
    }

    // returns all NatialSpace instances
    get allSpaces() {
        const allSpaces = [];
        allSpaces.push(...this._front);
        allSpaces.push(...this._back);

        return allSpaces;
    }
    // returns all non-empty NatialSpace instances
    get nonEmpty() {
        const nonEmpty = [];
        nonEmpty.push(...this._front.filter(sp => sp.hasCard));
        nonEmpty.push(...this._back.filter(sp => sp.hasCard));

        // at least one natial (the master) should always be in the natial zone
        if (!nonEmpty.length) { debugger; throw "error: no natials found on the board!"; }
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
    // return the space(s) adjacent to the specified natialSpace instance
    getAdjacents(space) {
        const row = space.row;
        const index = space.index;
        const adjacents = [];

        if (index !== 0) {
            adjacents.push(this.getSpaceAt(row, index - 1));
        }
        if (index !== this.getRow(row).length - 1) {
            adjacents.push(this.getSpaceAt(row, index + 1));
        }

        return adjacents;
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

    // places the specified card in targetSpace if targetSpace is empty
    cardToZone(targetSpace, card) {
        if (targetSpace.hasCard) {
            throw "already occupied natial space in cardToZone!";
        }

        targetSpace._cardToSpace(card);
    }

    // swaps the cards contained in the specified natial spaces
    swapCards(firstSpace, secondSpace) {
        const firstCard = firstSpace.innerCard;
        const secondCard = secondSpace.innerCard;

        // clear both spaces and switch their contents
        firstSpace._clear();
        secondSpace._clear();
        if (secondCard !== null) { this.cardToZone(firstSpace, secondCard); }
        if (firstCard !== null) { this.cardToZone(secondSpace, firstCard); }
    }

    doAuraHandlerQueues() {
        const allSpaces = this.allSpaces;
        allSpaces.forEach(sp => {
            sp.auraHandler.processRawQueues();
            sp.auraHandler.applyQueues();
        });
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
        // fail if the two spaces aren't owned by the same player
        if (moverSpace.owner !== targetSpace.owner) { return false;}
        // fail if mover doesn't have an available move
        if (!moverSpace.innerCard.canMove) { return false; }
        // fail if mover is trying to move onto itself
        if (moverSpace === targetSpace) { return false; }

        return true;
    }

    // transfers the card instance in moverSpace to targetSpace
    moveNatial(originSpace, destSpace) {
        // disable player control for the duration of the move
        if (originSpace.owner === PLAYER_FRIENDLY) {
            game.playerLoseControl(game.fadeoutTime + game.fadeinTime + 25);
        }

        const originCard = originSpace.innerCard;
        const destCard = destSpace.innerCard;

        /* 
        // onMove hook: place the appropriate aura additions/removals into
        // AuraHandler queues
        // moving originCard to destSpace
        if (natialPassiveCallbacks.onMove[originCard.passiveCbName]) {
            natialPassiveCallbacks.onMove[originCard.passiveCbName](originSpace, destSpace);
        }
        
        if (destCard
            && natialPassiveCallbacks.onMove[destCard.passiveCbName]) {
            natialPassiveCallbacks.onMove[destCard.passiveCbName](destSpace, originSpace);
        }
        
        // apply aura effects after all potential changes are in AuraHandlers.
        // as with summonNatial, this is placed before the actual movement
        // happens so that the moved card or cards do not benefit from the auras
        // in their new position before their aura calculation is intended to
        // take place.
        this.doAuraHandlerQueues();
        */

        // swap origin and target cards
        this.swapCards(originSpace, destSpace);
        originCard.canMove = false;

        /*
        // now, calculate and apply auras to the moved cards
        destSpace.auraHandler.applyAurasMovement(originSpace);
        originSpace.auraHandler.applyAurasMovement(destSpace);
        */

        // animate and re-render the board
        setTimeout(game.renderAll, game.fadeoutTime + game.fadeinTime);
        game.fadeout(originSpace, game.fadeoutTime);
        if (destCard) { game.fadeout(destSpace, game.fadeoutTime); }
        setTimeout(() => {
            // invisibly update the DOMs for origin and destination...
            originSpace.render(true);
            destSpace.render(true);
            // ... and then fade the card(s) in
            game.fadein(destSpace, game.fadeinTime);
            if (destCard) { game.fadein(originSpace, game.fadeinTime); }
        }, game.fadeoutTime);
    }   

    // performs the indicated callback with each space in the indicated row.
    forAllSpacesInRow(row, callback, skipEmpty = true) {
        const spaces = (skipEmpty ? this.getRow(row).filter(sp => sp.hasCard) : this.getRow(row));

        spaces.forEach((space, i) => callback(space, i));
    }
    // performs the indicated callback with each natial space.
    forAllSpaces(callback, skipEmpty = true) {
        const spaces = (skipEmpty ? this.nonEmpty : this.allSpaces);
        spaces.forEach((natialSpace, i) => callback(natialSpace, i));
    }
    // as above, but on the cards in the spaces.
    forAllCards(callback) {
        const nonEmpty = this.nonEmpty;
        nonEmpty.forEach((natialSpace, i) => callback(natialSpace.innerCard, i));
    }

    // removes one turn of seal from every card
    decrementSeal() {
        this.forAllCards(card => card.sealed--);
        game.renderAll();
    }

    // re-draws each NatialSpace instance, including empty ones
    render() {
        this._front.forEach(space => space.render());
        this._back.forEach(space => space.render());
    }

    // debug
    viewAllAuras() {
        this.forAllSpaces((space) => {
            space.auraHandler.viewAuras();
        }, false);
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
        // force onSummon callbacks for each player's master, if applicable
        if (natialPassiveCallbacks.onSummon[this._master.passiveCbName]) {
            natialPassiveCallbacks.onSummon[this._master.passiveCbName](targetSpace);
        }
        this._natialZone.doAuraHandlerQueues();
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
            if (render) {
                const handSpace = this.hand.getSpaceAt(firstEmpty)
                handSpace.render(true);
                game.fadein(handSpace);
            }
        }
        return true;
    }

    // checks whether a natial can be summoned to the desired space. does not
    // actually summon the natial.
    validateSummon(toSummonSpace, targetSpace) {
        try {
            // fail if the two spaces aren't owned by the same player
            if (toSummonSpace.owner !== targetSpace.owner) { return false; }
            // fail if the card to summon is a spell
            if (toSummonSpace.innerCard.type === "spell") { return false; }
            // fail if target space is occupied
            if (targetSpace.hasCard) { return false; }
        } catch(error) {debugger;}
        // fail if insufficient mana
        if (this.currentMana < toSummonSpace.innerCard.cost) { return false; }

        return true;
    }

    // moves a natial from the hand to the board, deducting the necessary mana
    summonNatial(originHandSpace, destNatialSpace) {
        // disable player control for the duration of the summon
        if (originHandSpace.owner === PLAYER_FRIENDLY) {
            game.playerLoseControl(game.fadeoutTime + game.fadeinTime + 25);
        }

        const summonedCard = originHandSpace.innerCard;

        /*
        // onSummon hook: tell AuraHandlers to prepare to parse potentially
        // new auras
        if (natialPassiveCallbacks.onSummon[summonedCard.passiveCbName]) {
            natialPassiveCallbacks.onSummon[summonedCard.passiveCbName](destNatialSpace);
        }

        // recalculate and apply prospective aura effects to the board. this is 
        // specifically placed so that the summoned card does NOT benefit from 
        // its own (or any other auras) too early; that's handled below.
        this.natialZone.doAuraHandlerQueues();
        */

        // deduct mana and transfer the card to the board
        this.currentMana -= summonedCard.cost;
        this.natialZone.cardToZone(destNatialSpace, summonedCard);
        originHandSpace._clear();
        
        // give the natial actions if it's quick
        if (summonedCard.isQuick) {
            summonedCard.currentActions = summonedCard.maxActions;
            summonedCard.canMove = true;
        } else {
            summonedCard.currentActions = 0;
            summonedCard.canMove = false;
        }

        /*
        // now, apply any aura effects to the summoned natial.
        destNatialSpace.auraHandler.applyAurasMovement(originHandSpace);
        */

        // animate and re-render the board
        setTimeout(game.renderAll, game.fadeoutTime + game.fadeinTime);
        game.fadeout(originHandSpace, game.fadeoutTime);
        setTimeout(() => {
            // invisibly update the DOMs for origin and destination...
            originHandSpace.render(true);
            destNatialSpace.render(true);
            // ... and then fade the card(s) in
            game.fadein(destNatialSpace, game.fadeinTime);
        }, game.fadeoutTime);

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

    loadIcon() {
        const playerStr = (this._playerID === PLAYER_FRIENDLY ? "friendly" : "enemy");
        const iconDOM = document.getElementById(`${playerStr}-portrait`);

        iconDOM.style.backgroundImage = `url(${this.master.playerIcon})`
        iconDOM.style.backgroundSize = "250px";
        iconDOM.style.backgroundRepeat = "no-repeat";
        iconDOM.style.backgroundPosition = "center";
    }

    // displays the potential change to mana by playing a card
    friendlyManaHover(cost) {
        if (this._playerID !== PLAYER_FRIENDLY) { return; }
        const manaDOM = document.getElementById(`friendly-mana`);
        const manaList = manaDOM.querySelectorAll(".mana");

        const manaArray = [];
        manaList.forEach((mana, i) => {
            manaArray.push((i + 1 <= friendlyPlayer.currentMana));
        });

        // iterate through manaArray backwards, looking for available mana and
        // replacing the specified amount with red "to be consumed" mana
        for(let i = manaArray.length - 1; i >= 0; i--) {
            if (manaArray[i]) {
                manaList[i].style.backgroundImage = `url("../data/img/misc/mana-hover.png")`
                cost--;
            }
            if (cost === 0) { return; }
        }
    }

    // updates the player's mana and other stats
    render() {
        const playerStr = (this === friendlyPlayer ? "friendly" : "enemy");

        const infoDOM = document.getElementById(`${playerStr}-master-info`);
        let infoDOMText = "";
        const masterName = this.master.name;

        infoDOMText = `<p>${masterName} | HP: ${this.master.curHP}/${this.master.maxHP} | In Deck: ${this.deck.length}</p>`;
        infoDOM.innerHTML = infoDOMText;

        const manaDOM = document.getElementById(`${playerStr}-mana`);
        const manaList = manaDOM.querySelectorAll(".mana");

        manaList.forEach((mana, i) => {
            if (i + 1 <= this.currentMana) {
                mana.style.backgroundImage = `url("../data/img/misc/mana-full.png")`;
            } else {
                mana.style.backgroundImage = `url("../data/img/misc/mana-empty.png")`;
            }
        });
    }
}

class GameBoard {
    constructor() {
        this._turnCounter = 0;
        this._enemyTurn = null;

        // aesthetic parameters -- can tweak!
        this._fadeoutTime = 400;
        this._fadeinTime = 600;
        this._attackTime = 1200;
    }

    get turnCounter() { return this._turnCounter; }
    get enemyTurn() { return this._enemyTurn; }
    get fadeoutTime() { return this._fadeoutTime; }
    get fadeinTime() { return this._fadeinTime; }
    get attackTime() { return this._attackTime; }

    set enemyTurn(turn) { this._enemyTurn = turn; }

    incrementTurnCounter() {
        // one full turn consists of both players making a move. in this way, we
        // can have an accurate counter for full turns regardless of who goes first.
        this._turnCounter += 0.5;
    }

    renderTurnCounter() {
        const turnDOM = document.getElementById("misc-container");
        turnDOM.innerHTML = `<h1>Turn ${Math.ceil(this.turnCounter)}</h1>`;
    }

    renderAll() {
        for (let player of [PLAYER_FRIENDLY, PLAYER_ENEMY]) {
            const thisPlayer = getPlayer(player);
            thisPlayer.hand.render();
            thisPlayer.natialZone.render();
            thisPlayer.render();
        }
        game.renderTurnCounter();
    }

    playerLoseControl(time = 0) {
        playerControl = false;
        friendlyPlayer.natialZone.forAllSpaces(sp => sp.clearDraggable());
        friendlyPlayer.hand.forAllSpaces(sp => sp.clearDraggable());
        document.querySelectorAll("button").forEach(el => el.disabled = true);

        if (time) { setTimeout(this.playerGainControl, time); }
    }

    playerGainControl() {
        playerControl = true;
        friendlyPlayer.natialZone.forAllSpaces(sp => sp.setDraggable());
        friendlyPlayer.hand.forAllSpaces(sp => sp.setDraggable());
        document.querySelectorAll("button").forEach(el => el.disabled = false);
    }

    fadeout(space, time = this.fadeoutTime) {
        const thisDOM = space.DOM;
        let opacity = thisDOM.style.opacity;
        const numFrames = 60 * (time / 1000); // # of fade frames at 60 fps

        const opDelta = opacity / numFrames;

        let timer = setInterval(() => {
            opacity = Math.max(opacity - opDelta, 0);
            thisDOM.style.opacity = opacity;

            if (opacity <= 0) {
                clearInterval(timer);
                thisDOM.style.opacity = 0;
            }
        }, 1000 / 60);
    }

    fadein(space, time = this.fadeinTime) {
        const thisDOM = space.DOM;
        let opacity = 0.0;
        const numFrames = 60 * (time / 1000); // # of fade frames at 60 fps
        const opDelta = 1.0 / numFrames;

        let timer = setInterval(() => {
            opacity = Math.min(opacity + opDelta, 1);
            thisDOM.style.opacity = opacity;

            if (opacity >= 1) {
                clearInterval(timer);
                thisDOM.style.opacity = 1;
            }
        }, 1000 / 60);
    }

    attackFade(spaceDOM, time = this.attackTime, minAlpha = 0.5) {
        let spaceContainer = spaceDOM.parentNode;
        spaceContainer.style.backgroundColor = "darkred";
        let opacity = 1;
        const numFrames = 60 * (time / 1000); // # of fade frames at 60 fps

        const opDelta = 2 * (1 - minAlpha) * (opacity / numFrames);
        let direction = -1;

        let timer = setInterval(() => {
            opacity = Math.max(opacity + direction * opDelta, 0);
            spaceDOM.style.opacity = opacity;

            if (opacity <= minAlpha) { direction = 1; }

            if (opacity > 1) {
                clearInterval(timer);
                spaceDOM.opacity = 1;
                spaceContainer.style.backgroundColor = "";
            }
        }, 1000 / 60);
    }

    animateAttack(attackerSpace, targetSpace) {
        const attackerDOM = attackerSpace.DOM;
        const attackerContainer = attackerDOM.parentNode;
        const targetDOM = targetSpace.DOM;
        const targetContainer = targetDOM.parentNode;

        attackerDOM.style.opacity = 1;
        targetDOM.style.opacity = 1;

        attackerContainer.style.backgroundColor = "darkred";        
        targetContainer.style.backgroundColor = "darkred";

        this.attackFade(attackerDOM, this.attackTime);
        this.attackFade(targetDOM, this.attackTime);
    }

    // checks if either player has met the victory condition. returns true if the
    // game ends and false if it does not.
    checkVictory() {
        let friendlyHP = friendlyPlayer.master.curHP;
        let enemyHP = enemyPlayer.master.curHP;

        const feedbackZone = document.getElementById("feedback-zone");
        let feedbackStr = null;

        if (friendlyHP <= 0 && enemyHP <= 0) {
            feedbackStr = "It's a tie!";
        }
        else if (friendlyHP <= 0) {
            feedbackStr = "You are defeated!";
        }
        else if (enemyHP <= 0) {
            feedbackStr = "You are victorious!";
        }
        else {
            return false;
        }

        game.playerLoseControl();
        feedbackZone.innerHTML = `<h2>${feedbackStr}</h2>`;
        gameEnd = true;
        document.getElementById("end-turn").style.display = "none";
        document.getElementById("restart-game").disabled = false;
        return true;
    }

    // returns true if the card in moverSpace can move to targetSpace, and
    // false otherwise. largely a wrapper.
    validateMovement(moverSpace, targetSpace) {
        const player = getPlayer(moverSpace.owner);
        return player.natialZone.validateMovement(moverSpace, targetSpace);
    }

    // transfers the card instance in moverSpace to targetSpace. largely a
    // wrapper.
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
        const counterDmgInitial = Math.max(oppAtk + TYPE_CHART[oppElement][myElement] - 1, 0);
        let counterDmg = counterDmgInitial;

        // adjustments for damage boost from passives
        if (natialPassiveCallbacks.onCounterattack[target.passiveCbName]) {
            counterDmg += natialPassiveCallbacks.onCounterattack[target.passiveCbName]();
        }

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

        // override for Shadow master
        if (target.isMaster && target.name === "Shadow") {
            counterDmg = counterDmgInitial;
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
        const feedback = document.getElementById("feedback-zone");

        // fail if the card can't act
        if (!attacker.currentActions) {
            if (!game.enemyTurn) {  feedback.innerText = "This card is out of actions."; }
            return false;
        }
        // fail if either attacker or target does not exist
        if (!attacker || !target) { return false; }
        // fail if the target is protected
        if (target.protected) {
            if (!game.enemyTurn) { feedback.innerText = "That target is being protected!"; }
            return false;
        }
        // fail if attacker and target aren't opposed
        if (attackerSpace.owner === targetSpace.owner) { return false; }
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
        // disable player control for the duration of the attack
        if (attackerSpace.owner === PLAYER_FRIENDLY) {
            game.playerLoseControl(); // control is regained in dealDamage()
        }

        const thisAttack = this.calculateDamage(attackerSpace, targetSpace);
        const attacker = attackerSpace.innerCard;

        setTimeout(() => {
            // deduct an action and perform attack and counterattack
            attacker.expendAction();
            targetSpace.dealDamage(thisAttack[0], attackerSpace);
            attackerSpace.dealDamage(thisAttack[1], targetSpace);
            if (attackerSpace.hasCard) { attackerSpace.render(); }
            if (targetSpace.hasCard) { targetSpace.render(); }
        }, game.attackTime);
        game.animateAttack(attackerSpace, targetSpace);
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
    constructor(event) {
        let cardDOM = event.target;
        // if the click/hover/drag events are called on children of a card's
        // DOM, backtrack to the parent node that originally had the event
        // listener attached, which will always have one of these two classes.
        while (!cardDOM.classList.contains("enemy")
                && !cardDOM.classList.contains("friendly")) {
            cardDOM = cardDOM.parentNode;
        }
        
        this._spaceObj = this.domIDToSpaceObj(cardDOM.id);
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