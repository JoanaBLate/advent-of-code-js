"use strict"

// solving the puzzle takes (my computer) 0.030s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0
var HEIGHT = 0


function main() {

    processInput()

    console.log("the answer is", getRiskLevel())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }

    HEIGHT = MAP.length
    WIDTH = MAP[0].length
}

///////////////////////////////////////////////////////////

function getRiskLevel() {

    let sum = 0
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            sum += getRiskLevelFor(row, col)
        }
    }
    
    return sum
}

function getRiskLevelFor(row, col) {

    const height = parseInt(MAP[row][col])
    
    if (height == 9) { return 0 }
    
    if (neighborIsLower(row - 1, col, height)) { return 0 }
    if (neighborIsLower(row + 1, col, height)) { return 0 }
    if (neighborIsLower(row, col - 1, height)) { return 0 }
    if (neighborIsLower(row, col + 1, height)) { return 0 }
    
    return height + 1
}
    
function neighborIsLower(row, col, height) {

    if (row < 0) { return false }
    if (col < 0) { return false }
    if (row > HEIGHT - 1) { return false }
    if (col > WIDTH  - 1) { return false }
    
    return MAP[row][col] < height
}

main()

