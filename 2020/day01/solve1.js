"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    let a = 0
    let b = 0
    
    for (let indexA = 0; indexA < DATA.length; indexA++) {
    
        for (let indexB = indexA + 1; indexB < DATA.length; indexB++) { 
        
            a = DATA[indexA]
            b = DATA[indexB]
            
            if (a + b == 2020) { break }
        }
        if (a + b == 2020) { break }
    }
     
    console.log("the answer is", a * b)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

main()

