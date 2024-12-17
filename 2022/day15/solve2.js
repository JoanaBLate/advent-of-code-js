"use strict"

// solving the puzzle takes (my computer) 0.045s

/*
    HINTS: 
    
    the range area of any sensor has a diamond shape 
           
    there is *only one* spot in the target area that is not
    covered by any sensor - it MUST be *surrounded* by the 
    borders of the nearby sensors

    so the hidden beacon spot matches the 
    nearby sensor ranges *PLUS ONE*
    (because it is slightly out of range)
*/

const input = Deno.readTextFileSync("input.txt").trim()

const SENSORS = [ ]

const MAXDIM = 4000 * 1000


function main() {

    processInput()
    
    const hiddenBeacon = findHiddenBeacon()
        
    console.log("the answer is", hiddenBeacon.col * MAXDIM + hiddenBeacon.row)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(": closest beacon is at ")
        
        const tokensA = parts.shift().replace("Sensor at ", "").split(", ")
        
        const sensorCol = parseInt(tokensA.shift().substr(2))
        const sensorRow = parseInt(tokensA.shift().substr(2))
        
        const tokensB = parts.shift().split(", ")
        
        const beaconCol = parseInt(tokensB.shift().substr(2))
        const beaconRow = parseInt(tokensB.shift().substr(2))
        
        const range = calcManhattan(sensorRow, sensorCol, beaconRow, beaconCol)
        
        SENSORS.push({ "row": sensorRow, "col": sensorCol, "range": range })
    }
}

///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function calcManhattan(rowA, colA, rowB, colB) {

    return Math.abs(rowB - rowA) + Math.abs(colB - colA)
}

function isHiddenSpot(row, col) {
    
    for (const sensor of SENSORS) {
    
        const distance = calcManhattan(sensor.row, sensor.col, row, col)
        
        if (distance <= sensor.range) { return false }
    }
    
    return true
}

function remainingRange(row, col, sensor) {

    const a = sensor.range + 1 // extended range!
    
    const b = calcManhattan(row, col, sensor.row, sensor.col)
    
    return a - b
}

///////////////////////////////////////////////////////////

function findHiddenBeacon() {

    for (let a = 0; a < SENSORS.length - 1; a++) {
    
        const sensorA = SENSORS[a]
    
        for (let b = a + 1; b < SENSORS.length; b++) {
    
            const sensorB = SENSORS[b]
            
            const distance = calcManhattan(sensorA.row, sensorA.col, sensorB.row, sensorB.col)
            
            const extendedRangeA = sensorA.range + 1
            const extendedRangeB = sensorB.range + 1
            
            if (distance != extendedRangeA + extendedRangeB) { continue }
            
            const beacon = findHiddenBeacon2(sensorA, sensorB)

            if (beacon != null) { return beacon }
        }
    }
}

function findHiddenBeacon2(sensorA, sensorB) {

    const extendedRangeA = sensorA.range + 1
    const extendedRangeB = sensorB.range + 1

    const topA = sensorA.row - extendedRangeA
    const leftA = sensorA.col - extendedRangeA
    const rightA = sensorA.col + extendedRangeA
    const bottomA = sensorA.row + extendedRangeA

    const topB = sensorB.row - extendedRangeB
    const leftB = sensorB.col - extendedRangeB
    const rightB = sensorB.col + extendedRangeB
    const bottomB = sensorB.row + extendedRangeB
    
    const top = Math.max(0, topA, topB)
    const left = Math.max(0, leftA, leftB)
    const right = Math.min(MAXDIM, rightA, rightB)
    const bottom = Math.min(MAXDIM, bottomA, bottomB)
    
    return findHiddenBeacon3(sensorA, sensorB, top, left, bottom, right)
}
    
function findHiddenBeacon3(sensorA, sensorB, top, left, bottom, right) {

    // setting deepest point for sensorA
    
    let row = bottom
    
    let col = sensorA.col + remainingRange(row, sensorA.col, sensorA)
    
    if (col > right) { col = right; row -= remainingRange(row, col, sensorA) }
    
    return findHiddenBeaconBottomUp(sensorA, sensorB, top, left, row, right)
}

function findHiddenBeaconBottomUp(sensorA, sensorB, top, left, bottom, right) {

    for (let row = bottom; row >= top; row--) {
    
        let col = sensorA.col + remainingRange(row, sensorA.col, sensorA)
        
        if (col < left || col > right) { continue }
        
        if (remainingRange(row, col, sensorB) != 0) { continue }
        
        if (isHiddenSpot(row, col)) { return createPoint(row, col) }
    }
    
    return null
}

///////////////////////////////////////////////////////////


main()

