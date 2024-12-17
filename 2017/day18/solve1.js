"use strict"

// solving the puzzle takes (my computer) 0.030s

const registers = { }

const instructions = [ ]

var pointer = 0

var shallStop = false


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        instructions.push(tokens) 
    }

    while (true) {
    
        if (pointer < 0  || pointer >= instructions.length) { break }

        if (shallStop) { break }
        
        const tokens = instructions[pointer]
        
        const first = tokens[0]
        
        if (first == "add") { add(tokens.slice()); continue }
        if (first == "mod") { mod(tokens.slice()); continue }
        if (first == "mul") { mul(tokens.slice()); continue }
        if (first == "jgz") { jgz(tokens.slice()); continue }
        if (first == "rcv") { rcv(tokens.slice()); continue }
        if (first == "set") { set(tokens.slice()); continue }
        if (first == "snd") { snd(tokens.slice()); continue }
    }    

    console.log("value of the recovered frequency is", registers["recover"] )
}

function add(tokens) { 

    tokens.shift() // add
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] += value
    
    pointer += 1
}

function mod(tokens) {

    tokens.shift() // mod
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] %= value
    
    pointer += 1
}

function mul(tokens) {

    tokens.shift() // mul
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] *= value
    
    pointer += 1
}

function jgz(tokens) {

    tokens.shift() // jgz 
    
    const value = getValue(tokens.shift())
    
    if (value <= 0) { pointer += 1; return }
    
    const jumps = getValue(tokens.shift())
    
    pointer += jumps
}

function set(tokens) { 

    tokens.shift() // set
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] = value
    
    pointer += 1
}

function snd(tokens) { 

    tokens.shift() // snd
    
    const name = "sound"

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] = value
    
    pointer += 1
}

function rcv(tokens) { 

    tokens.shift() // rcv
    
    const name = "recover"

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    if (value != 0) { registers[name] = registers["sound"]; shallStop = true }
    
    pointer += 1
}

// helpers ////////////////////////////////////////////////

function maybeCreateRegister(token) {
    
    if (registers[token] == undefined) { registers[token] = 0 }
}

function getValue(token) {

    const number = parseInt(token)
    
    if (! isNaN(number)) { return number }

    maybeCreateRegister(token)

    return registers[token]
}

main()

