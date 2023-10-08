"use strict"

// solving the puzzle takes (my computer) 0.030s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const instructions = [ ]
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        instructions.push(tokens) 
    }
    
    let a = 7
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
        
        if (inst[0] == "tgl") { 
        
            const value = getValue(inst[1], a, b, c, d)
        
            const index = pointer + value
                        
            if (index < 0 || index > last) {  pointer++; continue }
            
            const target = instructions[index]
            
            toggle(target)   
            
            pointer++
            
            continue     
        }
        
        return // should not happen
    }

    console.log("the value to be sent to the safe is", a)
}

function getValue(thing, a, b, c, d) {
    
    if (thing == "a") { return a }
    if (thing == "b") { return b }
    if (thing == "c") { return c }
    if (thing == "d") { return d }
    
    return parseInt(thing)
}

function toggle(inst) {

    if (inst[0] == "inc") { inst[0] = "dec"; return }
    
    if (inst[0] == "dec") { inst[0] = "inc"; return }
    
    if (inst[0] == "cpy") { inst[0] = "jnz"; return }
    
    if (inst[0] == "jnz") { inst[0] = "cpy"; return }
    
    if (inst[0] == "tgl") { inst[0] = "inc"; return }
}

main()


