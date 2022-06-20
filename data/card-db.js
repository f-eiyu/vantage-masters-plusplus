const cardDB = [
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
        "skillReady": false,
        "skill": null,
        "hasPassive": false,
        "passive": null
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
        "skillReady": false,
        "skill": null,
        "hasPassive": false,
        "passive": null
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
        "skillReady": false,
        "skill": null,
        "hasPassive": false,
        "passive": null
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
        "skillReady": false,
        "skill": null,
        "hasPassive": false,
        "passive": null
    },
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
        "skillReady": false,
        "skill": null,
        "hasPassive": false,
        "passive": null
    },
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