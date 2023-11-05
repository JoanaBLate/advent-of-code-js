"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ] // list of **BigInt**

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2


function main() {
  
    processInput()
      
    console.log("the answer is", runProgram(1n))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
//    "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99"
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(BigInt(token)) }
}

///////////////////////////////////////////////////////////

function runProgram(singleInput) {

    let pointer = 0

    let relativeBase = 0

    let output = 0
  
    while (true) {

        const header = Number(DATA[pointer]).toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = singleInput; continue }
        
        if (opcode == "04") { output = valueA; continue }
            
        if (opcode == "09") { relativeBase += Number(valueA); continue }
            
        const paramB = DATA[pointer]    
        pointer += 1
        const valueB = getValue(modeB, paramB, relativeBase)
        
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0n) { pointer = Number(valueB) }
            continue 
        }
    
        if (opcode == "06") { // jump-if-false
        
            if (valueA == 0n) { pointer = Number(valueB) }
            continue 
        }
    
        const paramC = DATA[pointer]    
        pointer += 1
        const addressC = getAddress(modeC, paramC, relativeBase)
        
        if (opcode == "01") { DATA[addressC] = valueA + valueB; continue }
        
        if (opcode == "02") { DATA[addressC] = valueA * valueB; continue }
        
        if (opcode == "07") { DATA[addressC] = BigInt(valueA < valueB); continue } 
        
        if (opcode == "08") { DATA[addressC] = BigInt(valueA == valueB); continue } 
    }
    
    return Number(output)
}

function getAddress(mode, param, relativeBase) {

    if (mode == POSITION_MODE) { return Number(param) }
    
    return relativeBase + Number(param) // RELATIVE_MODE
}

function getValue(mode, param, relativeBase) {
    
    if (mode == IMMEDIATE_MODE) { return param }
    
    const address = getAddress(mode, param, relativeBase)
    
    if (address > DATA.length - 1) { return 0n }
    
    return DATA[address]
}

main()

