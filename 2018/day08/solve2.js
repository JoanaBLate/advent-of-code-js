"use strict"

// solving the puzzle takes (my computer) 0.050s

const DATA = [ ]


function main() {

    processInput()
    
    const root = createNode()
     
    console.log("the answer is", root.value)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(" ")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}
        
function createNode() { // recursive function

    const node = { "children": [ ], "data_entries": [ ], "value": 0 }
    
    const childrenCount = DATA.shift()

    const metadataLength = DATA.shift()
    
    for (let n = 0; n < childrenCount; n++) { node.children.push(createNode()) }

    for (let n = 0; n < metadataLength; n++) { node.data_entries.push(DATA.shift()) }
    
    if (childrenCount == 0) {
    
        for (const item of node.data_entries) { node.value += item }
    }
    else {
        
        for (const baseOneIndex of node.data_entries) { // baseOneIndex!!!
        
            const index = baseOneIndex - 1
            
            if (index >= childrenCount) { continue }
            
            const child = node.children[index] 
            
            node.value += child.value
        }
    }
    return node
}

main()

