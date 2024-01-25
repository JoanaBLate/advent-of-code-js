"use strict"

// solving the puzzle takes (my computer) 0.027s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const POINTS = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
}


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) { sum += findErrorScore(data) }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function findErrorScore(data) {

    let missing = [ ]
    
    for (const c of data) { 

        if (c == "(") { missing.push(")"); continue }
        if (c == "[") { missing.push("]"); continue }
        if (c == "{") { missing.push("}"); continue }
        if (c == "<") { missing.push(">"); continue }
        
        if (c != missing.pop()) { return POINTS[c] }
    }
    
    return 0
}

main()

