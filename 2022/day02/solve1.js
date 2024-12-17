"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const SCORES = {

    "A X": 1+3,
    "A Y": 2+6,
    "A Z": 3+0,
    
    "B X": 1+0,
    "B Y": 2+3,
    "B Z": 3+6,
    
    "C X": 1+6,
    "C Y": 2+0,
    "C Z": 3+3
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

