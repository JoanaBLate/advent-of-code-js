"use strict"

// solving the puzzle takes (my computer) 1.130s

const instructions = [ ]

const expected = "01".repeat(25)

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        instructions.push(tokens) 
    }
    
    let input = -1
    
    while (true) {
        
        input += 1 
        
        const message = runComputer(input, 50)
        
        if (message == expected) { break }         
    }
    
    console.log("the lowest positive integer is", input)
}
    
function runComputer(input, maxLength) {

    let message = ""

    let a = input
    let b = 0
    let c = 0
    let d = 0
    
    let pointer = 0
    
    const last = instructions.length - 1
        
    while (true) {
    
        if (pointer < 0  || pointer > last) { break }
        
        const inst = instructions[pointer]
        
        if (inst[0] == "cpy") { 
        
            const value = getValue(inst[1], a, b, c, d)
            
            if (inst[2] == "a") { a = value; pointer++; continue }
            if (inst[2] == "b") { b = value; pointer++; continue }
            if (inst[2] == "c") { c = value; pointer++; continue }
            if (inst[2] == "d") { d = value; pointer++; continue }
            
            // instruction affected by toggling
                        
            pointer++
            continue
        }
    
        if (inst[0] == "dec") { 
        
            if (inst[1] == "a") { a -= 1; pointer++; continue }
            if (inst[1] == "b") { b -= 1; pointer++; continue }
            if (inst[1] == "c") { c -= 1; pointer++; continue }
            if (inst[1] == "d") { d -= 1; pointer++; continue }
            
            return // should not happen
        }
    
        if (inst[0] == "inc") { 
        
            if (inst[1] == "a") { a += 1; pointer++; continue }
            if (inst[1] == "b") { b += 1; pointer++; continue }
            if (inst[1] == "c") { c += 1; pointer++; continue }
            if (inst[1] == "d") { d += 1; pointer++; continue }
            
            return // should not happen
        }
    
        if (inst[0] == "jnz") { 
        
            const value = getValue(inst[1], a, b, c, d)
            
            if (value == 0) { pointer++; continue }
        
            const jumps = getValue(inst[2], a, b, c, d)

            pointer += jumps                        
            
            continue
        }   
        
        if (inst[0] == "out") { 
        
            const value = getValue(inst[1], a, b, c, d)
        
            message += value
                        
            if (message.length == maxLength) { return message }
            
            pointer++
            
            continue     
        }
        
        return // should not happen
    }
}

function getValue(thing, a, b, c, d) {
    
    if (thing == "a") { return a }
    if (thing == "b") { return b }
    if (thing == "c") { return c }
    if (thing == "d") { return d }
    
    return parseInt(thing)
}

main()

