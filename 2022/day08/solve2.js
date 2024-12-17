"use strict"

// solving the puzzle takes (my computer) 0.035s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0

var HEIGHT = 0


function main() {

    processInput()
    
    let best = 0
    
    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
    
            const score = findScore(row, col) 
            
            if (score > best) { best = score }
        }
    }
    
    console.log("the answer is", best)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    WIDTH = MAP[0].length
}

///////////////////////////////////////////////////////////

function findScore(row, col) {

    const height = MAP[row][col]
    
    let score = 1

    score *= findScoreThis(height, row, col, -1, 0) // going north
    score *= findScoreThis(height, row, col, +1, 0) // going south
    score *= findScoreThis(height, row, col, 0, -1) // going west
    score *= findScoreThis(height, row, col, 0, +1) // going east

    return score
}

function findScoreThis(height, row, col, deltaRow, deltaCol) {

    let score = 0
    
    while (true) {
    
        row += deltaRow
        col += deltaCol
        
        if (row < 0) { break }
        if (col < 0) { break }
        if (row > HEIGHT - 1) { break }
        if (col > WIDTH  - 1) { break }
        
        score += 1
        
        if (MAP[row][col] >= height) { break }    
    }
    return score
}

main()

