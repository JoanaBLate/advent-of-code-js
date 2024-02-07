"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const targetRow = 2000000

const freeSegments = [ ]

const matchCols = { }


function main() {

    processInput()
    
    for (const data of DATA) { analyse(data) }
    
    sortFreeSegments()

    console.log("the answer is", countFreeSpots())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(": closest beacon is at ")
        
        const sensor = createPointFromToken(parts.shift().replace("Sensor at ", ""))
        
        const beacon = createPointFromToken(parts.shift())
        
        const distance = calcManhattan(sensor, beacon)
        
        DATA.push({ "sensor": sensor, "beacon": beacon, "distance": distance })
    }
}

function createPointFromToken(source) {

    const tokens = source.split(", ")
    
    const row = parseInt(tokens.pop().substr(2))
    const col = parseInt(tokens.pop().substr(2))
    
    return createPoint(row, col)
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function calcManhattan(pointA, pointB) {

    return Math.abs(pointB.row - pointA.row) + Math.abs(pointB.col - pointA.col)
}

///////////////////////////////////////////////////////////

function analyse(data) {

    const distanceToTargetRow = Math.abs(data.sensor.row - targetRow)
    
    const remainingDistance = data.distance - distanceToTargetRow
    
    if (remainingDistance < 0) { return }
    
    const startCol = data.sensor.col - remainingDistance
    
    const endCol = data.sensor.col + remainingDistance
    
    freeSegments.push({ "startCol": startCol, "endCol": endCol })
    
    if (data.beacon.row == targetRow) { matchCols[data.beacon.col] = true }
}

///////////////////////////////////////////////////////////

function sortFreeSegments() {

    let index = -1
    
    while (true) {
    
        index += 1
        
        const a = freeSegments[index]
        const b = freeSegments[index + 1]
        
        if (b == undefined) { return }
        
        if (a.startCol <= b.startCol) { continue }
        
        freeSegments[index] = b
        freeSegments[index + 1] = a
        
        index -= 2

        if (index < -1) { index = -1 }
    }        
}

///////////////////////////////////////////////////////////

function countFreeSpots() {
    
    const first = freeSegments.shift()
    
    let freePoints = first.endCol - first.startCol + 1
    
    let lastCol = first.endCol

    while (freeSegments.length != 0) {
   
        const segment = freeSegments.shift()
        
        const firstCol = Math.max(segment.startCol, lastCol + 1)
        
        if (firstCol > segment.endCol) { continue }
        
        lastCol = segment.endCol
        
        freePoints += lastCol - firstCol + 1
    }
        
    freePoints -= Object.keys(matchCols).length
    
    return freePoints
}

main()

