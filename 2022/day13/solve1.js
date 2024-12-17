"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const PAIRS = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (let n = 0; n < PAIRS.length; n++) {
    
        const pair = PAIRS[n]
        
        const result = compare(pair.left, pair.right)
        
        if (result == +1) { sum += n + 1 }
    }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const groups = input.split("\n\n")
        
    for (const group of groups) {
        
        const lines = group.trim().split("\n")
        
        const left  = JSON.parse(lines.shift())
        const right = JSON.parse(lines.shift())
        
        PAIRS.push({ "left": left, "right": right })
    }
} 

/////////////////////////////////////////////////////////// 

function compare(a, b) {

    if (typeof(a) == "number"  &&  typeof(b) == "number") { 

        if (a < b) { return +1 }
        if (a > b) { return -1 }
        
        return 0
    }
    
    const arrayA = (typeof(a) == "number") ? [ a ] : a
    const arrayB = (typeof(b) == "number") ? [ b ] : b
    
    const lengthA = arrayA.length
    const lengthB = arrayB.length
    
    const length = Math.min(lengthA, lengthB)
    
    for (let n = 0; n < length; n++) {
    
        const result = compare(arrayA[n], arrayB[n])
        
        if (result == -1) { return result }
        if (result == +1) { return result }    
    }
    
    if (lengthA < lengthB) { return +1 }
    if (lengthA > lengthB) { return -1 }
   
    return 0
}

///////////////////////////////////////////////////////////

main()

