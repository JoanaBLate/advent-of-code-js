"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ] 


function main() {

    processInput()
    
    DATA.sort(function (a, b) { return b - a }) 
    
    console.log("the answer is", DATA[0] + DATA[1] + DATA[2])
}

function processInput() {
        
    const groups = input.split("\n\n")
    
    for (const group of groups) {
    
        let sum = 0

        const lines = group.split("\n")
                
        for (const line of lines) { sum += parseInt(line) }
        
        DATA.push(sum)
    }
}

main()

