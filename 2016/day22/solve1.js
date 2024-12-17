"use strict"

// solving the puzzle takes (my computer) 0.030s

const allCells = [ ]

var numberOfRows = 0
var numberOfCols = 0

var numberOfPairs = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    rawLines.shift() // root..
    rawLines.shift() // Filesystem...
    
    for (const rawLine of rawLines) { 
    
        const line = rawLine.trim().replace("/dev/grid/node-", "")
        
        const tokens = line.trim().split(" ")
    
        const id = tokens.shift()
    
        while (tokens[0] == "") { tokens.shift() }
    
        const size = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
    
        const used = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
    
        const avail = parseInt(tokens.shift())
        
        allCells.push({ id, used, size, avail })
        
        if (id.startsWith("x0-")) { numberOfRows += 1 }

        if (id.endsWith("-y0"))   { numberOfCols += 1 }
    }
    
    search()

    console.log("number of viable pairs is", numberOfPairs)
}

function search() {

    for (const cell of allCells) { searchThis(cell) }
}
   
function searchThis(baseCell) {

    if (baseCell.used == 0) { return }

    for (const cell of allCells) { 

        if (cell == baseCell) { continue }
        
        if (cell.avail < baseCell.used) { continue }
        
        numberOfPairs += 1
    }
}

main()

