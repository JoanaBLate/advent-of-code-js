"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const SCORES = {

    "A X": 0+3, // lose with scissors
    "A Y": 3+1, // draw with rock
    "A Z": 6+2, // win with paper
    
    "B X": 0+1, // lose with rock
    "B Y": 3+2, // draw with paper
    "B Z": 6+3, // win with scissors
    
    "C X": 0+2, // lose with paper
    "C Y": 3+3, // draw with scissors
    "C Z": 6+1, // win with rock
}


function main() {

    processInput()
    
    let score = 0
    
    for (const data of DATA) { score += SCORES[data] }
    
    console.log("the answer is", score)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.substr(0, 3)) }
}

main()

