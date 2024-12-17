"use strict"

// solving the puzzle takes (my computer) 0.040s

const samples = [ ]

const instructions = [ ]

const opcodes = "addr,addi,mulr,muli,banr,bani,borr,bori,setr,seti,gtir,gtri,gtrr,eqir,eqri,eqrr".split(",")

const possibleOpcodes = { } // 1: [ "mulr"... ]  

const definitiveOpcodes = { } // 1: "mulr"  

const REGISTERS = [ 0, 0, 0, 0 ]


function main() {

    processInput()
    
    for (const sample of samples) { tryAllOpcodes(sample) }
    
    for (let n = 0; n < 16; n++) { possibleOpcodes[n] = findPossibleOpcodes(n) }
    
    while (true) {
    
        const keys = Object.keys(possibleOpcodes)
        
        if (keys.length == 0) { break }
        
        extractLonelyOpcodes()
        
        reducePossibilities()        
    }
    
    // now all opcodes are identified
    
    for (const instr of instructions) { executeInstruction(instr) }
    
    console.log("the answer is", REGISTERS[0])
}

function findPossibleOpcodes(number) {
    
    let candidates = opcodes
    
    for (const sample of samples) {

        if (sample.command[0] != number) { continue }
        
        const common = [ ]
        
        for (const candidate of candidates) { 
        
            if (! sample.possibleOpcodes.includes(candidate)) { continue }
            
            common.push(candidate)
        }
        candidates = common
    }

    return candidates
}

function extractLonelyOpcodes() {
    
    const keys = Object.keys(possibleOpcodes)   
    
    for (const key of keys) {
    
        const list = possibleOpcodes[key]
        
        if (list.length > 1) { continue }
        
        definitiveOpcodes[key] = list.shift()
        
        delete possibleOpcodes[key]    
    }
}

function reducePossibilities() {

    const definitives = Object.values(definitiveOpcodes)
    
    const keys = Object.keys(possibleOpcodes)   
    
    for (const key of keys) {
        
        const temp = [ ]
        
        const list = possibleOpcodes[key]
        
        for (const item of list) { 
        
            if (! definitives.includes(item)) { temp.push(item) }
        }
                    
        possibleOpcodes[key] = temp
    }
}
        
///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
        
    while (true) { // samples
    
        const line1 = lines.shift().trim()
        
        if (line1 == "") { break }
        
        const tokens1 = line1.replace("Before: [", "").split(",")
        
        const before = [ ]
        
        for (const token of tokens1) { before.push(parseInt(token)) }
        
        //   
        const line2 = lines.shift().trim()
        
        const tokens2 = line2.split(" ")
        
        const command = [ ]
        
        for (const token of tokens2) { command.push(parseInt(token)) }
        
        //      
        const line3 = lines.shift().trim()
        
        const tokens3 = line3.replace("After:  [", "").split(",")
        
        const after = [ ]
        
        for (const token of tokens3) { after.push(parseInt(token)) }
        
        //
        samples.push({ "command": command, "before": before, "after": after, "possibleOpcodes": [ ] })
        
        lines.shift() // blank line
    }
    
    while (lines.length > 0) {
    
        const line = lines.shift().trim()
        
        if (line == "") { continue }
        
        const tokens = line.split(" ")
        
        const instruction = [ ]
        
        for (const token of tokens) { instruction.push(parseInt(token)) }
        
        instructions.push(instruction)    
    }
}

///////////////////////////////////////////////////////////

function tryAllOpcodes(sample) {

    for (const opcode of opcodes) {
    
        const ok = tryOpcode(sample, opcode)
        
        if (ok) { sample.possibleOpcodes.push(opcode) }
    }
}

function tryOpcode(sample, opcode) {

    if (opcode == "addr") { return tryAddr(sample) }
    if (opcode == "addi") { return tryAddi(sample) }
    
    if (opcode == "mulr") { return tryMulr(sample) }
    if (opcode == "muli") { return tryMuli(sample) }
    
    if (opcode == "banr") { return tryBanr(sample) }
    if (opcode == "bani") { return tryBani(sample) }
    
    if (opcode == "borr") { return tryBorr(sample) }
    if (opcode == "bori") { return tryBori(sample) }
    
    if (opcode == "setr") { return trySetr(sample) }
    if (opcode == "seti") { return trySeti(sample) }
    
    if (opcode == "gtir") { return tryGtir(sample) }
    if (opcode == "gtri") { return tryGtri(sample) }
    if (opcode == "gtrr") { return tryGtrr(sample) }
    
    if (opcode == "eqir") { return tryEqir(sample) }
    if (opcode == "eqri") { return tryEqri(sample) }
    if (opcode == "eqrr") { return tryEqrr(sample) }
}

function gotMatch(listA, listB) {

    if (listA[0] != listB[0]) { return false }
    if (listA[1] != listB[1]) { return false }
    if (listA[2] != listB[2]) { return false }
    if (listA[3] != listB[3]) { return false }

    return true
}

function tryAddr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a + b
    
    return gotMatch(sample.after, registers)
}

function tryAddi(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a + b
    
    return gotMatch(sample.after, registers)
}

function tryMulr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a * b
    
    return gotMatch(sample.after, registers)
}

function tryMuli(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a * b
    
    return gotMatch(sample.after, registers)
}

function tryBanr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a & b
    
    return gotMatch(sample.after, registers)
}

function tryBani(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a & b
    
    return gotMatch(sample.after, registers)
}

function tryBorr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a | b
    
    return gotMatch(sample.after, registers)
}

function tryBori(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a | b
    
    return gotMatch(sample.after, registers)
}

function trySetr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    
    registers[sample.command[3]] = a
    
    return gotMatch(sample.after, registers)
}

function trySeti(sample) {

    const registers = sample.before.slice()

    const a = sample.command[1]
    
    registers[sample.command[3]] = a
    
    return gotMatch(sample.after, registers)
}

function tryGtri(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a > b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

function tryGtir(sample) {

    const registers = sample.before.slice()

    const a = sample.command[1]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a > b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

function tryGtrr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a > b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

function tryEqri(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = sample.command[2]
    
    registers[sample.command[3]] = a == b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

function tryEqir(sample) {

    const registers = sample.before.slice()

    const a = sample.command[1]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a == b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

function tryEqrr(sample) {

    const registers = sample.before.slice()

    const a = registers[sample.command[1]]
    const b = registers[sample.command[2]]
    
    registers[sample.command[3]] = a == b ? 1 : 0
    
    return gotMatch(sample.after, registers)
}

///////////////////////////////////////////////////////////

function executeInstruction(instr) {

    const opcode = definitiveOpcodes[instr[0]]
    
    const valA = instr[1]
    const regA = REGISTERS[valA]
    
    const valB = instr[2]
    const regB = REGISTERS[valB]
    
    const index = instr[3]
    
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
}

main()

