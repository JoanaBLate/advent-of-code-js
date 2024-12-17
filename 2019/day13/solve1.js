 "use strict"

// solving the puzzle takes (my computer) 0.035s

const DATA = [ ]

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

var input = 0 // not used

const outputs = [ ]

const EMPTY = 0
const WALL = 1
const BLOCK = 2
const PADDLE = 3
const BALL = 4

const board = { }


function main() {
  
    processInput()
    
    runProgram()
    
    let count = 0
    
    for (const value of Object.values(board)) {
    
        if (value == BLOCK) { count += 1 }
    }
          
    console.log("the answer is", count)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////

function action() {

    const left = outputs.shift()

    const top = outputs.shift()
    
    const id = outputs.shift() 
    
    const key = [ top + "~" + left ]

    if (id == WALL) { board[key] = id }
    if (id == BLOCK) { board[key] = id }
    if (id == PADDLE) { board[key] = id }
    
    if (id == BALL  &&  board[key] == BLOCK) { board[key] = EMPTY }
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
            
            if (outputs.length == 3) { action() }
                
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

