"use strict"

// solving the puzzle takes (my computer) 0.040s

const registers = { }

const instructions = [ ]

var pointer = 0

var shallStop = false

var count = 0


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
        
        if (first == "mul") { mul(tokens.slice()); continue }
        if (first == "jnz") { jnz(tokens.slice()); continue }
        if (first == "set") { set(tokens.slice()); continue }
        if (first == "sub") { sub(tokens.slice()); continue }
    }    

    console.log("number of times mul was invoked is", count )
}

function mul(tokens) {

    count += 1

    tokens.shift() // mul
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] *= value
    
    pointer += 1
}

function jnz(tokens) {

    tokens.shift() // jnz 
    
    const value = getValue(tokens.shift())
    
    if (value == 0) { pointer += 1; return }
    
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

function sub(tokens) { 

    tokens.shift() // sub
    
    const name = tokens.shift()

    maybeCreateRegister(name)
    
    const value = getValue(tokens.shift())
    
    registers[name] -= value
    
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

