"use strict"

// solving the puzzle takes (my computer) 0.050s

var lowerLimit = 0 
var upperLimit = 0

var passwords = 0


function main() {

    processInput()
    
    for (let n = lowerLimit; n <= upperLimit; n += 1) {
    
        const number = n.toString()
        
        let foundPair = false
        let decreasing = false 
        
        for (let index = 1; index < 6; index++) {
            
            const current = number[index]
            const previous = number[index - 1]
            
            if (current < previous) { decreasing = true; break }
            
            if (current == previous) { foundPair = true }
        }
        
        if (foundPair  &&  ! decreasing) { passwords += 1 }    
    }
     
    console.log("the answer is", passwords)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split("-")
    
    lowerLimit = parseInt(tokens.shift())
    upperLimit = parseInt(tokens.shift())
}

main()

