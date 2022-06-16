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
const hands = [[], []]; // friendly, enemy
const natials = [
    [ // friendly
        [], // front
        [] // back
    ],
    [ // enemy
        [], // front
        [] // back
    ]
];

let friendlyMaster = null;
let enemyMaster = null;

let draggedCard = "";