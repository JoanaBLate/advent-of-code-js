"use strict"

// solving the puzzle takes (my computer) 0.040s

var DATA = ""

const steps = [ ] // step objects

const endingSteps = [ ] // the step obj at the end of each segment 

const rooms = { } // row~col: distance


function main() {

    processInput()
    
    processData()
    
    fillRooms()
    
    console.log("the answer is", findGreatestDistance())
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()        
    
    DATA = input.substr(1).replace("$", "")
}

function processData() {

    let row = 0
    let col = 0
    let distance = 0

    while (DATA != "") {
    
        const char = DATA[0]
        DATA = DATA.substr(1)
    
        if (char == "")  { return }  // end of data
        
        if (char == "(") {  // start of the segment children
        
            endingSteps.push(newStep(row, col, distance)) // saving data for using later
            continue 
        }
        
        if (char == "|") { // end of a segment child
        
            const step = endingSteps.at(-1) // keeping data where it is
            
            row = step.row
            col = step.col
            distance = step.distance
            continue
        }
        
        if (char == ")") {  // end of the segment children
        
            const step = endingSteps.pop() // removing data
            
            row = step.row
            col = step.col
            distance = step.distance
            continue
        }
        
        if (char == "N") { row -= 1 }
        if (char == "S") { row += 1 }
        if (char == "W") { col -= 1 }
        if (char == "E") { col += 1 }
        
        distance += 1

        steps.push(newStep(row, col, distance))
    }
}
 
///////////////////////////////////////////////////////////

function fillRooms() {

    for (const step of steps) {
    
        const key = step.row + "~" + step.col
        
        if (rooms[key] == undefined) { rooms[key] = step.distance; continue }
        
        if (step.distance < rooms[key]) { rooms[key] = step.distance }
    }
}

function findGreatestDistance() {

    let best = 0
    
    for (const value of Object.values(rooms)) { if (value > best) { best = value } }
    
    return best
}

///////////////////////////////////////////////////////////
    
function newPoint(row, col) { 

    return { "row": row, "col": col } 
}

function newStep(row, col, distance) { 

    return { "row": row, "col": col, "distance": distance } 
}

main()

