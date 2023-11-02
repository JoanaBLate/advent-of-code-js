"use strict"

// solving the puzzle takes (my computer) 0.030s

const masses = [ ]


function main() {

    processInput()
    
    let totalFuel = 0
    
    for (const mass of masses) {
    
        const fuel = Math.floor(mass / 3) - 2
        
        totalFuel += fuel
    }
     
    console.log("the answer is", totalFuel)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        masses.push(parseInt(line.trim()))
    }
}


main()

