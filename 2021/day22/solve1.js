"use strict"

// solving the puzzle takes (my computer) 0.050s

const input = Deno.readTextFileSync("input.txt").trim()

const STEPS = [ ]

const EDGE = 50

const CUBE = [ ]


function main() {

    processInput()
    
    createCube()
    
    for (const step of STEPS) { applyStep(step) }
    
    console.log("the answer is", countCubesOn())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const step = createStepObject(line.trim())
        
        STEPS.push(step)
    }
}

function createStepObject(line) {

    const parts = line.split(" ")
    
    const action = parts.shift() // turn on or off
    
    const tokens = parts.shift().split(",")
    
    const rangeX = tokens.shift().replace("x=", "").split("..")
    const rangeY = tokens.shift().replace("y=", "").split("..")
    const rangeZ = tokens.shift().replace("z=", "").split("..")
    
    return {
    
        "action": action,
        
        "xLow": parseInt(rangeX.shift()),
        "xHigh": parseInt(rangeX.shift()),
        
        "yLow": parseInt(rangeY.shift()),
        "yHigh": parseInt(rangeY.shift()),
        
        "zLow": parseInt(rangeZ.shift()),
        "zHigh": parseInt(rangeZ.shift())
    }
}

///////////////////////////////////////////////////////////

function createCube() {

    for (let x = -EDGE; x <= +EDGE; x++) { CUBE.push(createAxisY()) }
}

function createAxisY() {

    let axis = [ ]
    
    for (let y = -EDGE; y <= +EDGE; y++) { axis.push(createAxisZ()) }
    
    return axis
}

function createAxisZ() {

    const length = EDGE - -EDGE + 1
    
    return new Uint8Array(length)
}

///////////////////////////////////////////////////////////

function applyStep(step) {

    const value = (step.action == "on") ? 1 : 0
    
    const xLow = Math.max(-EDGE, step.xLow)    
    const yLow = Math.max(-EDGE, step.yLow)    
    const zLow = Math.max(-EDGE, step.zLow)
  
    const xHigh = Math.min(EDGE, step.xHigh)
    const yHigh = Math.min(EDGE, step.yHigh)
    const zHigh = Math.min(EDGE, step.zHigh)      

    for (let x = xLow; x <= xHigh; x++) {

        for (let y = yLow; y <= yHigh; y++) {

            for (let z = zLow; z <= zHigh; z++) { 
            
                CUBE[x+EDGE][y+EDGE][z+EDGE] = value 
            }
        }
    }
}

///////////////////////////////////////////////////////////

function countCubesOn() {

    let count = 0

    for (let x = -EDGE; x <= EDGE; x++) {

        for (let y = -EDGE; y <= EDGE; y++) {

            for (let z = -EDGE; z <= EDGE; z++) { 
            
                count += CUBE[x+EDGE][y+EDGE][z+EDGE]
            }
        }
    }
    return count
}

main()

