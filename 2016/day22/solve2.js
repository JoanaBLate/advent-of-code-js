"use strict"

// solving the puzzle takes (my computer) 0.028s

/*
 *  THIS PROGRAM ASSUMES THAT THE CARRIER CAN
 *  APPROACH THE CARGO WITHOUT COMPLEX MANEUVERS
 *
 *  THIS PROGRAM ASSUMES THAT ALL CELLS OF THE TWO UPPER ROWS
 *  HAVE SIZE ENOUGH FOR RECEIVEING THE CARGO
 */
 
const CELLS = { }

var numberOfRows = 0
var numberOfCols = 0

var homeX = 0 // carrier starting position
var homeY = 0

var targetX = 0 // carrier target position 
const targetY = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    rawLines.shift() // root..
    rawLines.shift() // Filesystem...
    
    for (const rawLine of rawLines) { 
    
        const line = rawLine.trim().replace("/dev/grid/node-", "")
        
        const tokens = line.trim().split(" ")
    
        const rawId = tokens.shift()
    
        while (tokens[0] == "") { tokens.shift() }
    
        const size = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
    
        const used = parseInt(tokens.shift())

        //
        
        const id = rawId.replace("x", "").replace("-y", "~")
        
        if (id.startsWith("0~")) { numberOfRows += 1 }

        if (id.endsWith("~0"))   { numberOfCols += 1 }
        
        CELLS[id] = { "size": size, "used": used, "tried": false, "step": 0 }
        
        if (used == 0) { 
            const coords = id.split("~")
            homeX = parseInt(coords.shift())
            homeY = parseInt(coords.shift())            
        }                    
    }
    
    targetX = numberOfCols - 2 // left edge of the cargo
    
    console.log("fewest number of steps is", stepsApproachingCargo() + stepsMovingCargo())
    
 // showGrid()
}
 
// APPROACHING CARGO //////////////////////////////////////
 
function stepsApproachingCargo() {
        
    CELLS[homeX + "~" + homeY].tried = true

    let futurePoints = [ createPoint(homeX, homeY) ]

    let steps = 0
    
    let success = false
    
    while (true) {
    
        const pointsToWalk = futurePoints

        futurePoints = [ ]
        
        for (const point of pointsToWalk) { walk(point) }
        
        if (success) { return steps }
        
        steps += 1
    }
    
    function walk(point) {
    
        const x = point.x
        const y = point.y
        
        const cell = CELLS[x + "~" + y]
        
        cell.step = steps
        
        if (x == targetX  &&  y == targetY) { success = true }
        
        if (success) { return }
        
        const size = cell.size
        
        tryWalk(x, y-1, size) // north
        tryWalk(x, y+1, size) // south
        tryWalk(x-1, y, size) // west
        tryWalk(x+1, y, size) // east
    }
    
    function tryWalk(x, y, size) {
    
        const cell = CELLS[x + "~" + y]
        
        if (cell == undefined) { return }
        
        if (cell.tried) { return }
        
        cell.tried = true
        
        if (cell.used > size) { return }
    
        if (x == targetX + 1  &&  y == targetY) { return } // over cargo
        
        futurePoints.push(createPoint(x,y))
    }
}

function createPoint(x, y) {

    return { "x": x, "y": y }
}

function showGrid() {

    let s = ""
    
    for (let n = 0; n < numberOfCols; n ++) { s += (n % 10).toString().padStart(4) }
    
    s += "\n" + "-".repeat(4 * numberOfCols) + "\n"

    for (let y = 0; y < numberOfRows; y++) {
    
        for (let x = 0; x < numberOfCols; x++) {
            
            const cell = CELLS[x + "~" + y]
            
            if (cell.step == 0) {
            
                if (x != homeX  ||  y != homeY) { s += " ..."; continue }
            }

            s += cell.step.toString().padStart(4)
        }
        s += "  - " + y + "\n\n"
    }
    
    console.log("\n" + s)
}

// MOVING CARGO ///////////////////////////////////////////

function stepsMovingCargo() { // assumes carrier is at the left of the cargo

// while cargo advances one cell,
// full carrier circle takes 5 steps

//  home   1     2     3    4     5
//  x_#   x#_   x#x   x#x  x#x   _#x
//  xxx   xxx   xx_   x_x  _xx   xxx
//

    const allCargoMoves = (numberOfCols - 1)

    let fullCarrierCircles = 5 * (allCargoMoves - 1) // the last carrier move is simple
    
    return fullCarrierCircles + 1
}

///////////////////////////////////////////////////////////

main()

