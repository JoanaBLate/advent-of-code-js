"use strict"

// solving the puzzle takes (my computer) 0.120s

const ARQUIVE = [ ] 

const WIDTH = 50
const HEIGHT = 50

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

var affecteds = 0


function main() {
  
    processInput()
    
    while (ARQUIVE.length < 1000) { ARQUIVE.push(0) }
    
    for (let x = 0; x < WIDTH; x++) {

       for (let y = 0; y < HEIGHT; y++) {

            affecteds += runProgram(x, y)
        }
    }

    console.log("the answer is", affecteds)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { ARQUIVE.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////

function runProgram(x, y) {

    return runProgramCore(ARQUIVE.slice(), [x, y])
}

function runProgramCore(DATA, inputs) {

    let pointer = 0

    let relativeBase = 0

    let output = 0
  
    while (true) {
    
        const rawHeader = DATA[pointer]
        
        const header = rawHeader.toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = inputs.shift(); continue }
        
        if (opcode == "04") { output = valueA; continue }
            
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
}

///////////////////////////////////////////////////////////

main()

