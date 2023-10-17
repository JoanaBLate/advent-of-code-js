"use strict"

// solving the puzzle takes (my computer) 0.030s

const scores = [ 3, 7 ]

var indexA = 0

var indexB = 1

var edge = 0


function main() {

    processInput()
    
    const count = edge + 10
    
    while (scores.length < count) { runOneRound() }
 
    let result = [ ]
    
    for (let index = 0; index < 10; index++) { result.push(scores[edge + index]) }
     
    console.log("the answer is", result.join(""))
}

function processInput() {

    const text = Deno.readTextFileSync("input.txt").trim()
        
    edge = parseInt(text)
}


function runOneRound() {

    const a = scores[indexA]
    const b = scores[indexB]
    
    const result = a + b
    
    if (result < 10) {
        scores.push(result)
    }
    else {
        scores.push(1)
        scores.push(result - 10)   
    }
    
    indexA = advanceIndex(indexA)
    indexB = advanceIndex(indexB)
}

function advanceIndex(currentIndex) {

    const advance = 1 + scores[currentIndex]
    
    let index = currentIndex + advance
    
    while (index >= scores.length) { index -= scores.length } // must be 'while', not 'if'
    
    return index
}

main()

