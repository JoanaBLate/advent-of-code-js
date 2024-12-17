"use strict"

// solving the puzzle takes (my computer) 0.103s

/* 
    27 possible rolls:

    [ 1, 1, 1 ]
    [ 1, 1, 2 ]
    [ 1, 1, 3 ]
    [ 1, 2, 1 ]
    [ 1, 2, 2 ]
    [ 1, 2, 3 ]
    [ 1, 3, 1 ]
    [ 1, 3, 2 ]
    [ 1, 3, 3 ]
    [ 2, 1, 1 ]
    [ 2, 1, 2 ]
    [ 2, 1, 3 ]
    [ 2, 2, 1 ]
    [ 2, 2, 2 ]
    [ 2, 2, 3 ]
    [ 2, 3, 1 ]
    [ 2, 3, 2 ]
    [ 2, 3, 3 ]
    [ 3, 1, 1 ]
    [ 3, 1, 2 ]
    [ 3, 1, 3 ]
    [ 3, 2, 1 ]
    [ 3, 2, 2 ]
    [ 3, 2, 3 ]
    [ 3, 3, 1 ]
    [ 3, 3, 2 ]
    [ 3, 3, 3 ]

    results of 27 the possible rolls:
    
    [ 3, 4, 5, 4, 5, 6, 5, 6, 7, 4, 5, 6, 5, 6, 7, 6, 7, 8, 5, 6, 7, 6, 7, 8, 7, 8, 9 ]
 
*/


const input = Deno.readTextFileSync("input.txt").trim()

                        
const condensedRolls = [ 3, 4, 5, 6, 7, 8, 9 ]

const condensedFactors = {

    "3": 1,
    "4": 3,
    "5": 6,
    "6": 7,
    "7": 6,
    "8": 3,
    "9": 1
}

var positionA = 0
var positionB = 0

var winsA = 0
var winsB = 0

var STATES = { }


function main() {

    processInput()
    
    const key = String.fromCharCode(positionA) + String.fromCharCode(0) +
                String.fromCharCode(positionB) + String.fromCharCode(0)
                
    STATES[key] = 1
    
    let turnForA = false
    
    while (true) {
        
        turnForA = ! turnForA
        
        const keys = Object.keys(STATES)
        
        //console.log(STATES)
    
        if (keys.length == 0) { break }
    
        STATES = playAllGames(keys, turnForA)    
    }
        
    console.log("the answer is", Math.max(winsA, winsB))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    positionA = parseInt(lines.shift().trim().split(" ").at(-1))
    positionB = parseInt(lines.shift().trim().split(" ").at(-1))
}

///////////////////////////////////////////////////////////

function playAllGames(keys, turnForA) {

    const newStates = { }

    for (const key of keys) {
    
        const count = STATES[key]

        const posA = key.charCodeAt(0)
        
        const scoreA = key.charCodeAt(1)
        
        const posB = key.charCodeAt(2)
        
        const scoreB = key.charCodeAt(3)
        
        //
        
        for (const roll of condensedRolls) {
        
            const factor = condensedFactors[roll]
            
            const amount = factor * count
        
            if (turnForA) {
            
                const newPosA = ((posA + roll) % 10) || 10

                const newScoreA = scoreA + newPosA
                
                if (newScoreA >= 21) { winsA += amount; continue }
            
                const newKey = String.fromCharCode(newPosA) + String.fromCharCode(newScoreA) +
                               String.fromCharCode(posB) + String.fromCharCode(scoreB)
                
                if (newStates[newKey] == undefined) { newStates[newKey] = 0 }
                
                newStates[newKey] += amount
            }
            else {
            
                const newPosB = ((posB + roll) % 10) || 10

                const newScoreB = scoreB + newPosB
                
                if (newScoreB >= 21) { winsB += amount; continue }
            
                const newKey = String.fromCharCode(posA) + String.fromCharCode(scoreA) +
                               String.fromCharCode(newPosB) + String.fromCharCode(newScoreB)
                
                if (newStates[newKey] == undefined) { newStates[newKey] = 0 }
                
                newStates[newKey] += amount
            }
        }
    }
    return newStates
}

///////////////////////////////////////////////////////////

main()

