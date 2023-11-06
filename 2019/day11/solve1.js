"use strict"

// solving the puzzle takes (my computer) 0.050s

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

var input = 0

const outputs = [ ]

const BLACK = 0
const WHITE = 1
const TURN_LEFT = 0
const TURN_RIGHT = 1

const paintings = { }

var robotRow = 0

var robotCol = 0

var robotDirections = [ "north", "east", "south", "west" ]

function main() {
  
    processInput()
    
    runProgram()
      
    console.log("the answer is", Object.keys(paintings).length)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////

function action() {

    const color = outputs.shift()

    const turn = outputs.shift() 

    paintings[robotRow + "~" + robotCol] = color

    if (turn == TURN_RIGHT) { robotDirections.push(robotDirections.shift()) }
    if (turn == TURN_LEFT)  { robotDirections.unshift(robotDirections.pop()) }

    const direction = robotDirections[0]
    
    if (direction == "north") { robotRow -= 1 }
    if (direction == "south") { robotRow += 1 }
    if (direction == "west")  { robotCol -= 1 }
    if (direction == "east")  { robotCol += 1 }
    
    const key = robotRow + "~" + robotCol
    
    input = paintings[key]  
    
    if (input == undefined) { input = BLACK }    
}

///////////////////////////////////////////////////////////

function runProgram() {

    let pointer = 0

    let relativeBase = 0

    let output = 0
  
    while (true) {

        const header = DATA[pointer].toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = input; continue }
        
        if (opcode == "04") { 
        
            outputs.push(valueA)
            
            if (outputs.length == 2) { action() }
                
            continue 
        }
            
        if (opcode == "09") { relativeBase += valueA; continue }
            
        const paramB = DATA[pointer]    
        pointer += 1
        const valueB = getValue(modeB, paramB, relativeBase)
        
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { pointer = valueB }
            continue 
        }
    
        if (opcode == "06") { // jump-if-false
        
            if (valueA == 0) { pointer = valueB }
            continue 
        }
    
        const paramC = DATA[pointer]    
        pointer += 1
        const addressC = getAddress(modeC, paramC, relativeBase)
        
        if (opcode == "01") { DATA[addressC] = valueA + valueB; continue }
        
        if (opcode == "02") { DATA[addressC] = valueA * valueB; continue }
        
        if (opcode == "07") { DATA[addressC] = valueA < valueB; continue } 
        
        if (opcode == "08") { DATA[addressC] = valueA == valueB; continue } 
    }
    
    return output
}

function getAddress(mode, param, relativeBase) {

    if (mode == POSITION_MODE) { return param }
    
    return relativeBase + param // RELATIVE_MODE
}

function getValue(mode, param, relativeBase) {
    
    if (mode == IMMEDIATE_MODE) { return param }
    
    const address = getAddress(mode, param, relativeBase)
    
    if (address > DATA.length - 1) { return 0 }
    
    return DATA[address]
}

main()

