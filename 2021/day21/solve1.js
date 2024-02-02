"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

var positionA = 0
var positionB = 0

var scoreA = 0
var scoreB = 0

var rolls = 0


function main() {

    processInput()
        
    let answer = 0
    
    while (true) {
    
        play()    
        
        if (scoreA >= 1000) { answer = rolls * scoreB; break }
        if (scoreB >= 1000) { answer = rolls * scoreA; break }    
    }
    console.log("the answer is", answer)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    positionA = parseInt(lines.shift().trim().split(" ").at(-1))
    positionB = parseInt(lines.shift().trim().split(" ").at(-1))
}

///////////////////////////////////////////////////////////

function play() {
    
    positionA = ((positionA + tripleRoll()) % 10)  ||  10

    scoreA += positionA
    
    if (scoreA >= 1000) { return }
    
    positionB = ((positionB + tripleRoll()) % 10)  ||  10

    scoreB += positionB
}

function tripleRoll() {
    
    let result = rolls + 1 + rolls + 2 + rolls + 3

    rolls += 3
    
    return result
}

main()

