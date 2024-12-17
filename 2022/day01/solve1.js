"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

var BEST = 0


function main() {

    processInput()
    
    console.log("the answer is", BEST)
}

function processInput() {
        
    const groups = input.split("\n\n")
    
    for (const group of groups) {
    
        let sum = 0

        const lines = group.split("\n")
                
        for (const line of lines) { sum += parseInt(line) }
        
        if (sum > BEST) { BEST = sum }
    }
}

main()

