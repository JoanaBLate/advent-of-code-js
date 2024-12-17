"use strict"

// solving the puzzle takes (my computer) 0.053s

const input = Deno.readTextFileSync("input.txt").trim()

const BLUEPRINTS = [ ]

const NONE = 0
const ORE = 1
const CLAY = 2
const OBSIDIAN = 4
const GEODE = 8

const MINUTES = 24

var oreRobotOreCost = 0 

var clayRobotOreCost = 0

var obsidianRobotOreCost = 0
var obsidianRobotClayCost = 0

var geodeRobotOreCost = 0
var geodeRobotObsidianCost = 0


function main() {

    processInput()
    
    let total = 0
    
    let index = 0
    
    for (const blueprint of BLUEPRINTS) {
    
        readBlueprint(blueprint)
    
        index += 1
    
        total += index * findBestProduction()   
    }
    
    console.log("the answer is", total)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { BLUEPRINTS.push(line) }
}

function readBlueprint(rawLine) {
    
    const line = rawLine.trim().split(":").pop()

    const segments = line.split(".")
    
    segments.pop()
    
    //
    
    const tokensA = segments.shift().split(" ")
    
    tokensA.pop() // ore
    
    oreRobotOreCost = parseInt(tokensA.pop())
    
    //
    
    const tokensB = segments.shift().split(" ")
    
    tokensB.pop() // ore
    
    clayRobotOreCost = parseInt(tokensB.pop())
    
    //
    
    const tokensC = segments.shift().split(" ")
    
    tokensC.pop() // clay
    
    obsidianRobotClayCost = parseInt(tokensC.pop())
    
    tokensC.pop() // and
    tokensC.pop() // ore
    
    obsidianRobotOreCost = parseInt(tokensC.pop())
    
    //
    
    const tokensD = segments.shift().split(" ")
    
    tokensD.pop() // obsidian
    
    geodeRobotObsidianCost = parseInt(tokensD.pop())
    
    tokensD.pop() // and
    tokensD.pop() // ore
    
    geodeRobotOreCost = parseInt(tokensD.pop())
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function createState() {

    return {
        "minutes": MINUTES, 
        "ore": 0,
        "clay": 0,
        "obsidian": 0,
        "geode": 0, 
        "oreBots": 1, 
        "clayBots": 0, 
        "obsidianBots": 0,
        "geodeBots": 0,
        "newBot": NONE
    }
}

function cloneState(src) {

    return {
        "minutes": src.minutes, 
        "ore": src.ore,
        "clay": src.clay,
        "obsidian": src.obsidian,
        "geode": src.geode, 
        "oreBots": src.oreBots, 
        "clayBots": src.clayBots, 
        "obsidianBots": src.obsidianBots,
        "geodeBots": src.geodeBots,
        "newBot": src.newBot
    }
}

function startMinute(state) {

    state.minutes -= 1
    
    if (state.newBot == ORE) { state.oreBots += 1 }
    if (state.newBot == CLAY) { state.clayBots += 1 }
    if (state.newBot == GEODE) { state.geodeBots += 1 }
    if (state.newBot == OBSIDIAN) { state.obsidianBots += 1 }
    
    state.newBot = NONE

    let available = 0 // bitwise data
    
    if (state.ore >= oreRobotOreCost) { available |= ORE }
        
    if (state.ore >= clayRobotOreCost) { available |= CLAY }
        
    if (state.ore >= obsidianRobotOreCost  &&  state.clay >= obsidianRobotClayCost) { available |= OBSIDIAN }
        
    if (state.ore >= geodeRobotOreCost  &&  state.obsidian >= geodeRobotObsidianCost) { available |= GEODE }
    
    return available
}

function createBot(state, bot) {

    state.newBot = bot
    
    if (bot == ORE)  { state.ore -= oreRobotOreCost; return }

    if (bot == CLAY) { state.ore -= clayRobotOreCost; return }

    if (bot == OBSIDIAN) { 

        state.ore -= obsidianRobotOreCost
    
        state.clay -= obsidianRobotClayCost
        
        return
    }

   // (bot == GEODE) 

    state.ore -= geodeRobotOreCost

    state.obsidian -= geodeRobotObsidianCost
}

function endMinute(state) {

    state.ore += state.oreBots
    state.clay += state.clayBots
    state.geode += state.geodeBots
    state.obsidian += state.obsidianBots
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function findBestProduction() {
    
    const r = search(createState(), ORE)
    const c = search(createState(), CLAY)
    
    return Math.max(r, c)
}

///////////////////////////////////////////////////////////

function search(state, bot) {

    while (true) {
    
        if (state.minutes == 0) { return state.geode }
        
        const available = startMinute(state)

        if (! (available & bot)) { endMinute(state); continue }
        
        createBot(state, bot)
        
        endMinute(state)

        break
    }

    //

    const oreBots = state.oreBots + (state.newBot == ORE ? 1 : 0)

    const clayBots = state.clayBots + (state.newBot == CLAY ? 1 : 0)

    const obsidianBots = state.obsidianBots + (state.newBot == OBSIDIAN ? 1 : 0)
    
    let best = 0
    
    if (shallCreateOreBot(state, oreBots)) { best = Math.max(best, search(cloneState(state), ORE)) }
    
    if (shallCreateClayBot(state, clayBots)) { best = Math.max(best, search(cloneState(state), CLAY)) }
    
    if (shallCreateObsidianBot(state, clayBots, obsidianBots)) { best = Math.max(best, search(cloneState(state), OBSIDIAN)) }
    
    if (shallCreateGeodeBot(obsidianBots)) { best = Math.max(best, search(cloneState(state), GEODE)) }
    
    return best
}

///////////////////////////////////////////////////////////

function shallCreateOreBot(state, oreBots) {

    if (state.minutes < 4) { return false } // no time for collecting or for the material become useful (geode)
    
    const maxDailyDemand = Math.max(clayRobotOreCost, obsidianRobotOreCost, geodeRobotOreCost) // probably exaggerated
    
    const netDailyDemand = (state.minutes * maxDailyDemand - state.ore) / state.minutes

    return oreBots < netDailyDemand
}

function shallCreateClayBot(state, clayBots) {

    if (state.minutes < 6) { return false } // no time for collecting or for the material become useful (geode)
    
    const netDailyDemand = (state.minutes * obsidianRobotClayCost - state.clay) / state.minutes // probably exaggerated

    return clayBots < netDailyDemand
}

function shallCreateObsidianBot(state, clayBots, obsidianBots) {

    if (state.minutes < 4) { return false } // no time for collecting or for the material become useful (geode)

    if (clayBots == 0) { return false }
    
    const netDailyDemand = (state.minutes * geodeRobotObsidianCost - state.obsidian) / state.minutes // probably exaggerated

    return obsidianBots < netDailyDemand
}  

function shallCreateGeodeBot(obsidianBots) {
    
    if (obsidianBots == 0) { return false }
    
    return true // if there is no time for collecting, minutes will be processed till the end
}

///////////////////////////////////////////////////////////

main()

