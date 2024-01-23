"use strict"

// solving the puzzle takes (my computer) 0.050s

//                                                                          //
//  *WARNING*: MAYBE YOU NEED TO USE A GREATER DIMENSION FOR YOUR INPUT!!!  //
//                                                                          //

const input = Deno.readTextFileSync("input.txt").trim()

const PATHS = [ ]

const DIM = 160 + 1 

const TILES = new Uint8Array(DIM * DIM)

const NEIGHBORS = new Uint8Array(DIM * DIM) // stores the number of black neighbors of the tile

const baseRow = Math.floor(DIM / 2)

const baseCol = Math.floor(DIM / 2)

const WHITE = 0

const BLACK = 1


function main() {

    processInput()
    
    for (const path of PATHS) { walk(path) }
    
    for (let n = 0; n < 100; n++) { doFlipping() }

    console.log("the answer is", countBlackTiles())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { PATHS.push(parsePath(line.trim())) }
}

function parsePath(line) {

    const list = [ ]
    
    while (line != "") {
    
        if (line[0] == "e"  ||  line[0] == "w") { 
        
            list.push(line[0]); line = line.substr(1)
        }
        else {
        
            list.push(line.substr(0, 2)); line = line.substr(2)
        }    
    }
    return list
}

///////////////////////////////////////////////////////////

function walk(path) {

    let row = baseRow
    let col = baseCol

    for (const step of path) {
    
        if (step == "e")  { col += 1; continue }
        if (step == "w")  { col -= 1; continue }
        if (step == "ne") { row -= 1; continue }
        if (step == "sw") { row += 1; continue }
        if (step == "nw") { row -= 1; col -= 1; continue }
        if (step == "se") { row += 1; col += 1; continue }
    }
        
    const index = row * DIM + col
    
    TILES[index] = (TILES[index] == 0) ? 1 : 0
}

function countBlackTiles() {

    let count = 0
    
    const off = TILES.length
    
    for (let n = 0; n < off; n++) { count += TILES[n] }
    
    return count
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function doFlipping() {
    
    resetBlackNeighbors()
    
    countBlackNeighbors()
            
    const off = TILES.length
    
    for (let n = 0; n < off; n++) { 
    
        const color = TILES[n]
        const blackNeighbors = NEIGHBORS[n]
        
        if (color == WHITE) {
        
            if (blackNeighbors == 2) { TILES[n] = BLACK }
            
            continue
        }    
        
        // color == BLACK
        
        if (blackNeighbors == 0) { TILES[n] = WHITE; continue }
        if (blackNeighbors  > 2) { TILES[n] = WHITE; continue }
    }    
}

///////////////////////////////////////////////////////////

function resetBlackNeighbors() {
    
    const off = TILES.length
    
    for (let n = 0; n < off; n++) { NEIGHBORS[n] = 0 }
}

///////////////////////////////////////////////////////////

function countBlackNeighbors() {
    
    for (let row = 0; row < DIM; row++) {

        for (let col = 0; col < DIM; col++) {
        
            spreadBlack(row, col)
        }
    }
}

function spreadBlack(row, col) {

    const index = row * DIM + col
    
    if (TILES[index] == WHITE) { return }
    
    spreadBlackOn(row, col + 1) // e
    spreadBlackOn(row, col - 1) // w
    spreadBlackOn(row - 1, col) // ne
    spreadBlackOn(row + 1, col) // sw
    spreadBlackOn(row - 1, col - 1) // nw
    spreadBlackOn(row + 1, col + 1) // se
}

function spreadBlackOn(row, col) {

    const index = row * DIM + col

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > DIM -1) { return }
    if (col > DIM -1) { return }
    
    NEIGHBORS[index] += 1
}

///////////////////////////////////////////////////////////
    
main()

