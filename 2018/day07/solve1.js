"use strict"

// solving the puzzle takes (my computer) 0.030s

var PATH = ""

const DATA = [ ]


function main() {

    processInput()
    
    while (executeOneStep()) { }
    
    console.log("the answer is", PATH)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        tokens.shift() // Step

        const requisit = tokens.shift()
        
        tokens.pop() // begin.
        tokens.pop() // can
        
        const dependent = tokens.pop()
        
        if (DATA[requisit]  == undefined) { DATA[requisit]  = createBlankData() }
        if (DATA[dependent] == undefined) { DATA[dependent] = createBlankData() }
        
        DATA[dependent].requisits.push(requisit)
    }
}

function createBlankData() {

    return {
        "executed": false,
        "requisits": [ ]
    }
}

function executeOneStep() { 

    const freeSteps = findFreeSteps()
    
    if (freeSteps.length == 0) { return false } //  there is more to do is false
    
    const requisit = freeSteps[0]
    
    PATH += requisit
    
    DATA[requisit].executed = true
    
    releaseDependents(requisit)
    
   return true // there is more to do is true
}

function findFreeSteps() {

    const freeSteps = [ ]

    for (const step of Object.keys(DATA)) {
    
        const data = DATA[step]
        
        if (data.executed) { continue }
        
        if (data.requisits.length > 0) { continue }
    
        freeSteps.push(step)
    }
    
    freeSteps.sort()
    
    return freeSteps
}
    
function releaseDependents(requisit) {

    for (const data of Object.values(DATA)) {
    
        if (data.executed) { continue }
        
        const index = data.requisits.indexOf(requisit)
        
        if (index != -1) { data.requisits.splice(index, 1) }
    }
}

main()

