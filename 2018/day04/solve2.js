"use strict"

// solving the puzzle takes (my computer) 0.030s

const notes = [ ]

const guards = { } // id: { moments, hour, total }
    

function main() {

    processInput()  

    processNotes()
    
    processGuards()
    
    const id = getBestGuard()    
    
    const minute = guards[id].bestMinute
    
    const idAsNumber = parseInt(id.replace("#", ""))
     
    console.log("the answer is", idAsNumber * minute)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    for (const line of input.split("\n")) { 
    
        notes.push(line.trim())
    }
}

function processNotes() {
     
    notes.sort()
    
    let guard = null
    
    for (const note of notes) {
    
        const tokens = note.split(" ")
    
        tokens.shift() // day
        
        const rawTime = tokens.shift()
        
        const minute = parseInt(rawTime.split(":").pop())
        
        const kind = tokens.shift()
        
        if (kind != "Guard") { guard.moments.push(minute); continue }
        
        const id = tokens.shift()
        
        //
        
        if (guards[id] == undefined) { 
        
            guards[id] = { "moments": [ ], "hour": new Uint8Array(60), "bestFrequency": 0, "bestMinute": 0 }
        }
        
        guard = guards[id]
    }
}
  
function processGuards() {

    for (const data of Object.values(guards)) { processGuard(data) }
}  
 
function processGuard(data) { // erases moments

    while (data.moments.length != 0) {
    
        const a = data.moments.shift()
        const b = data.moments.shift()
            
        for (let index = a; index < b; index++) { data.hour[index] += 1 }    
    }
    
    for (let index = 0; index < 60; index++) { 
    
        const frequency = data.hour[index] 
        
        if (frequency > data.bestFrequency) { 
            
            data.bestFrequency = frequency
            data.bestMinute = index 
        }
    }
}

function getBestGuard() {

    let bestId = ""
    let bestFrequency = 0
    
    for (const id of Object.keys(guards)) {
    
        const guard = guards[id]
        
        if (guard.bestFrequency > bestFrequency) { bestFrequency = guard.bestFrequency; bestId = id }
    }
    return bestId
}

main()

