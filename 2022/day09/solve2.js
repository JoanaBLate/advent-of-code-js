"use strict"

// solving the puzzle takes (my computer) 0.035s

const input = Deno.readTextFileSync("input.txt").trim()

const MOVES = [ ]

const PAWNS = [ ]

const steps = { "10~10": true }


function main() {

    processInput()
    
    for (let n = 0; n < 10; n++) { PAWNS.push(createPawn()) }
    
    for (const instruction of MOVES) { move(instruction) }    
        
    console.log("the answer is", Object.keys(steps).length)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        MOVES.push({ "direction": tokens.shift(), "amount": parseInt(tokens.shift()) })
    }
}

function createPawn() {

    return { "row": 10, "col": 10 }
}

///////////////////////////////////////////////////////////

function move(instruction) {

    let amount = instruction.amount

    while (amount > 0) {
    
        amount -= 1
        
        moveOnce(instruction.direction)    
    }
}

function moveOnce(direction) {

    const head = PAWNS[0]

    if (direction == "U") { head.row -= 1 }
    if (direction == "D") { head.row += 1 }
    if (direction == "L") { head.col -= 1 }
    if (direction == "R") { head.col += 1 }
        
    for (let n = 0; n < 9; n++) { adjustTail(PAWNS[n], PAWNS[n+1]) }
    
    const tail = PAWNS[9]
    
    steps[tail.row + "~" + tail.col] = true
}

function adjustTail(head, tail) {

    const deltaRow = head.row - tail.row
    const deltaCol = head.col - tail.col
        
    if (Math.abs(deltaRow) <= 1  &&  Math.abs(deltaCol) <= 1) { return false }
    
    if (deltaRow == 0) {        
        if (deltaCol > +1) { tail.col += 1 }
        if (deltaCol < -1) { tail.col -= 1 }
        return true
    }
    
    if (deltaCol == 0) {
        if (deltaRow > +1) { tail.row += 1 }
        if (deltaRow < -1) { tail.row -= 1 }
        return true
    }
    
    // diagonal move:
    
    if (deltaCol > 0) { tail.col += 1 }
    if (deltaCol < 0) { tail.col -= 1 }

    if (deltaRow > 0) { tail.row += 1 }
    if (deltaRow < 0) { tail.row -= 1 }
    
    return true
}

main()

