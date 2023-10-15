"use strict"

// solving the puzzle takes (my computer) 0.050s

const DATA = [ ]

var SUM = 0

function main() {

    processInput()
    
    const root = createNode()
     
    console.log("the answer is", SUM)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(" ")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}
        
function createNode() { // recursive function
        
    const node = { "children": [ ], "value": 0 }
    
    const childrenCount = DATA.shift()

    const metadataLength = DATA.shift()
    
    for (let n = 0; n < childrenCount; n++) { node.children.push(createNode()) }

    for (let n = 0; n < metadataLength; n++) { node.value += DATA.shift() }

    SUM += node.value
    
    return node
}

main()

