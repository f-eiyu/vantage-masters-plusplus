const cardDB = [
    // ========== Debug ==========
    {
        "name": "Debug Fire",
        "portrait": "../data/img/misc/card-back.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Heaven",
        "portrait": "../data/img/misc/card-back.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Earth",
        "portrait": "../data/img/misc/card-back.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Water",
        "portrait": "../data/img/misc/card-back.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 2,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    // ========== Natials ==========
    // Fire Natials
    {
        "name": "Hepetus",
        "portrait": "../data/img/natials/f-hepetus.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 2,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Dullmdalla",
        "portrait": "../data/img/natials/f-dullmdalla.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 3,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillDullmdalla",
        "skillCallbackDesc": "Targets an enemy. Deals 1 damage to all enemies in the same row as the target.",
        "passiveCallbackName": "cbPassiveDullmdalla",
        "passiveCallbackDesc": "This card gains +1 Attack each time it defeats an enemy."
    },
    {
        "name": "Blyx",
        "portrait": "../data/img/natials/f-blyx.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 3,
        "attack": 3,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Oonvievle",
        "portrait": "../data/img/natials/f-oonvievle.png",
        "cost": 6,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 5,
        "attack": 6,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassiveOonvievle",
        "passiveCallbackDesc": "This card gains +1 Attack each time it defeats an enemy."
    },
    {
        "name": "Greon",
        "portrait": "../data/img/natials/f-greon.png",
        "cost": 7,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 5,
        "attack": 5,
        "maxActions": 2,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null,
        "passiveCallbackDesc": "This card can act twice in one turn."
    },
    {
        "name": "Xenofiend",
        "portrait": "../data/img/natials/f-xenofiend.png",
        "cost": 7,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 7,
        "attack": 4,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillXenofiend",
        "skillCallbackDesc": "Targets an enemy. Deals 5 damage to the target.",
        "passiveCallbackName": "cbPassiveXenofiend",
        "passiveCallbackDesc": "This card gains +2 Attack each time it defeats an enemy."
    },
    // Heaven Natials
    {
        "name": "Pelitt",
        "portrait": "../data/img/natials/h-pelitt.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 1,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillPelitt",
        "skillCallbackDesc": "Targets an ally. Removes Seal from the target.",
        "passiveCallbackName": "cbPassivePelitt",
        "passiveCallbackDesc": "This card gains +2 Attack each time it defeats an enemy."
    },
    {
        "name": "Guene-Foss",
        "portrait": "../data/img/natials/h-guene-foss.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 3,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillGueneFoss",
        "skillCallbackDesc": "Targets an enemy. Deals 2 damage to the target.",
        "passiveCallbackName": null
    },
    {
        "name": "Kyrier-Bell",
        "portrait": "../data/img/natials/h-kyrier-bell.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 3,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillKyrierBell",
        "skillCallbackDesc": "Targets an enemy. Deals 2 damage to all enemies in the same row as the target.",
        "passiveCallbackName": null
    },
    {
        "name": "Fifenall",
        "portrait": "../data/img/natials/h-fifenall.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 6,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillFifenall",
        "skillCallbackDesc": "Targets an ally. Restores 6 HP to the target.",
        "passiveCallbackName": "cbPassiveFifenall",
        "passiveCallbackDesc": "When this card is destroyed, draw a card."
    },
    {
        "name": "Amoltamis",
        "portrait": "../data/img/natials/h-amoltamis.png",
        "cost": 6,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 6,
        "attack": 3,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassiveAmoltamis",
        "passiveCallbackDesc": "When this card is in the front row, it temporarily gains +2 Attack."
    },
    {
        "name": "Regna-Croix",
        "portrait": "../data/img/natials/h-regna-croix.png",
        "cost": 8,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 7,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillRegnaCroix",
        "skillCallbackDesc": "Targets an enemy. Deals 3 damage to all enemies in the same row as the target.",
        "passiveCallbackName": "cbPassiveRegnaCroix",
        "passiveCallbackDesc": "All allied Heaven-attribute cards gain +1 Attack."
    },
    // Earth Natials
    {
        "name": "Pa-Rancell",
        "portrait": "../data/img/natials/e-pa-rancell.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 1,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassivePaRancell",
        "passiveCallbackDesc": "Protects cards to the left and right."
    },
    {
        "name": "D-Arma",
        "portrait": "../data/img/natials/e-d-arma.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 3,
        "attack": 1,
        "maxActions": 2,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillDArma",
        "skillCallbackDesc": "Targets an ally. Restores 2 HP to the target.",
        "passiveCallbackName": null,
        "passiveCallbackDesc": "This card can act twice in one turn."
    },
    {
        "name": "Ae-Ferrion",
        "portrait": "../data/img/natials/e-ae-ferrion.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 2,
        "attack": 2,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
    },
    {
        "name": "Gia-Bro",
        "portrait": "../data/img/natials/e-gia-bro.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 5,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillGiaBro",
        "skillCallbackDesc": "Targets an enemy. Deals 1 damage to all enemies in the same row as the target.",
        "passiveCallbackName": null
    },
    {
        "name": "Da-Colm",
        "portrait": "../data/img/natials/e-da-colm.png",
        "cost": 6,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 8,
        "attack": 6,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassiveDaColm",
        "passiveCallbackDesc": "Temporarily grants +1 HP to any card in the same row as itself."
    },
    {
        "name": "Ma-Gorb",
        "portrait": "../data/img/natials/e-ma-gorb.png",
        "cost": 7,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 5,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "skillCallbackName": "cbSkillMaGorb",
        "skillCallbackDesc": "Targets an enemy. Seals the target for 2 turns.",
        "passiveCallbackName": "cbPassiveMaGorb",
        "passiveCallbackDesc": "This card gains +1 Attack every time it defeats an enemy."
    },
    // Water Natials
    {
        "name": "Requ",
        "portrait": "../data/img/natials/w-requ.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 1,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassiveRequ",
        "passiveCallbackDesc": "When this card is destroyed, draw a card."
    },
    {
        "name": "Marme",
        "portrait": "../data/img/natials/w-marme.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 3,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillMarme",
        "skillCallbackDesc": "Targets an ally. Restores 3 HP to the target.",
        "passiveCallbackName": null
    },
    {
        "name": "Zamilpen",
        "portrait": "../data/img/natials/w-zamilpen.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 3,
        "attack": 4,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillZamilpen",
        "skillCallbackDesc": "Targets an enemy. Seals the target for 1 turn.",
        "passiveCallbackName": null
    },
    {
        "name": "Tarbyss",
        "portrait": "../data/img/natials/w-tarbyss.png",
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 3,
        "attack": 3,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": "cbPassiveTarbyss",
        "passiveCallbackDesc": "When this card is destroyed, draw a card."
    },
    {
        "name": "Neptjuno",
        "portrait": "../data/img/natials/w-neptjuno.png",
        "cost": 7,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 7,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillNeptjuno",
        "skillCallbackDesc": "Targets an enemy. Deals 2 damage to the target.",
        "passiveCallbackName": "cbPassiveNeptjuno",
        "passiveCallbabckDesc": "Protects cards to the left and right."
    },
    {
        "name": "Tentarch",
        "portrait": "../data/img/natials/w-tentarch.png",
        "cost": 8,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 9,
        "attack": 6,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillTentarch",
        "skillCallbackDesc": "Targets an enemy. Deals 4 damage to all enemies.",
        "passiveCallbackName": null
    },
    

    // ========== Masters ==========
    {
        "name": "Debug Master",
        "portrait": "../data/img/misc/card-back.png",
        "playerIcon": "../data/img/playericons/bard.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 8,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": null,
        "skillCost": null,
        "passiveCallbackName": null,
    },
    {
        "name": "Fighter",
        "portrait": "../data/img/masters/fighter.png",
        "playerIcon": "../data/img/playericons/fighter.png",
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": null,
        "skillCost": null,
        "passiveCallbackName": null,
        "passiveCallbackDesc": "Counterattacks deal 1 bonus damage."
    },
    {
        "name": "Ranger",
        "portrait": "../data/img/masters/ranger.png",
        "playerIcon": "../data/img/playericons/ranger.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 18,
        "attack": 1,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": null,
        "skillCost": null,
        "passiveCallbackName": null
    },
    {
        "name": "Sister",
        "portrait": "../data/img/masters/sister.png",
        "playerIcon": "../data/img/playericons/sister.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 18,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillSister",
        "skillCallbackDesc": "Targets an ally. Restores 2 HP to the target.",
        "skillCost": 2,
        "passiveCallbackName": null
    },
    {
        "name": "Knight",
        "portrait": "../data/img/masters/knight.png",
        "playerIcon": "../data/img/playericons/knight.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillKnight",
        "skillCallbackDesc": "Targets itself. All allied cards gain +1 Attack.",
        "skillCost": 3,
        "passiveCallbackName": null
    },
    {
        "name": "Thief",
        "portrait": "../data/img/masters/thief.png",
        "playerIcon": "../data/img/playericons/thief.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 26,
        "attack": 1,
        "maxActions": 2,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillThief",
        "skillCallbackDesc": "Targets itself. Draw a card.",
        "skillCost": 2,
        "passiveCallbackName": null,
        "passiveCallbackDesc": "This card can act twice in one turn."
    },
    {
        "name": "Witch",
        "portrait": "../data/img/masters/witch.png",
        "playerIcon": "../data/img/playericons/witch.png",
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 24,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillWitch",
        "skillCallbackDesc": "Targets an enemy. Deals 4 damage to the target.",
        "skillCost": 3,
        "passiveCallbackName": null
    },
    {
        "name": "Paladin",
        "portrait": "../data/img/masters/paladin.png",
        "playerIcon": "../data/img/playericons/paladin.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillPaladin",
        "skillCallbackName": "Targets itself. Revives one random Natial to your Natial Zone.",
        "skillCost": 4,
        "passiveCallbackName": "cbPassivePaladin",
        "passiveCallbackDesc": "The Paladin restores 1 HP at the end of every turn."
    },
    {
        "name": "Beast",
        "portrait": "../data/img/masters/beast.png",
        "playerIcon": "../data/img/playericons/beast.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 4,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillBeast",
        "skillCallbackDesc": "Targets itself. Draw a card.",
        "skillCost": 1,
        "passiveCallbackName": null,
        "passiveCallbackDesc": "Counterattacks deal 2 bonus damage."
    },
    {
        "name": "Swordsman",
        "portrait": "../data/img/masters/swordsman.png",
        "playerIcon": "../data/img/playericons/swordsman.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 27,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillSwordsman",
        "skillCallbackDesc": "Targets an enemy. Deals 1 damage to all enemies in the same row.",
        "skillCost": 2,
        "passiveCallbackName": "cbPassiveSwordsman",
        "passiveCallbackDesc": "This card gains +1 Attack each time it defeats an enemy."
    },
    {
        "name": "Sorcerer",
        "portrait": "../data/img/masters/sorcerer.png",
        "playerIcon": "../data/img/playericons/sorcerer.png",
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 25,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillSorcerer",
        "skillCallbackDesc": "Targets itself. Creates a Magic Crystal Spell card.",
        "skillCost": 3,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Shadow",
        "portrait": "../data/img/masters/shadow.png",
        "playerIcon": "../data/img/playericons/shadow.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 2,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillShadow",
        "skillCallbackDesc": "Targets a card in the opponent's hand. Destroy the targeted card.",
        "skillCost": 4,
        "passiveCallbackName": null,
        "passiveCallbackDesc": "This card can always perform a counterattack, regardless of attacker or positioning."
    },
    {
        "name": "Spirit",
        "portrait": "../data/img/masters/spirit.png",
        "playerIcon": "../data/img/playericons/spirit.png",
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillSpirit",
        "skillCallbackDesc": "Targets an ally. The targeted ally gains one action.",
        "skillCost": 3,
        "passiveCallbackName": "cbPassiveSpirit",
        "passiveCallbackDesc": "When the Spirit's HP reached 10 or less, all other allied cards permanently gain +1 HP and +1 ATK."
    },
    {
        "name": "Bard",
        "portrait": "../data/img/masters/bard.png",
        "playerIcon": "../data/img/playericons/bard.png",
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 22,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillBard",
        "skillCallbackDesc": "Targets an enemy. Seals the target for 1 turn.",
        "skillCost": 3,
        "passiveCallbackName": null
    },
    {
        "name": "Tyrant",
        "portrait": "../data/img/masters/tyrant.png",
        "playerIcon": "../data/img/playericons/tyrant.png",
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "skillCallbackName": "cbSkillTyrant",
        "skillCallbackDesc": "Targets an enemy. Deals 3 damage to all enemies.",
        "skillCost": 7,
        "passiveCallbackName": "cbPassiveTyrant",
        "passiveCallbackDesc": "Allies to the left and right temporarily gain +2 HP and +2 ATK."
    },

    // ========== Spells ==========
    {
        "name": "Magic Crystal",
        "portrait": "../data/img/spells/magic-crystal.png",
        "cost": 0,
        "type": "spell",

        "callbackName": "cbSpellMagicCrystal",
        "longdesc": "Targets an ally. Target gains +1 HP and Attack. If the target is a natial with a spent Active Skill, its Active Skill can be used again."
    },
    {
        "name": "Medic",
        "portrait": "../data/img/spells/medic.png",
        "cost": 1,
        "type": "spell",

        "callbackName": "cbSpellMedic",
        "longdesc": `
        Restores 2 HP to the target.
        Removes Seal from the target.
        +1 ATK to Heaven natials.`
    },
    {
        "name": "Transmute",
        "portrait": "../data/img/spells/transmute.png",
        "cost": 4,
        "type": "spell",

        "callbackName": "cbSpellTransmute",
        "longdesc": `
        Seals an enemy's actions for 2 turns,
        or 3 turns if your master is the Witch.`
    },
    {
        "name": "Vanish",
        "portrait": "../data/img/spells/vanish.png",
        "cost": 4,
        "type": "spell",

        "callbackName": "cbSpellVanish",
        "longdesc": `
        Target enemy natial takes 6 damage, or
        7 damage if your master is the Paladin.`
    },
    {
        "name": "Uptide",
        "portrait": "../data/img/spells/uptide.png",
        "cost": 3,
        "type": "spell",

        "callbackName": "cbSpellUptide",
        "longdesc": `
        All Water elemental natials gain 1
        HP/ATK. All Earth, Fire, and Heaven
        elemental natials take 1 damage.`
    },
    {
        "name": "Blaze",
        "portrait": "../data/img/spells/blaze.png",
        "cost": 2,
        "type": "spell",

        "callbackName": "cbSpellBlaze",
        "longdesc": `
        Target gains 2 ATK. Fire elemental
        Natials gain 3 ATK instead.`
    },
    {
        "name": "Wall",
        "portrait": "../data/img/spells/wall.png",
        "cost": 2,
        "type": "spell",

        "callbackName": "cbSpellWall",
        "longdesc": `
        Shields the target with a
        magical barrier that negates
        damage once. Earth elemental
        Natials gain 2 HP as well.`
    },
    {
        "name": "Expel",
        "portrait": "../data/img/spells/expel.png",
        "cost": 3,
        "type": "spell",

        "callbackName": "cbSpellExpel",
        "longdesc": `
        Target natial is returned to the
        hand. If the hand is full, the
        target is returned to the top
        of the deck instead.`
    },
    {
        "name": "Reduce",
        "portrait": "../data/img/spells/reduce.png",
        "cost": 1,
        "type": "spell",

        "callbackName": "cbSpellReduce",
        "longdesc": `
        Halves the mana cost of one card in
        your hand.`
    },
    {
        "name": "Disaster",
        "portrait": "../data/img/spells/disaster.png",
        "cost": 5,
        "type": "spell",

        "callbackName": "cbSpellDisaster",
        "longdesc": `
        All enemies in the same row as the
        target take 4 damage.`
    }
]