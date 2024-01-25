"use strict"

// solving the puzzle takes (my computer) 0.029s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const POINTS = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4
}


function main() {

    processInput()
    
    let scores = [ ]
    
    for (const data of DATA) { 
    
        const score = findMissingScore(data)

        if (score != 0) { scores.push(score) }
    }
    
    scores.sort(function (a, b) { return a - b })
    
    while (scores.length > 2) { scores.shift(); scores.pop() }
    
    console.log("the answer is", scores[0])
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function findMissingScore(data) {

    let missing = [ ]
    
    for (const c of data) { 

        if (c == "(") { missing.unshift(")"); continue }
        if (c == "[") { missing.unshift("]"); continue }
        if (c == "{") { missing.unshift("}"); continue }
        if (c == "<") { missing.unshift(">"); continue }
        
        if (c != missing.shift()) { return 0 } // error
    }
    
    let score = 0
    
    for (const c of missing) { score = score * 5 + POINTS[c] }
        
    return score
}

main()

