const ELEMENT_NONE = 0; // for deck masters exclusively
const ELEMENT_FIRE = 1;
const ELEMENT_HEAVEN = 2;
const ELEMENT_EARTH = 3;
const ELEMENT_WATER = 4;

const PLAYER_FRIENDLY = 0;
const PLAYER_ENEMY = 1;

const ZONE_NATIAL_FRONT = 0;
const ZONE_NATIAL_BACK = 1;
const ZONE_HAND = 2;

const HAND_SIZE_LIMIT = 6;
const NATIAL_FRONT_CAPACITY = 4;
const NATIAL_BACK_CAPACITY = 3;

const ROW_FRONT = 0;
const ROW_BACK = 1;

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
        Array(4).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, true)),
        Array(3).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, false))
    ]
];
const destroyedCards = [[], []]; // friendly, enemy

let masters = [null, null]; // friendly, enemy

let turnCounter = 0;
let maxMana = [null, null]; // friendly, enemy
let currentMana = [null, null] // friendly, enemy

let playerCanInteract = false;
let gameEnd = false;

let thisDragFrom = null;
let thisDragTo = null;