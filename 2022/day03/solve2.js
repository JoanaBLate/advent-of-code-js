"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

const DATA = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    while(DATA.length != 0) { sum += findPriority(DATA.shift(), DATA.shift(), DATA.shift()) }
    
    console.log("the answer is", sum)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function findPriority(dataA, dataB, dataC) {

    for (const c of letters) {
    
        if (! dataA.includes(c)) { continue }
        if (! dataB.includes(c)) { continue }
        if (! dataC.includes(c)) { continue }
    
        return letters.indexOf(c) + 1
    }
}

main()

