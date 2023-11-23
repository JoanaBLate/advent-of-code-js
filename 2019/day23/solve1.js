"use strict"

// solving the puzzle takes (my computer) 0.070s

const ARQUIVE = [ ] 

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

const allComputers = [ ]

var solution = null


function main() {
  
    processInput()

    while (ARQUIVE.length < 3000) { ARQUIVE.push(0) } // giving extra space
    
    createAndPlugAllComputers()
    
    runAllComputersTillEnd()
     
    console.log("the answer is", solution) 
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { ARQUIVE.push(parseInt(token)) }
}

function createAndPlugAllComputers() {
    
    for (let n = 0; n < 50; n++) { 
    
        const state = createComputer(n)
    
        allComputers.push(state) 
        
        runComputerCore(state)
    }
}

function createComputer(networkAddress) {

    return { 
    
        "address": networkAddress,
        "DATA": ARQUIVE.slice(), 
        "pointer": 0, 
        "relativeBase": 0, 
        "inputs": [ networkAddress ], 
        "outputs": [ ] 
    }
}

///////////////////////////////////////////////////////////

function runAllComputersTillEnd() {

    while (true) {
    
        for (let n = 0; n < 50; n++) { 
        
            runComputer(n)
            
            if (solution != null) { return }
        }
    }
}
    
///////////////////////////////////////////////////////////

function runComputer(n) {

    const state = allComputers[n]
    
    if (state.inputs.length == 0) { state.inputs.push(-1) }
    
    runComputerCore(state)
    
    while (state.outputs.length > 2) {
    
        const address = state.outputs.shift()
        const X = state.outputs.shift()
        const Y = state.outputs.shift()

        if (address == 255) { solution = Y; return }
        
        const receiver = allComputers[address]

        if (receiver.inputs[0] == -1) { receiver.inputs.shift() }

        receiver.inputs.push(X)
        receiver.inputs.push(Y)    
    }
}

///////////////////////////////////////////////////////////

function runComputerCore(state) {

    let pointer = state.pointer
    let relativeBase = state.relativeBase
    
    const DATA = state.DATA
    const inputs = state.inputs
    const outputs = state.outputs
  
    while (true) {
    
        const rawHeader = DATA[pointer]
        
        const header = rawHeader.toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { console.log("BREAKING BY OPCODE 99"); break } // should not happen
            
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
        const modeC = parseInt(header[0])
        
        const paramA = DATA[pointer]
        pointer += 1
        const valueA = getValue(modeA, paramA, relativeBase)
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = inputs.shift(); break }
        
        if (opcode == "04") { outputs.push(valueA); break }
            
        if (opcode == "09") { relativeBase += valueA; break }
            
        const paramB = DATA[pointer]    
        pointer += 1
        const valueB = getValue(modeB, paramB, relativeBase)
        
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { pointer = valueB }
            break 
        }
    
        if (opcode == "06") { // jump-if-false
        
            if (valueA == 0) { pointer = valueB }
            break 
        }
    
        const paramC = DATA[pointer]    
        pointer += 1
        const addressC = getAddress(modeC, paramC, relativeBase)
        
        if (opcode == "01") { DATA[addressC] = valueA + valueB; break }
        
        if (opcode == "02") { DATA[addressC] = valueA * valueB; break }
        
        if (opcode == "07") { DATA[addressC] = valueA < valueB; break } 
        
        if (opcode == "08") { DATA[addressC] = valueA == valueB; break } 
    }

    state.pointer = pointer
    state.relativeBase = relativeBase
    return

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

main()

