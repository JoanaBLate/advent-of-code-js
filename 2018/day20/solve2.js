"use strict"

// solving the puzzle takes (my computer) 0.035s

var DATA = ""

const rooms = { } // row~col: distance

var distantRooms = { } // row~col: true

const endingSteps = [ ] // the step obj at the end of each segment 


function main() {

    processInput()
    
    processData()
    
    console.log("the answer is", Object.keys(distantRooms).length)
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

        const key = row + "~" + col
        
        if (rooms[key] == undefined) { 
            
            rooms[key] = distance
        }
        else if (rooms[key] > distance) { 
            
            rooms[key] = distance 
        }
        
        if (rooms[key] >= 1000) { distantRooms[key] = true }
    }
}

///////////////////////////////////////////////////////////

function newStep(row, col, distance) { 

    return { "row": row, "col": col, "distance": distance } 
}

main()

