"use strict"

// solving the puzzle takes (my computer) 0.042s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0
var HEIGHT = 0

const BASINMAP = [ ]

const BASINS = { }

var RECORD = 0


function main() {

    processInput()
        
    for (let n = 0; n < 9; n++) { findBasins(n) }
    
    const sizes = Object.values(BASINS)
    
    sizes.sort(function (a, b) { return b - a })

    console.log("the answer is", sizes[0] * sizes[1] * sizes[2])
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }

    HEIGHT = MAP.length
    WIDTH = MAP[0].length
    
    for (let n = 0; n < HEIGHT; n++) { BASINMAP.push(new Uint8Array(WIDTH)) }
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function findBasins(height) {

    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            findBasinFor(row, col, height)
        }
    }
}

function findBasinFor(row, col, height) {
             
    if (MAP[row][col] != height) { return }

    if (BASINMAP[row][col] != 0) { return }
    
    if (neighborIsLower(row - 1, col, height)) { return }
    if (neighborIsLower(row + 1, col, height)) { return }
    if (neighborIsLower(row, col - 1, height)) { return }
    if (neighborIsLower(row, col + 1, height)) { return }
    
    RECORD += 1
    
    BASINS[RECORD] = 1

    BASINMAP[row][col] = RECORD
    
    expandBasin(row, col)
}
    
function neighborIsLower(row, col, height) {

    if (row < 0) { return false }
    if (col < 0) { return false }
    if (row > HEIGHT - 1) { return false }
    if (col > WIDTH  - 1) { return false }
    
    return MAP[row][col] < height
}

///////////////////////////////////////////////////////////
   
function expandBasin(row, col) {

    let futures = [ createPoint(row, col) ]
    
    while (true) {
    
        if (futures.length == 0) { return }
    
        const currents = futures
        
        futures = [ ]
        
        for (const current of currents) {
        
            const row = current.row
            const col = current.col
        
            tryExpand(row - 1, col, futures)
            tryExpand(row + 1, col, futures)
            tryExpand(row, col - 1, futures)
            tryExpand(row, col + 1, futures)
        }    
    }
}

function tryExpand(row, col, futures) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }

    if (MAP[row][col] == 9) { return }

    if (BASINMAP[row][col] != 0) { return }

    BASINMAP[row][col] = RECORD

    BASINS[RECORD] += 1
    
    futures.push(createPoint(row, col))    
}

main()

