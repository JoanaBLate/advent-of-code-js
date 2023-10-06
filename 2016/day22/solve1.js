"use strict"

// solving the puzzle takes (my computer) 0.030s

const allNodes = [ ]

var numberOfRows = 0
var numberOfCols = 0

var numberOfPairs = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    rawLines.shift() // root..
    rawLines.shift() // Filesystem...
    
    for (let rawLine of rawLines) { 
    
        const line = rawLine.trim().replace("/dev/grid/node-", "")
        
        const tokens = line.trim().split(" ")
    
        const id = tokens.shift()
    
        while (tokens[0] == "") { tokens.shift() }
    
        const size = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
    
        const used = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
    
        const avail = parseInt(tokens.shift())
        
        allNodes.push({ id, used, size, avail })
        
        if (id.startsWith("x0-")) { numberOfRows += 1 }

        if (id.endsWith("-y0"))   { numberOfCols += 1 }
    }
    
    search()

    console.log("number of viable pairs is", numberOfPairs)
}

function search() {

    for (const node of allNodes) { searchThis(node) }
}
   
function searchThis(baseNode) {

    if (baseNode.used == 0) { return }

    for (const node of allNodes) { 

        if (node == baseNode) { continue }
        
        if (node.avail < baseNode.used) { continue }
        
        numberOfPairs += 1
    }
}

main()

