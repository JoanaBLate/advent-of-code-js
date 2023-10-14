"use strict"

// solving the puzzle takes (my computer) 0.030s


const DATA = [ ]

const tasks  = [ "", "", "", "", "" ] // one task for each worker

const clocks = [ 0, 0, 0, 0, 0 ] // one clock for each worker

var CLOCK = 0


function main() {

    processInput()
    
    while (true) {
        
        tryFinishTasks()
    
        distributeTasks()
        
        if (tasks[0] + tasks[1] + tasks[2] + tasks[3] + tasks[4] == "") { break }
        
        CLOCK += 1
    }
    
    console.log("the answer is", CLOCK)
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
        "designed": false,
        "executed": false,
        "requisits": [ ]
    }
}

function distributeTasks() { 

    const freeSteps = findFreeSteps()
    
    for (const step of freeSteps) { 
    
        const index = findFreeWorker()
        
        if (index == -1) { return }
    
        tasks[index] = step
    
        const time = 60 + step.charCodeAt(0) - 64 // 'A' is 65
        
        clocks[index] = CLOCK + time 
        
        DATA[step].designed = true    
    }    
}

function findFreeSteps() {

    const freeSteps = [ ]

    for (const step of Object.keys(DATA)) {
    
        const data = DATA[step]
        
        if (data.designed) { continue }
        
        if (data.executed) { continue }
        
        if (data.requisits.length > 0) { continue }
    
        freeSteps.push(step)
    }
    
    freeSteps.sort()
    
    return freeSteps
}

function findFreeWorker() {
    
    for (let index = 0; index < tasks.length; index++) { 
    
        if (tasks[index] == "") { return index }    
    }
    
    return -1
}

function tryFinishTasks() {    
           
    for (let index = 0; index < tasks.length; index++) { tryFinishTask(index) }
}
    
function tryFinishTask(index) {

    const step = tasks[index]
    
    if (step == "") { return }
    
    if (CLOCK != clocks[index]) { return }
        
    tasks[index] = ""
    
    DATA[step].executed = true
    
    releaseDependents(step)
}

function releaseDependents(requisit) {

    for (const data of Object.values(DATA)) {
    
        if (data.executed) { continue }
        
        const index = data.requisits.indexOf(requisit)
        
        if (index != -1) { data.requisits.splice(index, 1) }
    }
}

main()

