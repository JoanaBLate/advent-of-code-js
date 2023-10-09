"use strict"

// solving the puzzle takes (my computer) 0.030s

// theory of this program:
// the hexagonal grid is like a rectangular grid excepting that
// the odd columns are displaced half cell to the bottom

var x = 0
var y = 0

const walkedCells = [ ]

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const path = rawText.split(",")
    
    while (path.length > 0) {
    
        const step = path.shift()
                
        if (x % 2 == 0) { moveFromEvenColumn(step) } else { moveFromOddColumn(step) } 
        
        walkedCells.push(newPoint(x, y))       
    }
 
    let furthest = 0
    
    for (const cell of walkedCells) {
    
        const numberOfSteps = getNumberOfSteps(cell)
        
        if (numberOfSteps > furthest) { furthest = numberOfSteps }
    }
    
    console.log("number of stepst to furthest cell is", furthest)
}
        
function getNumberOfSteps(cell) {

    const targetX = cell.x
    const targetY = cell.y
    
    x = 0
    y = 0
    
    let numberOfSteps = -1
    
    while (true) {

        numberOfSteps += 1
            
        if (x == targetX  &&  y == targetY) { break }
        
        let step = ""
        
        if (y < targetY) { step = "s" } else { step = "n" }

        if (x < targetX) { 
            
            step += "e" 
        } 
        else if (x > targetX) { 
            
            step +="w" 
        }
        
        if (x % 2 == 0) { moveFromEvenColumn(step) } else { moveFromOddColumn(step) }
    }
    
    return numberOfSteps
}
    
///////////////////////////////////////////////////////////

function moveFromEvenColumn(step) {

    if (step == "n")  { y -= 1; return }
    if (step == "s")  { y += 1; return }
    
    if (step == "nw")  { x -= 1; y -= 1; return }
    if (step == "ne")  { x += 1; y -= 1; return }
    
    if (step == "sw")  { x -= 1; return }
    if (step == "se")  { x += 1; return }
}
    
function moveFromOddColumn(step) {

    if (step == "n")  { y -= 1; return }
    if (step == "s")  { y += 1; return }
    
    if (step == "nw")  { x -= 1; return }
    if (step == "ne")  { x += 1; return }
    
    if (step == "sw")  { x -= 1; y += 1; return }
    if (step == "se")  { x += 1; y += 1; return }
}

function newPoint(x, y) {

    return { "x": x, "y": y }
}

main()

