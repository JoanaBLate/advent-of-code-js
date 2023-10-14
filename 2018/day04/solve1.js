"use strict"

// solving the puzzle takes (my computer) 0.030s

const notes = [ ]

const guards = { } // id: { moments, hour, total }
    

function main() {

    processInput()  

    processNotes()
    
    processGuards()
    
    const id = findSleepestGuard()
    
    const idAsNumber = parseInt(id.replace("#",""))
    
    const minute = findSleepestMinute(id)
     
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
        
            guards[id] = { "moments": [ ], "hour": new Uint8Array(60), "total": 0 }
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
    
        data.total += b - a
        
        for (let index = a; index < b; index++) { data.hour[index] += 1 }    
    }
}

function findSleepestGuard() {

    let bestId = ""
    let bestTime = 0
    
    for (const id of Object.keys(guards)) {
    
        const guard = guards[id]
        
        if (guard.total > bestTime) { bestTime = guard.total; bestId = id }
    }
    return bestId
}

function findSleepestMinute(id) {

    let bestAmount = 0
    let bestMinute = -1
    
    const guard = guards[id]
    
    for (let minute = 0; minute < 60; minute++) {
    
        const amount = guard.hour[minute]
        
        if (amount > bestAmount) { bestAmount = amount; bestMinute = minute }
    }
    return bestMinute
}

main()

