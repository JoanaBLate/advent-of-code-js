"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]

var row = 0
var col = 0

var direction = "east"

const directions = [ "north", "east", "south", "west" ]


function main() {

    processInput()
    
    for (const item of DATA) { executeInstruction(item) }
     
    console.log("the answer is", Math.abs(row) + Math.abs(col))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function executeInstruction(inst) {

    if (inst == "L90")  { turnLeft(); return }
    if (inst == "L180") { turnLeft(); turnLeft(); return }
    if (inst == "L270") { turnLeft(); turnLeft(); turnLeft(); return }
    
    if (inst == "R90")  { turnRight(); return }
    if (inst == "R180") { turnRight(); turnRight(); return }
    if (inst == "R270") { turnRight(); turnRight(); turnRight(); return }
   
    if (inst[0] == "F") { advance(parseInt(inst.substr(1))); return }

    if (inst[0] == "N") { row -= parseInt(inst.substr(1)); return }

    if (inst[0] == "S") { row += parseInt(inst.substr(1)); return }

    if (inst[0] == "W") { col -= parseInt(inst.substr(1)); return }

    if (inst[0] == "E") { col += parseInt(inst.substr(1)); return }
}

function advance(amount) {

    if (direction == "north") { row -= amount; return }
    if (direction == "south") { row += amount; return }
    if (direction == "west")  { col -= amount; return }
    if (direction == "east")  { col += amount; return }
}

function turnLeft() {

    let index = directions.indexOf(direction) - 1
    
    if (index < 0) { index += 4 }
    
    direction = directions[index]
}

function turnRight() {

    let index = directions.indexOf(direction) + 1
    
    if (index > 3) { index -= 4 }
    
    direction = directions[index]
}

main()

