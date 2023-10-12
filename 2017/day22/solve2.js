"use strict"

// solving the puzzle takes (my computer) 1.950s

const infecteds = { } // { row~col: infected, flagged, weakened } // clean is undefined

var row = 0
var col = 0
var direction = "north"

function main() {
     
    processInput()
            
    let newInfections = 0
    
    for (let n = 0; n < 10000000; n++) { 
    
        const rowcol = row + "~" + col

        const status = infecteds[rowcol]
        
        setDirection(status)
        
        if (status  == undefined) { 
                 
            infecteds[rowcol] = "weakened"
        }
        else if (status  == "weakened") { 
                 
            infecteds[rowcol] = "infected"; newInfections += 1
        }
        else if (status  == "infected") { 
                 
            infecteds[rowcol] = "flagged"
        }
        else if (status  == "flagged") { 
    
            delete infecteds[rowcol] 
        }
        
        moveCarrier()    
    }

    console.log("number of nodes that became infected is", newInfections)
}

function processInput() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    const numberOfRows = rawLines.length
    const numberOfCols = rawLines[0].length
    
    const startingRow = - Math.floor(numberOfRows / 2)
    const startingCol = - Math.floor(numberOfCols / 2)
    
    let row = startingRow - 1
    
    while (rawLines.length > 0) {
    
        row += 1    
        const line = rawLines.shift().trim()
    
        let col = startingCol - 1
    
        for (const c of line) {
        
            col += 1
            if (c == "#") { infecteds[row + "~" + col] = "infected" }
        }
    }
}

function setDirection(status) {

    direction = directionByStatus(status)
}

function directionByStatus(status) {

    if (status == undefined)  { return directionAfterTurnLeft() } // clean

    if (status == "infected") { return directionAfterTurnRight() }

    if (status == "flagged")  { return reversedDirection() }

    if (status == "weakened") { return direction }
}

function reversedDirection() {

    if (direction == "north") { return "south" }
    if (direction == "south") { return "north" }
    
    if (direction == "west") { return "east" }
    if (direction == "east") { return "west" }
}

function directionAfterTurnLeft() {

    if (direction == "north") { return "west" }
    if (direction == "south") { return "east" }
    
    if (direction == "west") { return "south" }
    if (direction == "east") { return "north" }
}

function directionAfterTurnRight() {

    if (direction == "north") { return "east" }
    if (direction == "south") { return "west" }
    
    if (direction == "west") { return "north" }
    if (direction == "east") { return "south" }
}

function moveCarrier() {

    if (direction == "north") { row -= 1; return }
    if (direction == "south") { row += 1; return }
    if (direction == "west")  { col -= 1; return }
    if (direction == "east")  { col += 1; return }
}

main()

