const cardDB = [
    // ========== Natials ==========
    {
        "name": "Debug Fire",
        "portrait": null,
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_FIRE",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": false,

        "hasSkill": false,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Heaven",
        "portrait": null,
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_HEAVEN",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": true,
        "isMaster": false,

        "hasSkill": false,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Earth",
        "portrait": null,
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_EARTH",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "hasSkill": false,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Debug Water",
        "portrait": null,
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_WATER",
        "maxHP": 10,
        "attack": 3,
        "maxActions": 2,

        "isRanged": false,
        "isQuick": false,
        "isMaster": false,

        "hasSkill": false,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },

    // ========== Masters ==========
    {
        "name": "Debug Master",
        "portrait": null,
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 8,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": false,
        "skillCost": null,
        "skill": null,
        "hasPassive": false,
        "passive": null
    },
    {
        "name": "Fighter",
        "portrait": null,
        "cost": 1,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": false,
        "skillCost": null,
        "skillCallbackName": null,
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Ranger",
        "portrait": null,
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 18,
        "attack": 1,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": false,
        "skillCost": null,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Sister",
        "portrait": null,
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 18,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 2,
        "skillCallbackName": "cbSkillSister",
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Knight",
        "portrait": null,
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": false,
        "skillCost": null,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Thief",
        "portrait": null,
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 26,
        "attack": 1,
        "maxActions": 2,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 2,
        "skillCallbackName": "cbSkillThief",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Witch",
        "portrait": null,
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 24,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": "cbSkillWitch",
        "skillCost": 3,
        "skillCallbackName": null,
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Paladin",
        "portrait": null,
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 4,
        "skillCallbackName": "cbSkillPaladin",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Beast",
        "portrait": null,
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 4,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 1,
        "skillCallbackName": "cbSkillBeast",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Swordsman",
        "portrait": null,
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 27,
        "attack": 3,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 2,
        "skillCallbackName": "cbSkillSwordsman",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Sorceror",
        "portrait": null,
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 25,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 3,
        "skillCallbackName": "cbSkillSorceror",
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Shadow",
        "portrait": null,
        "cost": 2,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 2,
        "maxActions": 1,

        "isRanged": true,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 4,
        "skillCallbackName": "cbSkillShadow",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Spirit",
        "portrait": null,
        "cost": 5,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 20,
        "attack": 1,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 3,
        "skillCallbackName": "cbSkillSpirit",
        "hasPassive": true,
        "passiveCallbackName": null
    },
    {
        "name": "Bard",
        "portrait": null,
        "cost": 3,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 22,
        "attack": 2,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 3,
        "skillCallbackName": "cbSkillBard",
        "hasPassive": false,
        "passiveCallbackName": null
    },
    {
        "name": "Tyrant",
        "portrait": null,
        "cost": 4,
        "type": "natial",

        "element": "ELEMENT_NONE",
        "maxHP": 30,
        "attack": 5,
        "maxActions": 1,

        "isRanged": false,
        "isQuick": false,
        "isMaster": true,

        "hasSkill": true,
        "skillCost": 7,
        "skillCallbackName": "cbSkillTyrant",
        "hasPassive": true,
        "passiveCallbackName": null
    },

    // ========== Spells ==========
    {
        "name": "Magic Crystal",
        "portrait": null,
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
        "portrait": null,
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
        "portrait": null,
        "cost": 4,
        "type": "spell",

        "callbackName": "cbSpellTransmute",
        "longdesc": `
        Seals an enemy's actions for 2 turns,
        or 3 turns if your master is the Witch.`
    },
    {
        "name": "Vanish",
        "portrait": null,
        "cost": 4,
        "type": "spell",

        "callbackName": "cbSpellVanish",
        "longdesc": `
        Target enemy natial takes 6 damage, or
        7 damage if your master is the Paladin.`
    },
    {
        "name": "Uptide",
        "portrait": null,
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
        "portrait": null,
        "cost": 2,
        "type": "spell",

        "callbackName": "cbSpellBlaze",
        "longdesc": `
        Target gains 2 ATK. Fire elemental
        Natials gain 3 ATK instead.`
    },
    {
        "name": "Wall",
        "portrait": null,
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
        "portrait": null,
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
        "portrait": null,
        "cost": 1,
        "type": "spell",

        "callbackName": "cbSpellReduce",
        "longdesc": `
        Halves the mana cost of one card in
        your hand.`
    },
    {
        "name": "Disaster",
        "portrait": null,
        "cost": 5,
        "type": "spell",

        "callbackName": "cbSpellDisaster",
        "longdesc": `
        All enemies in the same row as the
        target take 4 damage.`
    }
]