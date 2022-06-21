const ELEMENT_NONE = 0; // for deck masters exclusively
const ELEMENT_FIRE = 1;
const ELEMENT_HEAVEN = 2;
const ELEMENT_EARTH = 3;
const ELEMENT_WATER = 4;
const ELEMENT_NAMES = {
    "ELEMENT_NONE": ELEMENT_NONE,
    "ELEMENT_FIRE": ELEMENT_FIRE,
    "ELEMENT_HEAVEN": ELEMENT_HEAVEN,
    "ELEMENT_EARTH": ELEMENT_EARTH,
    "ELEMENT_WATER": ELEMENT_WATER
}

const TYPE_CHART = [ // row = attacker, col = defender
    [0, 0, 0, 0, 0], // ELEMENT_NONE attacker
    [0, 0, 2, 0, -2], // ELEMENT_FIRE attacker
    [0, -2, 0, 2, 0], // ELEMENT_HEAVEN attacker
    [0, 0, -2, 0, 2], // ELEMENT_EARTH attacker
    [0, 2, 0, -2, 0] // ELEMENT_WATER attacker
];

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

let turnCounter = 0;

let playerCanInteract = false;
let gameEnd = false;

let thisDragFrom = null;
let thisDragTo = null;