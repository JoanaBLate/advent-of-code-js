"use strict"

// solving the puzzle takes (my computer) 0.090s

var immunoArquive = [ ]

var infectionArquive = [ ] 

const allInitiatives = [ ]

var immuno = null

var infection = null

var boost = 1


function main() {

    processInput()
        
    allInitiatives.sort(function (a,b) { return b - a })
    
    let highestFailure = 0
    
    let lowestSuccess = 0
    
     
    while (true) {
    
        if (! immunoWins()) { 
        
            if (boost == lowestSuccess - 1) { boost = lowestSuccess; break }
            
            highestFailure = boost

            if (lowestSuccess == 0) { boost = 2 * boost; continue }
            
            boost = Math.floor((boost + lowestSuccess) / 2)
            
            continue        
        }
        
        // victory
        
        if (boost == highestFailure + 1) { break }
        
        lowestSuccess = boost
        
        boost = Math.floor((boost + highestFailure) / 2)      
    }
    
    console.log("the answer is", sumAllUnities(immuno), " (boost", boost + ")")
}

function immunoWins() {

    immuno = structuredClone(immunoArquive)
    infection = structuredClone(infectionArquive)
    
    for (const group of immuno) { group.damage += boost }

    let oldSumImmuno = 0
    let oldSumInfection = 0
    
    while (true) {
    
        resetArmy(immuno)
        resetArmy(infection)
    
        selectTargets(immuno, infection)
        selectTargets(infection, immuno)
        
        for (const initiative of allInitiatives) { attackByInitiative(initiative) }
        
        let sumImmuno = sumAllUnities(immuno)        
        let sumInfection = sumAllUnities(infection)
    
        if (sumInfection == 0) { return true }

        if (sumImmuno == 0) { return false }

        if (sumImmuno == oldSumImmuno  &&  sumInfection == oldSumInfection) { return false } // avoids infinite loop

        oldSumImmuno = sumImmuno
        oldSumInfection = sumInfection
    }
}

function sumAllUnities(army) {

    let sum = 0

    for (const group of army) { sum += group.units }
    
    return sum
}

///////////////////////////////////////////////////////////

function createGroup() {

    return {
    
        "units": 0,
        "life": 0,
        "initiative": 0,
        "attack": "", // damage kind
        "damage": 0,
        "power": 0,
        "isTarget": false,
        "target": null,
        "weak": createDefenseObj(),
        "immune": createDefenseObj()
    }
}
    
function createDefenseObj() {

    return {
        "bludgeoning": false,
        "cold": false,
        "fire": false,
        "radiation": false,
        "slashing": false
    }
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    let army = immunoArquive
    
    for (const rawline of lines) { 
    
        const line = rawline.trim()
        
        if (line == "Immune System:") { continue }
        if (line == "") { continue }
        if (line == "Infection:") { army = infectionArquive; continue }
        
        const group = createGroup()
                
        army.push(group)
        
        const tokens = line.split(" ")
        
        group.units = parseInt(tokens.shift())

        tokens.shift() // units
        tokens.shift() // each
        tokens.shift() // with
        
        group.life = parseInt(tokens.shift())
        
        tokens.shift() // hit
        tokens.shift() // points
        
        popWeakImmuneData(tokens, group)
        
        tokens.shift() // with
        tokens.shift() // an
        tokens.shift() // attack
        tokens.shift() // that
        tokens.shift() // does
        
        group.damage = parseInt(tokens.shift())
        
        group.attack = tokens.shift()
        
        tokens.shift() // damage
        tokens.shift() // at
        tokens.shift() // initiative
        
        group.initiative = parseInt(tokens.shift())
        
        allInitiatives.push(group.initiative)
    }
}

function popWeakImmuneData(srcTokens, group) {

    const tokens = [ ]
    
    while (srcTokens[0] != "with") { tokens.push(srcTokens.shift()) }

    popWeakImmuneDataCore(group, tokens)
    popWeakImmuneDataCore(group, tokens)
}

function popWeakImmuneDataCore(group, tokens) {

    if (tokens.length == 0) { return }
    
    const weak = tokens[0].endsWith("weak")
    
    const obj = weak ? group.weak : group.immune
    
    tokens.shift() // (weak or (immune
    tokens.shift() // to
    
    while (true) {
    
        const token = tokens.shift()
        
        const end = token.at(-1)
    
        const kind = token.replace(end, "")
    
        obj[kind] = true 
        
        if (end == ";"  ||  end == ")") { return }
    }
}    
    
///////////////////////////////////////////////////////////

/* 

// OBSOLETE (using structuredClone now)

function cloneArmy(army) {

    const newArmy = [ ]
    
    for (const group of army) { newArmy.push(cloneGroup(group)) }
    
    return newArmy
}

function cloneGroup(group) {

    const newGroup = createGroup() 
    
    newGroup.units = group.units
    newGroup.life = group.life
    newGroup.initiative = group.initiative
    newGroup.attack = group.attack
    newGroup.damage = group.damage
    newGroup.power = group.power
    newGroup.isTarget = group.isTarget
    newGroup.target = group.target
    newGroup.weak = cloneDefenseObj(group.weak)
    newGroup.immune = cloneDefenseObj(group.immune)
    
    return newGroup
}

function cloneDefenseObj(obj) {

    const newObj = createDefenseObj()
    
    newObj.bludgeoning = obj.bludgeoning
    newObj.cold = obj.cold
    newObj.fire = obj.fire
    newObj.radiation = obj.radiation
    newObj.slashing = obj.slashing
    
    return newObj
}
*/

///////////////////////////////////////////////////////////

function resetArmy(army) {

    for (const group of army) { 
    
        group.target = null
        group.isTarget = false

        group.power = group.units * group.damage
    }

    sortByPowerOrInitiative(army)
}

function sortByPowerOrInitiative(groups) {

    if (groups.length < 2) { return }
    
    let changed = false
    
    for (let index = 1; index < groups.length; index++) {

        const current = groups[index]
        const previous = groups[index - 1]
                
        if (previous.power > current.power) { continue }
        
        if (previous.power < current.power) { 
        
            groups[index] = previous; groups[index-1] = current; changed = true; continue 
        }
        
        // previous.power == current.power:
        
        if (previous.initiative < current.initiative) { 
        
            groups[index] = previous; groups[index-1] = current; changed = true
        }
     }
     
    if (changed) { sortByPowerOrInitiative(groups) } // recursive; MUST finish loop before do recursion
}

///////////////////////////////////////////////////////////

function selectTargets(attackers, defenders) {
    
    for (const attacker of attackers) { selectTarget(attacker, defenders) }
}

function selectTarget(attacker, defenders) {

    if (attacker.units == 0) { return }

    let bestDamage = 0
    let candidates = [ ]

    for (const defender of defenders) {

        if (defender.isTarget) { continue }
        
        if (defender.units == 0) { continue }
        
        if (defender.immune[attacker.attack]) { continue }
        
        const hasBonus = defender.weak[attacker.attack]
        
        const damage = attacker.power * (hasBonus ? 2 : 1)
        
        if (damage < bestDamage) { continue }
        
        if (damage == bestDamage) { candidates.push(defender); continue }
        
        // damage > bestDamage:
        
        bestDamage = damage
        candidates = [ defender ] 
    }
    
    if (candidates.length == 0) { return }
    
    sortByPowerOrInitiative(candidates)
    
    const defender = candidates[0]
    
    defender.isTarget = true
    
    attacker.target = defender
}

///////////////////////////////////////////////////////////

function attackByInitiative(initiative) {

    const attacker = getGroupByInitiative(initiative)
    
    if (attacker.units == 0) { return }
    
    const defender = attacker.target

    if (defender == null) { return }
    
    if (defender.units == 0) { return }
        
    const hasBonus = defender.weak[attacker.attack]
    
    const damage = attacker.power * (hasBonus ? 2 : 1)
    
    let killed = Math.floor(damage / defender.life)
    
    if (killed > defender.units) { killed = defender.units }
    
    defender.units -= killed
    
    defender.power = defender.units * defender.damage 
}

function getGroupByInitiative(initiative) {

    for (const group of immuno) { if (group.initiative == initiative) { return group } }
    
    for (const group of infection) { if (group.initiative == initiative) { return group } }
}

main()

