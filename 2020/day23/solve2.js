"use strict"

// solving the puzzle takes (my computer) 0.220s

const input = Deno.readTextFileSync("input.txt").trim()

const LENGTH = 1000 * 1000

const CUPS = new Uint32Array(LENGTH) // each item points to the next item in circle;
                                     // zero based - input will be converted to base zero too

const LAST = LENGTH -1 

const LOWEST = 0

const HIGHEST = LAST

const MAX = 10 * 1000 * 1000

var current = 0


function main() {

    processInput()

    for (let n = 0; n < MAX; n++) { change() }
    
    console.log("the answer is", findAnswer())
}

///////////////////////////////////////////////////////////

function processInput() {

    const symbols = input.split("")
    
    const numbers = symbols.map(function (x) { return parseInt(x) - 1 })
    
    for (let n = 0; n < LENGTH; n++) { CUPS[n] = n + 1 }

    current = numbers[0]
    
    CUPS[LAST] = current
    
    for (let n = 0; n < numbers.length; n++) {
    
        const curr = numbers[n]
        const next = numbers[n + 1]
        
        if (next == undefined) { CUPS[curr] = numbers.length; break }
        
        CUPS[curr] = next       
    }
}

///////////////////////////////////////////////////////////

function change() {

    // extracting the segment (a, b and c)

    const a = CUPS[current]
    
    const b = CUPS[a]
    
    const c = CUPS[b]
    
    CUPS[current] = CUPS[c]
    
    //
    // now the segment is extracted (and the circle is closed)
    //
    
    // inserting the segment
    
    const destination = findDestinationCup(a, b, c)
    
    const d = CUPS[destination]  
    
    CUPS[destination] = a
    
    CUPS[c] = d

    // updating current cup
    
    current = CUPS[current]
}

///////////////////////////////////////////////////////////

function findDestinationCup(a, b, c) {

    let destination = current

    while (true) {
        
        destination -= 1
    
        if (destination < LOWEST) { destination = HIGHEST }
        
        if (a == destination) { continue }
        if (b == destination) { continue }
        if (c == destination) { continue }

        break
    }
    return destination
}

///////////////////////////////////////////////////////////

function findAnswer() {

    const a = CUPS[0]
    
    const b = CUPS[a]
    
    return (a + 1) * (b + 1) // converted back to base one
}

main()

