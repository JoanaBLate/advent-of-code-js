"use strict"

// solving the puzzle takes (my computer) 0.032s

const DATA = [ ]


function main() {

    processInput()
    
    let a = 0
    let b = 0
    let c = 0
    
    for (let indexA = 0; indexA < DATA.length; indexA++) {
    
        for (let indexB = indexA + 1; indexB < DATA.length; indexB++) { 
    
            for (let indexC = indexB + 1; indexC < DATA.length; indexC++) { 
        
                a = DATA[indexA]
                b = DATA[indexB]
                c = DATA[indexC]
                
                if (a + b + c == 2020) { break }
            }
            if (a + b + c == 2020) { break }
        }
        if (a + b + c == 2020) { break }
    }
     
    console.log("the answer is", a * b * c)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

main()

