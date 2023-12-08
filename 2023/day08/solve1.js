"use strict"

// solving the puzzle takes (my computer) 0.028s

var DIRECTIONS = [ ]

const NODES = { }


function main() {

    processInput()
    
    let pointer = -1
    
    let nodeId = "AAA"
    
    let steps = 0
    
    while (true) {
        
        pointer += 1
    
        let direction = DIRECTIONS[pointer]

        if (direction == undefined) { direction = DIRECTIONS[0]; pointer = 0 }
        
        const node = NODES[nodeId]

        nodeId = (direction == "L") ? node.left : node.right

        steps += 1
        
        if (nodeId == "ZZZ") { break }    
    }    
     
    console.log("the answer is", steps)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const parts = input.split("\n\n")
    
    DIRECTIONS = parts.shift().trim()
        
    const lines = parts.shift().trim().split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const id = tokens.shift()
        
        tokens.shift() // =
        
        const left = tokens.shift().substr(1, 3)

        const right = tokens.shift().substr(0, 3)
        
        NODES[id] = { "left": left, "right": right }
    }
}


main()

