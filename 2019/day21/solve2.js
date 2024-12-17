"use strict"

// solving the puzzle takes (my computer) 0.090s

const ARQUIVE = [ ] 

const POSITION_MODE = 0
const IMMEDIATE_MODE = 1
const RELATIVE_MODE = 2

var solution = 0


function main() {
  
    processInput()

    while (ARQUIVE.length < 3000) { ARQUIVE.push(0) } // giving extra space
    
   // any jump always ends on D
   // never jump when D is hole
   // always jump when A is hole (good for the last/definitive check)
   // must choose when to jump early, considering B and C
   // H being ground grants a consecutive jump is OK
   
   const code = [
   
        "NOT B T", // if B is hole, T is true
        "NOT C J", // if C is hole, J is true
        "OR T J",  // if B or C is hole, J is true
        "AND D J", // if D is ground and (B or C is hole), J is true
        "AND H J", // if D is ground and (B or C is hole) and H is ground, J is true
        "NOT A T", // if A is hole, T is true
        "OR T J",  // if A is hole or (D is ground and (B or C is hole) and H is ground), J is true
        "RUN"
        
    ].join("\n") + "\n"

    const message = runProgram(code)
    
//  console.log(message)
  
    console.log("the answer is", solution)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { ARQUIVE.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////

function runProgram(source) {

    const input = [ ]
    
    for (const c of source) { input.push(c.charCodeAt(0)) }

    const output = runProgramCore(ARQUIVE.slice(), input)   

    let result = ""

    for (const item of output) { 
    
        if (item > 255) { solution = item; continue }
        
        result += String.fromCharCode(item) 
    }
    
    return result  
}

function runProgramCore(DATA, input) {

    let pointer = 0

    let relativeBase = 0

    let output = [ ]
  
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
        
        if (opcode == "03") { DATA[getAddress(modeA, paramA, relativeBase)] = input.shift(); continue }
        
        if (opcode == "04") { output.push(valueA); continue }
            
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

main()

