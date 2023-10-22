"use strict"

// solving the puzzle takes (my computer) 0.400s

var POINTER = 0

var registerPointer = 0

const instructions = [ ]

const REGISTERS = [ 0, 0, 0, 0, 0, 0 ]


function main() {

    processInput()
    
    // console.log(registerPointer, instructions)
    
    while (true) {
    
        REGISTERS[registerPointer] = POINTER
    
        const instr = instructions[POINTER]
        
        if (instr == undefined) { break }
        
        executeInstruction(instr) 
                
        POINTER = REGISTERS[registerPointer]
        
        POINTER += 1
        
       // console.log(REGISTERS)
    }
    
    console.log("the answer is", REGISTERS[0])
}
        
///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    registerPointer = parseInt(lines.shift().replace("#ip ", ""))
        
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const opcode = tokens.shift()
        
        const a = parseInt(tokens.shift())
        
        const b = parseInt(tokens.shift())
        
        const c = parseInt(tokens.shift())
        
        instructions.push({ "opcode": opcode, "a": a, "b": b, "c": c })
    }
}

///////////////////////////////////////////////////////////

function executeInstruction(instr) {

    const opcode = instr.opcode
    
    const valA = instr.a
    const regA = REGISTERS[valA]
    
    const valB = instr.b
    const regB = REGISTERS[valB]
    
    const index = instr.c
    
    if (opcode == "addr") { REGISTERS[index] = regA + regB; return }
    if (opcode == "addi") { REGISTERS[index] = regA + valB; return }

    if (opcode == "mulr") { REGISTERS[index] = regA * regB; return }
    if (opcode == "muli") { REGISTERS[index] = regA * valB; return }
    
    if (opcode == "banr") { REGISTERS[index] = regA & regB; return }
    if (opcode == "bani") { REGISTERS[index] = regA & valB; return }
    
    if (opcode == "borr") { REGISTERS[index] = regA | regB; return }
    if (opcode == "bori") { REGISTERS[index] = regA | valB; return }

    if (opcode == "setr") { REGISTERS[index] = regA; return }
    if (opcode == "seti") { REGISTERS[index] = valA; return }

    if (opcode == "gtri") { REGISTERS[index] = (regA > valB ? 1 : 0); return }
    if (opcode == "gtir") { REGISTERS[index] = (valA > regB ? 1 : 0); return }
    if (opcode == "gtrr") { REGISTERS[index] = (regA > regB ? 1 : 0); return }    

    if (opcode == "eqri") { REGISTERS[index] = (regA == valB ? 1 : 0); return }
    if (opcode == "eqir") { REGISTERS[index] = (valA == regB ? 1 : 0); return }
    if (opcode == "eqrr") { REGISTERS[index] = (regA == regB ? 1 : 0); return }
    
    console.log("unknown opcode:", opcode)
}

main()

