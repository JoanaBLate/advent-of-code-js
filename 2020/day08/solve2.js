"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]


function main() {

    processInput()
    
    const off = DATA.length
    
    for (let n = 0; n < off; n++) {
    
        const opcode = DATA[n].opcode
        
        if (opcode == "acc") { continue }
        
        const alternative = (opcode == "jmp") ? "nop" : "jmp"
        
        DATA[n].opcode = alternative
        
        const result = runProgram()
        
        if (result != null) { console.log("the answer is", result); return }
        
        DATA[n].opcode = opcode    
    }
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

    let max = DATA.length - 1
    
    let pointer = 0
    
    let accumulator = 0
    
    let done = { } // number.toString(): true
    
    while (true) {
    
        if (pointer < 0  ||  pointer > max) { break }
    
        const key = pointer.toString()
        
        if (done[key]) { return null }
        
        done[key] = true

        const instruction = DATA[pointer]
        
        const opcode = instruction.opcode
        const argument = instruction.argument
               
        if (opcode == "acc") { accumulator += argument; pointer += 1; continue }
        
        if (opcode == "jmp") { pointer += argument; continue }
    
        if (opcode == "nop") { pointer += 1; continue }
    }
    
    return accumulator
}

main()

