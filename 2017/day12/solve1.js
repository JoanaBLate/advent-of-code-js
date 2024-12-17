"use strict"

// solving the puzzle takes (my computer) 0.040s

const DATA = { } // processing *ERASES* its pipes

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const base = tokens.shift()
        
        tokens.shift() // <->
        
        const pipes = [ ]
        
        while (tokens.length > 0) { 
        
            const number = parseInt(tokens.shift())
            
            pipes.push(number.toString())
        }
        
        DATA[base] = { "connected": false, "pipes": pipes }        
    }
    
    DATA["0"].connected = true

    while (update()) { }
     
    let count = 0
    
    for (const obj of Object.values(DATA)) { if (obj.connected) { count += 1 } }
     
    console.log("number of programs is", count)
}

function update() {

    let updated = false

    for (const id of Object.keys(DATA)) {

        const changed = updateThis(id)
        
        if (changed) { updated = true }
    }
    
    return updated
}   
     
function updateThis(id) {

    const obj = DATA[id]
    
    if (obj.connected  &&  obj.pipes.length == 0) { return false }
        
    if (obj.connected) { // obj.pipes.length != 0
        
        for (const pipe of obj.pipes) { DATA[pipe].connected = true }
        
        obj.pipes = [ ]   
             
        return true
    }
    
    // ! obj.connected:
    
    let index = -1
    
    for (const pipe of obj.pipes) {
    
        index += 1
        
        if (! DATA[pipe].connected) { continue }
        
        obj.connected = true
        
        obj.pipes.splice(index, 1)
        
        return true
    }
    
    return false
}        

main()

