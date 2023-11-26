"use strict"

// solving the puzzle takes (my computer) 0.145s

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
    
    const rawAddress = parts.shift().replace("mem[", "")
    
    const decimalAddress = parseInt(rawAddress)
    
    const value = parseInt(parts.shift())
    
    const maskedAddress = maskThisAddress(decimalAddress)
    
    fillMemoryByMaskedAddress(maskedAddress, value)
}

function maskThisAddress(decimal) {

    const bin = decimal.toString(2).padStart(36, "0")
    
    let newBin = ""
    
    for (let n = 0; n < 36; n++) {

        newBin += (mask[n] == "0") ? bin[n] : mask[n]
    }    
    return newBin
}

function fillMemoryByMaskedAddress(maskedAddress, value) { // recursive function

    const index = maskedAddress.indexOf("X")
    
    if (index == -1) { memory[maskedAddress] = value; return }
    
    const a = maskedAddress.substr(0, index)
    const b = maskedAddress.substr(index + 1)
    
    fillMemoryByMaskedAddress(a + "0" + b, value)
    fillMemoryByMaskedAddress(a + "1" + b, value)
}

main()

