"use strict"

// solving the puzzle takes (my computer) 0.200s

var wireA = [ ]

var wireB = [ ]

const path = { }

var closest = 9999999999


function main() {

    processInput()
     
    walkWire(wireA, true)
    walkWire(wireB, false)
    
    console.log("the answer is", closest)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    wireA = lines.shift().trim().split(",")
    wireB = lines.shift().trim().split(",")
}

function walkWire(wire, isFirstWalk) {

    let row = 0
    let col = 0
    let step = 0
        
    while (wire.length > 0) {
    
        const instruction = wire.shift()
        
        const direction = instruction[0]
        
        const length = parseInt(instruction.substr(1))
    
        let deltaRow = 0
        let deltaCol = 0
        
        if (direction == "U") { deltaRow -= 1 }
        if (direction == "D") { deltaRow += 1 }
        if (direction == "L") { deltaCol -= 1 }
        if (direction == "R") { deltaCol += 1 }
    
        for (let n = 0; n < length; n++) {
        
            row += deltaRow
            col += deltaCol
            step += 1
            
            const id = row + "~" + col
        
            if (isFirstWalk) { 
            
                if (path[id] == undefined) { path[id] = step }
            }
            else {
            
                const stepA = path[id]

                if (stepA != undefined) {
            
                    const steps = stepA + step
                
                    if (steps < closest) { closest = steps }            
                }
            }
        }
    }
}

main()

