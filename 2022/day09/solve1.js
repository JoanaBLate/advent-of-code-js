"use strict"

// solving the puzzle takes (my computer) 0.033s

const input = Deno.readTextFileSync("input.txt").trim()

const MOVES = [ ]

var headRow = 10
var headCol = 10

var tailRow = 10
var tailCol = 10

const steps = { "10~10": true }


function main() {

    processInput()
    
  // show()
    
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

///////////////////////////////////////////////////////////

function move(instruction) {

    let amount = instruction.amount

    while (amount > 0) {
    
        amount -= 1
        
        moveOnce(instruction.direction)    
    }
}

function moveOnce(direction) {

    if (direction == "U") { headRow -= 1 }
    if (direction == "D") { headRow += 1 }
    if (direction == "L") { headCol -= 1 }
    if (direction == "R") { headCol += 1 }
    
   // prompt("?"); show()
    
    adjustTail()
    
   //  prompt("?"); show()
}

function adjustTail() {

    if (adjustTailCore()) { steps[tailRow + "~" + tailCol] = true }
}

function adjustTailCore() {
    const deltaRow = headRow - tailRow
    const deltaCol = headCol - tailCol
        
    if (Math.abs(deltaRow) <= 1  &&  Math.abs(deltaCol) <= 1) { return false }
    
    if (deltaRow == 0) {        
        if (deltaCol > +1) { tailCol += 1 }
        if (deltaCol < -1) { tailCol -= 1 }
        return true
    }
    
    if (deltaCol == 0) {
        if (deltaRow > +1) { tailRow += 1 }
        if (deltaRow < -1) { tailRow -= 1 }
        return true
    }
    
    // diagonal move:
    
    if (deltaCol > 0) { tailCol += 1 }
    if (deltaCol < 0) { tailCol -= 1 }

    if (deltaRow > 0) { tailRow += 1 }
    if (deltaRow < 0) { tailRow -= 1 }
    
    return true
}

///////////////////////////////////////////////////////////

function show() {

    console.log("\n 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0")
    
    let n = 0
    for (let row = 1; row <= 20; row++) {
    
        let s = ""
    
        for (let col = 1; col <= 20; col++) {
        
            let c = "."
            
            if (headRow == row  &&  headCol == col) { c = "H" }
            if (tailRow == row  &&  tailCol == col) { c = "T" }
            
            s += " " + c
        }
        n += 1
        console.log(s + (n).toString().padStart(3))
    }
}

main()

