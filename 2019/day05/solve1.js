"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]

const POSITION_MODE = 0

// const IMMEDIATE_MODE = 1

var input = 1

var output = 0


function main() {

    processInput()
    
    
    let pointer = 0 
    
    while (true) {
    
        const header = DATA[pointer].toString().padStart(5, "0")
        
        const opcode = header.substr(3, 2)
        
        if (opcode == "99") { break }
        
        const modeA = header[2]
        const modeB = header[1]
     // const modeC = header[0]
        
        pointer += 1
        
        const parameterA = DATA[pointer]
        
        pointer += 1
        
        if (opcode == "03") { DATA[parameterA] = input; continue }
        
        if (opcode == "04") { output = DATA[parameterA]; continue }
        
        const parameterB = DATA[pointer]
        
        pointer += 1
        
        const parameterC = DATA[pointer]
        
        pointer += 1
        
        const valueA = (modeA == POSITION_MODE) ? DATA[parameterA] : parameterA
        
        const valueB = (modeB == POSITION_MODE) ? DATA[parameterB] : parameterB
        
        if (opcode == "01") { DATA[parameterC] = valueA + valueB; continue }
        
        if (opcode == "02") { DATA[parameterC] = valueA * valueB; continue }
    }
     
    console.log("the answer is", output)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}


main()

