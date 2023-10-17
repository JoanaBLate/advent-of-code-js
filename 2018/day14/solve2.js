"use strict"

// solving the puzzle takes (my computer) 0.800s

const scores = [ 3, 7 ]

var indexA = 0

var indexB = 1

var targetSequence = [ ]


function main() {

    processInput()
    
    let delta = 0
    
    while (true) { 
    
        const gotTwoRecipes = runOneRound() 
        
        if (gotTwoRecipes) {
            
            delta = 1 
            if (foundTarget(delta)) { break }
        }
        
        delta = 0        
        if (foundTarget(delta)) { break }
    }
 
    console.log("the answer is", scores.length - targetSequence.length - delta)
}

function processInput() {

    const text = Deno.readTextFileSync("input.txt").trim()

    targetSequence = text.split("")
}


function runOneRound() {

    const a = scores[indexA]
    const b = scores[indexB]
    
    const result = a + b
    
    let gotTwoRecipes = false
    
    if (result < 10) {
        scores.push(result)
    }
    else {
        scores.push(1)
        scores.push(result - 10)

        gotTwoRecipes = true
    }
    
    indexA = advanceIndex(indexA)
    indexB = advanceIndex(indexB)
    
    return gotTwoRecipes
}

function advanceIndex(currentIndex) {

    const advance = 1 + scores[currentIndex]
    
    let index = currentIndex + advance
    
    while (index >= scores.length) { index -= scores.length } // must be 'while', not 'if'
    
    return index
}

function foundTarget(delta) {

    let scoresIndex = scores.length - 1 - delta
    let targetIndex = targetSequence.length - 1
    
    while (targetIndex > -1) {
    
        if (targetSequence[targetIndex] != scores[scoresIndex]) { return false }
    
        targetIndex -= 1
        scoresIndex -= 1
    }    

    return true
}

main()

