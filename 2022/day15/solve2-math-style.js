"use strict"

// solving the puzzle takes (my computer) 0.027s

/*
    HINTS:     
    
    the range area of any sensor has a diamond shape 
        
    a diamond shape has two kinds of border: ascending and descending
    
    two borders are non-parallel if they are of different kinds
    
    there is *only one* spot in the target area that is not
    covered by any sensor - it MUST be an *outside neighbor* of 
    the borders of some sensors
    
    this solution considers *extended* borders (the lines of spots
    that are immediately outside the borders)
    
    each time *non-parallel extended* borders overlap, there is 
    a good chance we got the hidden beacon spot
    
*/

const input = Deno.readTextFileSync("input.txt").trim()

const MAXDIM = 4000 * 1000

const SENSORS = [ ]


function main() {

    processInput()
    
    const beacon = findHiddenBeacon()
    
    console.log("the answer is", beacon.col * MAXDIM + beacon.row)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(": closest beacon is at ")
        
        const position = createPointFromToken(parts.shift().replace("Sensor at ", ""))
        
        const beacon = createPointFromToken(parts.shift())
        
        const range = calcManhattan(position, beacon)
        
        SENSORS.push({ "position": position, "beacon": beacon, "range": range })
    }
}

function createPointFromToken(source) {

    const tokens = source.split(", ")
    
    const row = parseInt(tokens.pop().substr(2))
    const col = parseInt(tokens.pop().substr(2))
    
    return createPoint(row, col)
}

///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function calcManhattan(pointA, pointB) {

    return Math.abs(pointB.row - pointA.row) + Math.abs(pointB.col - pointA.col)
}

function isHiddenSpot(spot) {

    for (const sensor of SENSORS) {
    
        const distance = calcManhattan(sensor.position, spot)
        
        if (distance <= sensor.range) { return false }
    }
    return true
}

///////////////////////////////////////////////////////////

function findHiddenBeacon() {

    const ascendingLines = [ ] 
    
    const descendingLines = [ ]

    for (const sensor of SENSORS) {
    
        const top = sensor.position.row - sensor.range - 1 

        const bottom = sensor.position.row + sensor.range + 1
        
        //

        const topUp = top - sensor.position.col

        const topDown = top + sensor.position.col

        const bottomUp = bottom - sensor.position.col
        
        const bottomDown = bottom + sensor.position.col
        
        //
        
        if (! ascendingLines.includes(topUp)) { ascendingLines.push(topUp) }
        
        if (! ascendingLines.includes(bottomUp)) { ascendingLines.push(bottomUp) }
        
        if (! descendingLines.includes(topDown)) { descendingLines.push(topDown) }
        
        if (! descendingLines.includes(bottomDown)) { descendingLines.push(bottomDown) }
    }

    return findHiddenBeacon2(ascendingLines, descendingLines)  
}

function findHiddenBeacon2(ascendingLines, descendingLines)  {

    for (const asc of ascendingLines) {
    
        for (const des of descendingLines) { 
        
            const col = Math.floor((des - asc) / 2)

            const row = col + asc
            
            if (row < 0) { continue }
            if (col < 0) { continue }
            
            if (row > MAXDIM) { continue }
            if (col > MAXDIM) { continue }
            
            const spot = createPoint(row, col)

            if ( isHiddenSpot(spot)) { return spot }
        }
    }
}

///////////////////////////////////////////////////////////

main()

