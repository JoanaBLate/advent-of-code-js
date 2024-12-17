
"use strict"

// solving the puzzle takes (my computer) 0.025s


const buses = [ ]

    
function main() {

    processInput()
             
    console.log("the answer is", search())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    const tokens = lines.pop().trim().split(",")
        
    for (const token of tokens) { 
            
        const bus = (token == "x") ? 1 : parseInt(token)

        buses.push(bus)
    }
}

///////////////////////////////////////////////////////////////////////////////

// this algorithm was copied from:
// https://github.com/alvin-the-programmer/advent-of-code-2020/blob/main/walkthrough/d13/part2.js

function search() {

    let time = 0
    let stepSize = buses[0]

    for (let index = 1; index < buses.length; index++) {
        
        const bus = buses[index]

        while ((time + index) % bus !== 0) { time += stepSize }

        stepSize *= bus // need not to be LCM because all buses are prime numbers
    }
    
    return time
}

main()
