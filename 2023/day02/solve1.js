"use strict"

// solving the puzzle takes (my computer) 0.025s

const GAMES = [ ]

const RED = 12
const GREEN = 13
const BLUE = 14


function main() {

    processInput()
    
    let sum = 0
     
    for (const game of GAMES) { if (isPossible(game)) { sum += game.id } }
    
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()

    const lines = input.split("\n")
    
    let n = 0 // one based
    
    for (const line of lines) { 
    
        n += 1
        
        const game = { "id": n, "sets": [ ] } 
        
        GAMES.push(game)
    
        const rawData = line.split(":").pop().trim()
        
        const rawSets = rawData.split(";")
    
        for (const rawSet of rawSets) { 

            const set = createSet(rawSet)
            
            game.sets.push(set)
        }
    }
}

function createSet(source) {

    const set = { "red": 0, "green": 0, "blue": 0 }

    const segments = source.split(",")

    for (const segment of segments) { 
    
        const tokens = segment.trim().split(" ")
        
        const number = parseInt(tokens.shift())
 
        const color = tokens.shift().trim()
        
        set[color] = number
    }
    
    return set
}

function isPossible(game) {
    
    for (const set of game.sets) {
    
        if (set.red   > RED)   { return false }
        if (set.green > GREEN) { return false }
        if (set.blue  > BLUE)  { return false }
    }
    
    return true
}

main()

