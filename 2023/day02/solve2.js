"use strict"

// solving the puzzle takes (my computer) 0.025s

const GAMES = [ ]


function main() {

    processInput()
    
    for (const game of GAMES) { calcGamePower(game) }

    let sum = 0
     
    for (const game of GAMES) { sum += game.power }
    
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()

    const lines = input.split("\n")
    
    let n = 0 // one based
    
    for (const line of lines) { 
    
        n += 1
        
        const game = { "id": n, "sets": [ ], "power": 0 } 
        
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

function calcGamePower(game) {
    
    let red = 0
    let green = 0
    let blue = 0
    
    for (const set of game.sets) {
    
        if (set.red   > red)   { red = set.red }
        if (set.green > green) { green = set.green }
        if (set.blue  > blue)  { blue = set.blue }
    }
    
    game.power = red * green * blue
}

main()

