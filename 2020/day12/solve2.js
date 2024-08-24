"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]

var shipRow = 0
var shipCol = 0

// wp means waypoint

var wpRow = -1
var wpCol = 10


function main() {

    processInput()
    
    for (const item of DATA) { executeInstruction(item) }
     
    console.log("the answer is", Math.abs(shipRow) + Math.abs(shipCol))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
      
    const lines = input.trim().split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function executeInstruction(inst) {

    if (inst == "L90")  { turnWpLeft(); return }
    if (inst == "L180") { turnWpLeft(); turnWpLeft(); return }
    if (inst == "L270") { turnWpLeft(); turnWpLeft(); turnWpLeft(); return }
    
    if (inst == "R90")  { turnWpRight(); return }
    if (inst == "R180") { turnWpRight(); turnWpRight(); return }
    if (inst == "R270") { turnWpRight(); turnWpRight(); turnWpRight(); return }
   
    if (inst[0] == "F") { advance(parseInt(inst.substr(1))); return }

    if (inst[0] == "N") { wpRow -= parseInt(inst.substr(1)); return }

    if (inst[0] == "S") { wpRow += parseInt(inst.substr(1)); return }

    if (inst[0] == "W") { wpCol -= parseInt(inst.substr(1)); return }

    if (inst[0] == "E") { wpCol += parseInt(inst.substr(1)); return }
}

function advance(amount) {

    shipRow += amount * wpRow
    shipCol += amount * wpCol
}

function turnWpLeft() {

    let newRow = 0
    let newCol = 0
    
    if (wpRow < 0) { // north
    
        newCol = wpRow // west  
    }
    else if (wpRow > 0) { // south
    
        newCol = wpRow // east
    }
    
    if (wpCol > 0) { // east
    
        newRow = - wpCol // north    
    }
    else if (wpCol < 0) { // west
    
        newRow = - wpCol // south
    }
    
    wpRow = newRow
    wpCol = newCol
}

function turnWpRight() {

    let newRow = 0
    let newCol = 0
    
    if (wpRow < 0) { // north
    
        newCol = - wpRow // east  
    }
    else if (wpRow > 0) { // south
    
        newCol = - wpRow // west
    }
    
    if (wpCol > 0) { // east
    
        newRow = wpCol // south
    }
    else if (wpCol < 0) { // west
    
        newRow = wpCol // north
    }
    
    wpRow = newRow
    wpCol = newCol
}

main()

