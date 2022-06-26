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
        "maxHP": 1,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillDullmdalla",
        "passiveCallbackName": "cbPassiveDullmdalla"
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
        "passiveCallbackName": "cbPassiveOonvievle"
    },
    {
        "name": "Greon",
        "portrait": "../data/img/natials/f-greon.png",
        "cost": 7,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 5,
        "attack": 5,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": null,
        "passiveCallbackName": null
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
        "passiveCallbackName": "cbPassiveXenofiend"
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
        "passiveCallbackName": "cbPassivePelitt"
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
        "passiveCallbackName": "cbPassiveFifenall"
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
        "passiveCallbackName": "cbPassiveAmoltamis"
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
        "passiveCallbackName": "cbPassiveRegnaCroix"
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
        "passiveCallbackName": "cbPassivePaRancell"
    },
    {
        "name": "D-Arma",
        "portrait": "../data/img/natials/e-d-arma.png",
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 3,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "skillCallbackName": "cbSkillDArma",
        "passiveCallbackName": null
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
        "passiveCallbackName": "cbPassiveDaColm"
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
        "passiveCallbackName": "cbPassiveMaGorb"
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
        "passiveCallbackName": "cbPassiveRequ"
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
        "passiveCallbackName": "cbPassiveTarbyss"
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
        "passiveCallbackName": "cbPassiveNeptjuno"
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
        "passive": null
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
        "passiveCallbackName": null
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
        "skillCost": 2,
        "passiveCallbackName": null
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
        "skillCost": 4,
        "passiveCallbackName": "cbPassivePaladin"
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
        "skillCost": 1,
        "passiveCallbackName": null
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
        "skillCost": 2,
        "passiveCallbackName": "cbPassiveSwordsman"
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
        "skillCost": 4,
        "passiveCallbackName": null
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
        "skillCost": 3,
        "passiveCallbackName": "cbPassiveSpirit"
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
        "skillCost": 7,
        "passiveCallbackName": "cbPassiveTyrant"
    },

    // ========== Spells ==========
    {
        "name": "Magic Crystal",
        "portrait": "../data/img/spells/magic-crystal.png",
        "cost": 0,
        "type": "spell",

        "callbackName": "cbSpellMagicCrystal",
        "longdesc": `
        Target gains +1 HP/ATK and can
        use its Skill again (if it has
        one). Player receives +1 mana.`
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