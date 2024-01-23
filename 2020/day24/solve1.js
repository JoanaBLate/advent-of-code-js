"use strict"

// solving the puzzle takes (my computer) 0.31s

// *WARNING*: MAYBE YOU NEED TO USE A GREATER DIMENSION FOR YOUR INPUT!


const input = Deno.readTextFileSync("input.txt").trim()

const PATHS = [ ]

const DIM = 50 + 1

const BOARD = new Uint8Array(DIM * DIM)

const baseRow = Math.floor(DIM / 2)

const baseCol = Math.floor(DIM / 2)

const WHITE = 0

const BLACK = 1


function main() {

    processInput()
    
    for (const path of PATHS) { walk(path) }
    
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
    
    BOARD[index] = (BOARD[index] == WHITE) ? BLACK : WHITE
}

function countBlackTiles() {

    let count = 0
    
    const off = BOARD.length
    
    for (let n = 0; n < off; n++) { count += BOARD[n] }
    
    return count
}

main()

