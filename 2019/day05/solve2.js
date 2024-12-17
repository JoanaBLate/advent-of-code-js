"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]

const POSITION_MODE = 0

// const IMMEDIATE_MODE = 1

var input = 5

var output = 0


function main() {

    processInput()
    
    let pointer = 0 
    
    while (true) {
    
        const header = DATA[pointer].toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
        
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
     // const modeC = parseInt(header[0])
              
        const parameterA = DATA[pointer]
        
        pointer += 1
        
        const valueA = (modeA == POSITION_MODE) ? DATA[parameterA] : parameterA
        
        if (opcode == "03") { DATA[parameterA] = input; continue }
        
        if (opcode == "04") { output = valueA; continue }
        
        const parameterB = DATA[pointer]
        
        pointer += 1
        
        const valueB = (modeB == POSITION_MODE) ? DATA[parameterB] : parameterB
                
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { pointer = valueB }
            continue 
        }
        
        if (opcode == "06") { // jump-if-false
     
            if (valueA == 0) { pointer = valueB }
            continue 
        }
        
        const parameterC = DATA[pointer]
        
        pointer += 1        
        
        if (opcode == "01") { DATA[parameterC] = valueA + valueB; continue }
        
        if (opcode == "02") { DATA[parameterC] = valueA * valueB; continue }
        
        if (opcode == "07") { DATA[parameterC] = (valueA < valueB) ? 1 : 0; continue }
        
        if (opcode == "08") { DATA[parameterC] = (valueA == valueB) ? 1 : 0; continue }        
    }
     
    console.log("the answer is", output)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

main()

