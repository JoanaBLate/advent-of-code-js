"use strict"

// solving the puzzle takes (my computer) 0.130s

const instructions = [ ]

const programA = { "registers": { "p": 0 }, "pointer": 0, "queue": [ ], "failures": 0 }
const programB = { "registers": { "p": 1 }, "pointer": 0, "queue": [ ], "failures": 0 }

var program = programA

var shallStop = false

var COUNT = 0


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        instructions.push(tokens) 
    }

    while (true) {
    
        if (programA.failures > 3  &&  programB.failures > 3) { break }
    
        program = programA

        runProgram()        
        
        if (shallStop) { break }
    
        program = programB

        runProgram()
        
        if (shallStop) { break }
    }    

    console.log("number of times that program 1 sent a message is", COUNT)
}

function runProgram() {

    if (program.pointer < 0  || program.pointer >= instructions.length) { shallStop = true; return }
    
    const tokens = instructions[program.pointer]
    
    const first = tokens[0]
    
    if (first == "add") { add(tokens.slice()); return }
    if (first == "mod") { mod(tokens.slice()); return }
    if (first == "mul") { mul(tokens.slice()); return }
    if (first == "jgz") { jgz(tokens.slice()); return }
    if (first == "rcv") { rcv(tokens.slice()); return }
    if (first == "set") { set(tokens.slice()); return }
    if (first == "snd") { snd(tokens.slice()); return }
}

// operations /////////////////////////////////////////////

function add(tokens) { 

    tokens.shift() // add
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    program.registers[name] += value
    
    program.pointer += 1
}

function mod(tokens) {

    tokens.shift() // mod
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    program.registers[name] %= value
    
    program.pointer += 1
}

function mul(tokens) {

    tokens.shift() // mul
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    program.registers[name] *= value
    
    program.pointer += 1
}

function jgz(tokens) {

    tokens.shift() // jgz 
    
    const value = getValue(tokens.shift())
    
    if (value <= 0) { program.pointer += 1; return }
    
    const jumps = getValue(tokens.shift())
    
    program.pointer += jumps
}

function set(tokens) { 

    tokens.shift() // set
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    program.registers[name] = value
    
    program.pointer += 1
}

function snd(tokens) { 
    
    if (program == programB) { COUNT += 1 }

    tokens.shift() // snd
    
    const value = getValue(tokens.shift())
    
    const otherProgram = (program == programA) ? programB : programA
    
    otherProgram.queue.push(value)
    
    program.pointer += 1
}

function rcv(tokens) { 
    
    if (program.queue.length == 0) { program.failures += 1; return }
    
    program.failures = 0

    tokens.shift() // rcv
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    program.registers[name] = program.queue.shift()
    
    program.pointer += 1
}

// helpers ////////////////////////////////////////////////

function maybeCreateRegister(token) {
    
    if (program.registers[token] == undefined) { program.registers[token] = 0 }
}

function getValue(token) {

    const number = parseInt(token)
    
    if (! isNaN(number)) { return number }

    maybeCreateRegister(token)

    return program.registers[token]
}

main()

