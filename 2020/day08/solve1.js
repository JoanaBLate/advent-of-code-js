"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]


function main() {

    processInput()
    
    console.log("the answer is", runProgram())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.trim().split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const opcode = tokens.shift()
        const argument = parseInt(tokens.shift())
        
        DATA.push({ "opcode": opcode, "argument": argument })
    }
}

///////////////////////////////////////////////////////////

function runProgram() {

    let pointer = 0
    
    let accumulator = 0
    
    let done = { } // number.toString(): true
    
    while (true) {
    
        const key = pointer.toString()
        
        if (done[key]) { return accumulator }
        
        done[key] = true

        const instruction = DATA[pointer]
        
        const opcode = instruction.opcode
        const argument = instruction.argument
               
        if (opcode == "acc") { accumulator += argument; pointer += 1; continue }
        
        if (opcode == "jmp") { pointer += argument; continue }
    
        if (opcode == "nop") { pointer += 1; continue }
    }
}

main()

