const ELEMENT_NONE = 0; // for deck masters exclusively
const ELEMENT_FIRE = 1;
const ELEMENT_HEAVEN = 2;
const ELEMENT_EARTH = 3;
const ELEMENT_WATER = 4;

const PLAYER_FRIENDLY = 0;
const PLAYER_ENEMY = 1;

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

const ROW_FRONT = 0;
const ROW_BACK = 1;

let friendlyMaster = null;
let enemyMaster = null;









const debugCardFire = {
    name: "Debug Fire",
    portrait: null,

    element: ELEMENT_FIRE,
    currentHP: 2,
    maxHP: 2,
    attack: 1,
    cost: 1,

    isRanged: true,
    isQuick: false,
    isMaster: false,

    hasSkill: false,
    skillReady: false,
    skill: null,
    hasPassive: false,
    passive: null
}

const debugCardHeaven = {
    name: "Debug Heaven",
    portrait: null,

    element: ELEMENT_HEAVEN,
    currentHP: 1,
    maxHP: 1,
    attack: 1,
    cost: 1,

    isRanged: false,
    isQuick: true,
    isMaster: false,

    hasSkill: false,
    skillReady: false,
    skill: null,
    hasPassive: false,
    passive: null
}

const debugCardEarth = {
    name: "Debug Earth",
    portrait: null,

    element: ELEMENT_EARTH,
    currentHP: 3,
    maxHP: 3,
    attack: 1,
    cost: 1,

    isRanged: false,
    isQuick: false,
    isMaster: false,

    hasSkill: false,
    skillReady: false,
    skill: null,
    hasPassive: false,
    passive: null
}

const debugCardWater = {
    name: "Debug Water",
    portrait: null,

    element: ELEMENT_WATER,
    currentHP: 1,
    maxHP: 1,
    attack: 2,
    cost: 2,

    isRanged: false,
    isQuick: false,
    isMaster: false,

    hasSkill: false,
    skillReady: false,
    skill: null,
    hasPassive: false,
    passive: null
}

const debugCardMaster = {
    name: "Debug Master",
    portrait: null,

    element: ELEMENT_NONE,
    currentHP: 30,
    maxHP: 30,
    attack: 1,
    cost: 0,

    isRanged: false,
    isQuick: false,
    isMaster: false,

    hasSkill: false,
    skillReady: false,
    skill: null,
    hasPassive: false,
    passive: null
}