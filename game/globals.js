const ELEMENT_NONE = 0; // for deck masters exclusively
const ELEMENT_FIRE = 1;
const ELEMENT_HEAVEN = 2;
const ELEMENT_EARTH = 3;
const ELEMENT_WATER = 4;

const PLAYER_FRIENDLY = 0;
const PLAYER_ENEMY = 1;

const ROW_FRONT = 0;
const ROW_BACK = 1;
const ZONE_HAND = 2;

const HAND_SIZE_LIMIT = 6;
const NATIAL_FRONT_CAPACITY = 4;
const NATIAL_BACK_CAPACITY = 3;

const TYPE_CHART = [ // row = attacker, col = target
    [0, 0, 0, 0, 0], // ELEMENT_NONE attack
    [0, 0, 2, 0, -2], // ELEMENT_FIRE attack
    [0, -2, 0, 2, 0], // ELEMENT_HEAVEN attack
    [0, 0, -2, 0, 2], // ELEMENT_EARTH attack
    [0, 2, 0, -2, 0] // ELEMENT_WATER attack
];

let turnCounter = 0;

let playerCanInteract = false;
let gameEnd = false;

let thisDragFrom = null;
let thisDragTo = null;

let friendlyPlayer = null;
let enemyPlayer = null;
let game = null;
let destroyedCards = null;
let skillUsage = null;