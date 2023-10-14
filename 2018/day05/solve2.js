"use strict"

// solving the puzzle takes (my computer) 0.120s

const alphabet = "abcdefghijklmnopqrstuvwxyz"

var source = ""

var bestLength = 999999999


function main() {

    processInput()
     
    for (const letter of alphabet) { processWithout(letter) }     
     
    console.log("the answer is", bestLength)
}

function processInput() {

    source = Deno.readTextFileSync("input.txt").trim()
}

function processWithout(lower) {

    const upper = lower.toUpperCase()
    
    const data = [ ]

    for (const c of source) { 

        if (c == lower || c == upper) { continue }
        
        const last = data[data.length - 1]
        
        if (last == undefined) { data.push(c); continue }

        if (last == c) { data.push(c); continue } 
        
        if (last.toLowerCase() != c.toLowerCase()) { data.push(c); continue }
        
        data.pop()
    }
    
    if (data.length < bestLength) { bestLength = data.length }
}

main()

