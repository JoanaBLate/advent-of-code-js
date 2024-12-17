"use strict"

// solving the puzzle takes (my computer) 0.033s

const input = Deno.readTextFileSync("input.txt").trim()

const POSITIONS = [ ]

var MIN = Infinity
var MAX = 0


function main() {

    processInput()
        
    console.log("the answer is", calcBestFuel())
}

function processInput() {
        
    const strNumbers = input.split(",")
    
    for (const strNumber of strNumbers) { 
    
        const position = parseInt(strNumber)
        
        POSITIONS.push(position)
        
        if (position < MIN) { MIN = position }
        if (position > MAX) { MAX = position }
    }    
}

///////////////////////////////////////////////////////////

function calcBestFuel() {
    
    let bestFuel = calcFuel(MIN)
    
    let candidatePos = MIN
        
    while (true) {
    
        if (candidatePos == MAX) { break }
    
        candidatePos += 1
        
        const fuel = calcFuel(candidatePos)
         
        if (fuel < bestFuel) { bestFuel = fuel }
    }
    
    return bestFuel
}

function calcFuel(reference) {

    let sum = 0

    for (const position of POSITIONS) { sum += calcFuelFor(position, reference) }

    return sum
}

function calcFuelFor(position, reference) {
    
    const steps = Math.abs(position - reference)    

    const a = 1
    
    const b = steps

    const average = (a + b) / 2

    return average * steps
}

main()

