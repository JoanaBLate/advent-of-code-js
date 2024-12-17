"use strict"

// solving the puzzle takes (my computer) 0.130s

let BOSS_HP = 0

let BOSS_DAMAGE = 0

var lowestMana = 999999

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    BOSS_HP     = parseInt(rawLines.shift().trim().split(" ").pop())
    BOSS_DAMAGE = parseInt(rawLines.shift().trim().split(" ").pop())

    heroTurn(createState())
    
    console.log("least amount of mana is", lowestMana)
}

function tryBest(state) {
    
    if (state.spentMana < lowestMana) { lowestMana = state.spentMana }
}

///////////////////////////////////////////////////////////

function createState() {

    const obj = {
    
        actions: "",
    
        heroLife:  50,
        heroMana: 500,
        spentMana:  0,
            
        bossLife: BOSS_HP,

        shieldTurns: 0,
        poisonTurns: 0,
        rechargeTurns: 0
    }
    
    Object.seal(obj)
    return obj
}

function cloneState(source) {

    const state = createState()
    
    state.actions = source.actions
    
    state.heroLife = source.heroLife
    state.heroMana = source.heroMana
    state.spentMana = source.spentMana
    
    state.bossLife = source.bossLife
    
    state.shieldTurns = source.shieldTurns
    state.poisonTurns = source.poisonTurns
    state.rechargeTurns = source.rechargeTurns

    return state
}

///////////////////////////////////////////////////////////

function basicUpdate(state) {
    
    if (state.poisonTurns > 0) { state.bossLife -= 3 }
    
    if (state.rechargeTurns > 0) { state.heroMana += 101 }
    
    if (state.shieldTurns > 0) { state.shieldTurns -= 1 }
    if (state.poisonTurns > 0) { state.poisonTurns -= 1 }
    if (state.rechargeTurns > 0) { state.rechargeTurns -= 1 }
}

///////////////////////////////////////////////////////////
        
function heroTurn(state) { // recursive function ( A calls B, B calls C, C calls A)

    basicUpdate(state)
    
    if (state.bossLife <= 0) { tryBest(state); return } 
    
    castDrain(state)
    
    castMissile(state)
    
    castPoison(state)
    
    castRecharge(state)
    
    castShield(state)
}

function castDrain(currState) {
    
    const mana = 73

    if (currState.heroMana < mana) { return }
    
    const newState = cloneState(currState)
    
    newState.actions += "D"
    
    newState.heroMana -= mana
    newState.spentMana += mana
    
    newState.heroLife += 2
    newState.bossLife -= 2
    
    if (newState.bossLife <= 0) { tryBest(newState); return }
        
    bossTurn(newState)
}

function castMissile(currState) {

    const mana = 53

    if (currState.heroMana < mana) { return }
    
    const newState = cloneState(currState)
    
    newState.actions += "M"
    
    newState.heroMana -= mana
    newState.spentMana += mana
    
    newState.bossLife -= 4
    
    if (newState.bossLife <= 0) { tryBest(newState); return }
        
    bossTurn(newState)
}

function castPoison(currState) {

    const mana = 173

    if (currState.heroMana < mana) { return }
    
    if (currState.poisonTurns != 0) { return }
    
    const newState = cloneState(currState)
    
    newState.actions += "P"
    
    newState.heroMana -= mana
    newState.spentMana += mana
    
    newState.poisonTurns = 6
        
    bossTurn(newState)
} 

function castRecharge(currState) {

    const mana = 229

    if (currState.heroMana < mana) { return }
    
    if (currState.rechargeTurns != 0) { return }
    
    const newState = cloneState(currState)
    
    newState.actions += "R"
    
    newState.heroMana -= mana
    newState.spentMana += mana
    
    newState.rechargeTurns = 5
        
    bossTurn(newState)
}   

function castShield(currState) {

    const mana = 113

    if (currState.heroMana < mana) { return }
    
    if (currState.shieldTurns != 0) { return }
    
    const newState = cloneState(currState)
    
    newState.actions += "S"
    
    newState.heroMana -= mana
    newState.spentMana += mana
    
    newState.shieldTurns = 6
        
    bossTurn(newState)
}   
    
///////////////////////////////////////////////////////////
        
function bossTurn(state) {
    
    if (state.spentMana >= lowestMana) { return }    

    basicUpdate(state)
    
    if (state.bossLife <= 0) { tryBest(state); return } 

    const defense = (state.shieldTurns == 0) ? 0 : 7
    
    const damage = Math.max(1, BOSS_DAMAGE - defense)
    
    state.heroLife -= damage
    
    if (state.heroLife <= 0) { return } 
    
    heroTurn(state)   
}

main()

