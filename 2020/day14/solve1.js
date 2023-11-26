"use strict"

// solving the puzzle takes (my computer) 0.030s

const instructions = [ ]

const memory = { }

var mask = ""


function main() {

    processInput()
    
    while (instructions.length > 0) { executeNextInstruction() }
     
    console.log("the answer is", sumMemory())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { instructions.push(line.trim()) }
}

function sumMemory() {

    let sum = 0
    
    for (const value of Object.values(memory)) { sum += value }
    
    return sum
}

function executeNextInstruction() {

    const instr = instructions.shift()
    
    if (instr.startsWith("mask")) {
    
        mask = instr.replace("mask = ", "")
        return    
    }
    
    let parts = instr.split("] = ")
    
    const address = parts.shift().replace("mem[", "")
    
    const value = parseInt(parts.shift())
    
    memory[address] = maskedValue(value)
}

function maskedValue(decimal) {

    const bin = decimal.toString(2).padStart(36, "0")
    
    let newBin = ""
    
    for (let n = 0; n < 36; n++) {

        newBin += (mask[n] == "X") ? bin[n] : mask[n]
    }
    
    return parseInt(newBin, 2)
}

main()

