"use strict"

// solving the puzzle takes (my computer) 0.030s

var doubles = 0

var triples = 0


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    for (const line of input.split("\n")) { 
    
        processId(line.trim())         
    }
     
    console.log("the answer is", doubles * triples)
}

function processId(id) {

    const letters = { }
    
    for (const c of id) {
    
        if (letters[c] == undefined) { letters[c] = 1; continue }
        
        letters[c] += 1
    }
    
    let gotDouble = false
    let gotTriple = false
    
    for (const value of Object.values(letters)) {
    
        if (value == 2) { gotDouble = true }
        if (value == 3) { gotTriple = true }
    }
        
    if (gotDouble) { doubles += 1 }
    if (gotTriple) { triples += 1 }
}

main()

