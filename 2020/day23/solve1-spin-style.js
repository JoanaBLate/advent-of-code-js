"use strict"

// solving the puzzle takes (my computer) 0.026s

/*

    WARNING: NOT EXPECTING REPEATED CHARACTERS IN INPUT

*/

const input = Deno.readTextFileSync("input.txt").trim()

var CUPS = [ ]

var LENGTH = 0

var LOWEST = 0

var HIGHEST = 9

var current = 0


function main() {

    processInput()

    current = CUPS[0]

    for (let n = 0; n < 100; n++) { change() }
    
    spinTillThisOnFirstPos(1)
    
    console.log("the answer is", CUPS.join("").substr(1))
}

function processInput() {

    LENGTH = input.length
        
    CUPS = new Uint8Array(LENGTH)
    
    for (let n = 0; n < input.length; n++) { CUPS[n] = parseInt(input[n]) }
    
    while (! CUPS.includes(LOWEST))  { LOWEST += 1 }
    while (! CUPS.includes(HIGHEST)) { HIGHEST -= 1 }
}

///////////////////////////////////////////////////////////

function change() {

    spinTillThisOnLastPos(current)

    const a = CUPS[0]
    const b = CUPS[1]
    const c = CUPS[2]

    const destination = findDestinationCup(a, b, c)

    halfSpinTillThisOnLastPos(destination) 

    updateCurrent()
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

function updateCurrent() {

    let index = CUPS.indexOf(current) + 1
    
    if (index == CUPS.length) { index = 0 }
        
    current = CUPS[index]
}

///////////////////////////////////////////////////////////

function spinTillThisOnFirstPos(target) {
    
    while (CUPS[0] != target) { spinLeft() }
}

function spinTillThisOnLastPos(target) {
    
    while (CUPS[LENGTH - 1] != target) { spinLeft() }
}

function halfSpinTillThisOnLastPos(target) {
    
    while (CUPS[LENGTH - 1] != target) { halfSpinLeft() }
}

function spinLeft() {

    const first = CUPS[0]
    
    for (let n = 1; n < LENGTH; n++) { CUPS[n - 1] = CUPS[n] }
    
    CUPS[LENGTH - 1] = first
}

function halfSpinLeft() {

    const first = CUPS[3]
    
    for (let n = 4; n < LENGTH; n++) { CUPS[n - 1] = CUPS[n] }
    
    CUPS[LENGTH - 1] = first
}

///////////////////////////////////////////////////////////

main()

