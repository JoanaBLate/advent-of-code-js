"use strict"

// solving the puzzle takes (my computer) 0.030s

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

function createDataObject(pX, vX, pY, vY) {

    const yRelativeSpeed = vY / vX
    
    const yAtXZero = pY - (pX * yRelativeSpeed)

    return { "yPosition": pY, "ySpeed": vY, "yRelativeSpeed": yRelativeSpeed, "yAtXZero": yAtXZero }
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

    if (b.yRelativeSpeed - a.yRelativeSpeed == 0) { return false }
    
    const x = (a.yAtXZero - b.yAtXZero) / (b.yRelativeSpeed - a.yRelativeSpeed)
  
    const y = x * a.yRelativeSpeed + a.yAtXZero

    if (x < lowerLimit) { return false }
    if (y < lowerLimit) { return false }

    if (x > upperLimit) { return false }
    if (y > upperLimit) { return false }

    const aOk1 = (a.ySpeed > 0)  &&  (y > a.yPosition)
    const aOk2 = (a.ySpeed < 0)  &&  (y < a.yPosition)
    
    if (! aOk1  &&  ! aOk2) { return false }
    
    const bOk1 = (b.ySpeed > 0)  &&  (y > b.yPosition)
    const bOk2 = (b.ySpeed < 0)  &&  (y < b.yPosition)
    
    if (! bOk1  &&  ! bOk2) { return false }

    return true
}

main()
