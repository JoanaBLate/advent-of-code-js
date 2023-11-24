"use strict"

// solving the puzzle takes (my computer) 0.120s

const DIM = 5  // dimension (width or height)

const CENTER = 2 // [ 0, 1, *2*, 3, 4 ]

const EMPTY = 0
const BUG = 1

const NORTH = 0
const SOUTH = 1
const WEST  = 2
const EAST  = 3

const DEPTH = 200 // -200, 0, +200

const allLevels = { } // levelNumber: levelObject 


function main() {

    const map = processInput() 
        
    for (let n = (-DEPTH-1); n <= (+DEPTH+1); n++) { // includes one aditional passive level on each extreme
    
        allLevels["" + n] = createLevel() 
    }
    
    getLevel(0).map = map
    
    for (let n = 0; n < 200; n++) { runCycle(n + 1) } // avoids empty maps
    
    console.log("the answer is", countAllBugs())
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    const map = createMap()
    
    for (let row = 0; row < DIM; row++) {
    
        const line = lines.shift().trim()
        
        for (let col = 0; col < DIM; col++) {
        
            if (line[col] == "#") { map[row][col] = BUG }
        }
    }
    return map
}

///////////////////////////////////////////////////////////

function createLevel() {

    return { "map": createMap(), "census": createMap() }
}

function createMap() {

    const map = new Array(DIM)
    
    for (let n = 0; n < DIM; n++) { map[n] = new Uint8Array(DIM) }
    
    return map
}

function getLevel(n) {
    
    return allLevels["" + n]
}

///////////////////////////////////////////////////////////

function runCycle(depth) {

    for (let n = -depth; n <= +depth; n++) { executeLevelCensus(n) }
    
    for (let n = -depth; n <= +depth; n++) { repopulateLevel(n) }
}

///////////////////////////////////////////////////////////

function executeLevelCensus(depth) {
    
    const census = getLevel(depth).census

    for (let row = 0; row < DIM; row++) {
    
        for (let col = 0; col < DIM; col++) {
        
            let count = 0
            
            if (row == CENTER  &&  col == CENTER) { continue }
            
            count += countNeighbor(depth, row-1, col, NORTH)
            count += countNeighbor(depth, row+1, col, SOUTH)
            count += countNeighbor(depth, row, col-1, WEST)
            count += countNeighbor(depth, row, col+1, EAST)

            census[row][col] = count            
        }
    }
}

function countNeighbor(depth, row, col, going) {

    if (row < 0)    { return countThisNeighbor(depth - 1, CENTER - 1, CENTER) }
    if (row == DIM) { return countThisNeighbor(depth - 1, CENTER + 1, CENTER) }

    if (col < 0)    { return countThisNeighbor(depth - 1, CENTER, CENTER - 1) }
    if (col == DIM) { return countThisNeighbor(depth - 1, CENTER, CENTER + 1) }
    
    if (row == CENTER  &&  col == CENTER) {
    
        if (going == NORTH) { return countBugsInRow(depth + 1, DIM - 1) }
        
        if (going == SOUTH) { return countBugsInRow(depth + 1, 0) }
        
        if (going == WEST) { return countBugsInCol(depth + 1, DIM - 1) }
        
        return countBugsInCol(depth + 1, 0) // going EAST
    }    
        
    return getLevel(depth).map[row][col]
}

function countThisNeighbor(depth, row, col) {
    
    const map = getLevel(depth).map
    
    return map[row][col]
}

function countBugsInRow(depth, row) {

    const map = getLevel(depth).map
    
    let count = 0

    for (let col = 0; col < DIM; col++) {
    
        count += map[row][col]    
    }
    
    return count
}

function countBugsInCol(depth, col) {

    const map = getLevel(depth).map
    
    let count = 0

    for (let row = 0; row < DIM; row++) {
    
        count += map[row][col]    
    }
    
    return count
}

///////////////////////////////////////////////////////////

function repopulateLevel(depth) {

    const levelObj = getLevel(depth)
    
    const map = levelObj.map
    const census = levelObj.census 

    for (let row = 0; row < DIM; row++) {
    
        for (let col = 0; col < DIM; col++) {
        
            if (row == CENTER  &&  col == CENTER) { continue }

            const neighbors = census[row][col]
            
            if (map[row][col] == BUG) {
            
                if (neighbors != 1) { map[row][col] = EMPTY }
            }
            else {
            
                if (neighbors == 1  ||  neighbors == 2) {  map[row][col] = BUG }
            }
        }
    }
}

///////////////////////////////////////////////////////////

function countAllBugs() {

    let count = 0
    
    for (let n = -DEPTH; n <= +DEPTH; n++) { 
    
        const map = getLevel(n).map
        
        count += countTheseBugs(map)
    }
    return count
}

function countTheseBugs(map) {

    let count = 0
    
    for (let row = 0; row < DIM; row++) {
        
        for (let col = 0; col < DIM; col++) {
        
            if (row == CENTER  &&  col == CENTER) { continue }
            
            count += map[row][col]
        }
    }
    return count
}

///////////////////////////////////////////////////////////

function show(map) {

    console.log("")
    
    for (let row = 0; row < DIM; row++) {
        
        let s = ""
        
        for (let col = 0; col < DIM; col++) {
        
            if (row == CENTER  &&  col == CENTER) { s += "?"; continue }
            
            s += map[row][col]
        }
        console.log(s)
    }
}

main()

