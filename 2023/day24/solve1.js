"use strict"

// solving the puzzle takes (my computer) 0.031s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const lowerLimit = 200000000000000

const upperLimit = 400000000000000


function main() {

    processInput()
    
    console.log("the answer is", compareAll())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" @ ")
        
        const positions = parts.shift().split(",")

        const pX = parseInt(positions.shift())
        const pY = parseInt(positions.shift())
        const __pZ = parseInt(positions.shift())

        const speeds = parts.shift().split(",")

        const vX = parseInt(speeds.shift())
        const vY = parseInt(speeds.shift())
        const __vZ = parseInt(speeds.shift())
        
        const data = createDataObject(pX, vX, pY, vY)
        
        DATA.push(data) 
    }
}

function createDataObject(xPosition, xSpeed, yPosition, ySpeed) {

    const xTimeFromZero = xPosition / xSpeed // time for going from zero X to current X
    
    const yBase = yPosition - (xTimeFromZero * ySpeed) // value of Y when X is zero
    
    return { "xPosition": xPosition, "xSpeed": xSpeed, "yPosition": yPosition, "ySpeed": ySpeed, "yBase": yBase }
}

///////////////////////////////////////////////////////////

function compareAll() {

    let count = 0
    
    const off = DATA.length
    
    for (let indexA = 0; indexA < off; indexA++) {
    
        for (let indexB = indexA + 1; indexB < off; indexB++) {
        
            if (match(DATA[indexA], DATA[indexB])) { count += 1 }
        }
    }
    return  count
}

function match(a, b) {

    const aDeltaYPerXUnit = (a.yPosition - a.yBase) / (a.xPosition - 0) // using yBase means xBase is zero
    const bDeltaYPerXUnit = (b.yPosition - b.yBase) / (b.xPosition - 0) // using yBase means xBase is zero

    const crossedDeltaYPerXUnit = bDeltaYPerXUnit - aDeltaYPerXUnit
    
    const crossedDeltaY = a.yBase - b.yBase
    
    const crossedDeltaX = crossedDeltaY / crossedDeltaYPerXUnit
    
    const x = crossedDeltaX - 0 // using yBase means xBase is zero
  
    const y = x * aDeltaYPerXUnit + a.yBase
    
    if (x < lowerLimit) { return false }
    if (y < lowerLimit) { return false }

    if (x > upperLimit) { return false }
    if (y > upperLimit) { return false }
    
    if (a.ySpeed > 0  &&  y < a.yPosition) { return false }
    if (a.ySpeed < 0  &&  y > a.yPosition) { return false }
    
    if (b.ySpeed > 0  &&  y < b.yPosition) { return false }
    if (b.ySpeed < 0  &&  y > b.yPosition) { return false }

    return true
}

main()
