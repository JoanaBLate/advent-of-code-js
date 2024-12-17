"use strict"

// solving the puzzle takes (my computer) 0.030s

var diagram = [ ]

var row = 0
var col = -1

var direction = ""

var steps = 1 // includes home position

function main() {

    diagram = Deno.readTextFileSync("input.txt").split("\n")
    
    while (true) {
        col += 1
        if (diagram[row][col] != " ") { break }
    }
    
    // packet is on the start of the path now
    
    direction = "south"

    while (true) {

        if (direction == "north") { row -= 1 }
        if (direction == "south") { row += 1 }
        if (direction == "west")  { col -= 1 }
        if (direction == "east")  { col += 1 }
        
        const value = diagram[row][col]  
        
        if (value == " ") { break }
    
        steps += 1

        if (value == "|") { continue }
        if (value == "-") { continue }
        if (value == "+") { findNewDirection(); continue }
    }

    console.log("number of steps is", steps)
}

function findNewDirection() {

    if (direction == "north"  ||  direction == "south") { 
    
        tryDirection("west", row, col-1)
        tryDirection("east", row, col+1) 
    }
    else {
    
        tryDirection("north", row-1, col) 
        tryDirection("south", row+1, col)    
    }
}

function tryDirection(direc, row, col) {

    const value = diagram[row][col]

    if (value == " ") { return }
    
    direction = direc
}

main()

