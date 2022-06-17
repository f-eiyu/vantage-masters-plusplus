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
    Array(6).fill(null).map((el, i) => new HandSpace(PLAYER_FRIENDLY, i)), // friendly [0 = PLAYER_FRIENDLY]
    Array(6).fill(null).map((el, i) => new HandSpace(PLAYER_ENEMY, i)) // enemy [1 = PLAYER_ENEMY]
];
const natials = [
    [ // friendly [0 = PLAYER_FRIENDLY]
        Array(4).fill(null).map((el, i) => new NatialSpace(PLAYER_FRIENDLY, i, true)), // front [0 = ROW_FRONT]
        Array(3).fill(null).map((el, i) => new NatialSpace(PLAYER_FRIENDLY, i, false)), // back [1 = ROW_BACK]
    ],
    [ // enemy [1 = PLAYER_ENEMY]
        Array(4).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, true)), // front [0 = ROW_FRONT]
        Array(3).fill(null).map((el, i) => new NatialSpace(PLAYER_ENEMY, i, false)) // back [1 = ROW_BACK]
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