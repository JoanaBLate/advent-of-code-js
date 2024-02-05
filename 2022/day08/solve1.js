"use strict"

// solving the puzzle takes (my computer) 0.033s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0

var HEIGHT = 0


function main() {

    processInput()
    
    let count = 0
    
    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
    
            if (isVisible(row, col)) { count += 1 }
        }
    }
    
    console.log("the answer is", count)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    WIDTH = MAP[0].length
}

///////////////////////////////////////////////////////////

function isVisible(row, col) {

    const height = MAP[row][col]

    if (isVisibleThis(height, row, col, -1, 0)) { return true } // going north
    if (isVisibleThis(height, row, col, +1, 0)) { return true } // going south
    if (isVisibleThis(height, row, col, 0, -1)) { return true } // going west
    if (isVisibleThis(height, row, col, 0, +1)) { return true } // going east

    return false
}

function isVisibleThis(height, row, col, deltaRow, deltaCol) {

    while (true) {
    
        row += deltaRow
        col += deltaCol
        
        if (row < 0) { break }
        if (col < 0) { break }
        if (row > HEIGHT - 1) { break }
        if (col > WIDTH  - 1) { break }
        
        if (MAP[row][col] >= height) { return false }    
    }
    return true
}

main()

