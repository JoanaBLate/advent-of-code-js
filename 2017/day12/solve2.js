"use strict"

// solving the puzzle takes (my computer) 0.070s

var DATA = { } // processing *ERASES* its pipes

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
    
    let numberOfGroups = 0
    
    while (true) {
    
        const names = Object.keys(DATA)
        
        if (names.length == 0) { break }
    
        processOneGroup(names[0])
        
        numberOfGroups += 1

        const temp = { }
        
        for (const name of names) { 
        
            if (DATA[name].connected) { continue } 
        
            temp[name] = DATA[name]
        }
        
        DATA = temp        
    }
     
    console.log("then number of groups is", numberOfGroups)
}
    
function processOneGroup(name) {
    
    DATA[name].connected = true

    while (update()) { }
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

