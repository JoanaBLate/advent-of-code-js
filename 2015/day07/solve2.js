"use strict"

// solving the puzzle takes (my computer) 0.033s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const instructions = [ ]
    
    for (const rawLine of rawLines) { 
        
        const instruction = makeInstruction(rawLine.trim())
        
        instructions.push(instruction) 
    }
    
    const wires = { }
    
    const executedInstructions = [ ]
    
    while (instructions.length != 0) {
    
        const lastIndex = instructions.length - 1
        
        for (let i = lastIndex; i > -1; i--) { 
        
            const instruction = instructions[i]
            
            const ok = tryExecuteInstruction(wires, instruction)
            
            // this loop *counts down*, so we
            // can splice at the current index
            // without messing with the loop
            
            if (ok) { instructions.splice(i, 1); executedInstructions.push(instruction) }
        }
    }
    
    runAgain(executedInstructions, wires["a"])
}

function runAgain(instructions, newValueForB) {

    for (const instr of instructions) {
    
        if (instr.receiver != "b") { continue }
    
        if (instr.kind != "simple-assignment") { continue }
    
        instr.operandA = "" + newValueForB
        
        break
    }

    const wires = { }
        
    while (instructions.length != 0) {
    
        const lastIndex = instructions.length - 1
        
        for (let i = lastIndex; i > -1; i--) { 
        
            const instruction = instructions[i]
            
            const ok = tryExecuteInstruction(wires, instruction)
            
            // this loop *counts down*, so we
            // can splice at the current index
            // without messing with the loop
            
            if (ok) { instructions.splice(i, 1) }
        }
    }
     
    console.log("value of wire 'a' is", wires["a"])
}

function makeInstruction(line) {

    const instruction = { "kind": "", "operandA": "", "operandB": "", "receiver": "" } 
    
    const tokens = line.split(" ")
    
    instruction.receiver = tokens.pop()
    
    tokens.pop() // '->'
    
    if (tokens.length == 1) {
    
        instruction.operandA = tokens.pop()
        instruction.kind = "simple-assignment"
        return instruction
    }
    
    if (tokens[0] == "NOT") {
    
        instruction.operandA = tokens.pop()
        instruction.kind = tokens.pop()
        return instruction        
    }
    
    instruction.operandB = tokens.pop()
    instruction.kind = tokens.pop()
    instruction.operandA = tokens.pop()
    return instruction
} 

function tryExecuteInstruction(wires, instr) {

    if (! operandIsOk(wires, instr.operandA)) { return false }
    if (! operandIsOk(wires, instr.operandB)) { return false }
    
    wires[instr.receiver] = calcInstruction(wires, instr.kind, instr.operandA, instr.operandB)
    
    return true
}

function operandIsOk(wires, operand) {

    if (operand == "") { return true } // unused
    
    if (operand[0] >= "0"  &&  operand[0] <= "9") { return true } // number
        
    if (wires[operand] != undefined) { return true }
    
    return false
}

function calcInstruction(wires, kind, operandA, operandB) {

    let valueA = wires[operandA]
    if (valueA == undefined) { valueA = parseInt(operandA) }

    let valueB = wires[operandB]
    if (valueB == undefined) { valueB = parseInt(operandB) }

    if (kind == "simple-assignment") { return valueA }

    if (kind == "OR")  { return valueA | valueB }

    if (kind == "AND") { return valueA & valueB }
    
    if (kind == "NOT") { return ~ valueA }
    
    if (kind == "LSHIFT") { return valueA << valueB }

    if (kind == "RSHIFT") { return valueA >> valueB }
}

main()

