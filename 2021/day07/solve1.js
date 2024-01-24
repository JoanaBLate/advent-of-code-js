"use strict"

// solving the puzzle takes (my computer) 0.027s

const input = Deno.readTextFileSync("input.txt").trim()

const POSITIONS = [ ]

var TOTAL = 0


function main() {

    processInput()
    
    const average = Math.round(TOTAL / POSITIONS.length)
    
    const a = bestFuel(average, -1)
    const b = bestFuel(average, +1)
    
    console.log("the answer is", Math.min(a, b))
}

function processInput() {
        
    const strNumbers = input.split(",")
    
    for (const strNumber of strNumbers) { 
    
        const position = parseInt(strNumber)
        
        POSITIONS.push(position)
        
        TOTAL += position
    }
}

///////////////////////////////////////////////////////////

function bestFuel(reference, delta) {

    let best = Infinity
    
    while (true) {
    
    const candidate = calcFuel(reference)
    
        if (candidate >= best) { return best }
    
        best = candidate
        
        reference += delta    
    }
}

function calcFuel(reference) {

    let sum = 0

    for (const position of POSITIONS) { sum += Math.abs(position - reference) }

    return sum
}

main()

