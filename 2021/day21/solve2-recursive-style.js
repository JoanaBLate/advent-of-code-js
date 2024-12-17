"use strict"

// solving the puzzle takes (my computer) 0.110s

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

const memory = { }


function main() {

    processInput()
    
    const wins = countWins(0, positionA, 0, positionB, 0)
    
    console.log("the answer is", Math.max(wins[0], wins[1]))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    positionA = parseInt(lines.shift().trim().split(" ").at(-1))
    positionB = parseInt(lines.shift().trim().split(" ").at(-1))
}

///////////////////////////////////////////////////////////

function countWins(player, posA, scoreA, posB, scoreB) {

    const key = player + String.fromCharCode(posA) + String.fromCharCode(scoreA) +
                         String.fromCharCode(posB) + String.fromCharCode(scoreB)
    
    let result = memory[key]
    
    if (result != undefined) { return result }
    
    result = countWinsCore(player, posA, scoreA, posB, scoreB)
    
    memory[key] = result
    
    return result
}

function countWinsCore(player, posA, scoreA, posB, scoreB) { // max recursion level is 21
    
    if (scoreA >= 21) { return [ 1, 0 ] }
    
    if (scoreB >= 21) { return [ 0, 1 ] }

    let winsA = 0
    let winsB = 0
    
    for (const roll of condensedRolls) {
    
        const factor = condensedFactors[roll]
    
        if (player == 0) {
        
            const newPosA = ((posA + roll) % 10) || 10

            const newScoreA = scoreA + newPosA
            
            const list = countWins(1, newPosA, newScoreA, posB, scoreB)
            
            winsA += list[0] * factor
            winsB += list[1] * factor
        }
        else {
                
            const newPosB = ((posB + roll) % 10) || 10

            const newScoreB = scoreB + newPosB
            
            const list = countWins(0, posA, scoreA, newPosB, newScoreB)
            
            winsA += list[0] * factor
            winsB += list[1] * factor
        }
    }
    return [ winsA, winsB ]
}

///////////////////////////////////////////////////////////

main()

