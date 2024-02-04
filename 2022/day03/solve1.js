"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

const DATA = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) { sum += findPriority(data) }
    
    console.log("the answer is", sum)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function findPriority(data) {

    const half = data.length /2
    
    const segmentA = data.substr(0, half)
    const segmentB = data.substr(half)
    
    for (const c of segmentA) {
    
        if (segmentB.includes(c)) { return letters.indexOf(c) + 1 }
    }
}

main()

