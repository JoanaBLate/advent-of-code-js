"use strict"

// solving the puzzle takes (my computer) 0.028s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

const TABLE = [ ] // distance table

var HEIGHT = 0

var WIDTH = 0

var shallStop = false  

var numberOfSteps = 0


function main() {

    processInput()
    
    fillTable()
    
    fixOldHome()
    
    const home = fixAndFindNewHome()
        
    walk(home)
    
 // show()
        
    console.log("the answer is", numberOfSteps)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    
    WIDTH = MAP[0].length
}

function fillTable() {

    for (let row = 0; row < HEIGHT; row++) { TABLE.push(new Uint32Array(WIDTH)) }
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function fixOldHome() {

    const spot = find("S")
    
    replaceInMap(spot.row, spot.col, "a")
}

function fixAndFindNewHome() {

    const spot = find("E")
    
    replaceInMap(spot.row, spot.col, "z")
    
    return spot
}

function find(target) {

    for (let row = 0; row < HEIGHT; row++) {
        
        for (let col = 0; col < WIDTH; col++) {
        
            if (MAP[row][col] == target) { return createPoint(row, col) }
        }
    }
}

function replaceInMap(row, col, value) {

    const line = MAP[row].split("")
    
    line[col] = value
    
    MAP[row] = line.join("")
}

///////////////////////////////////////////////////////////

function walk(home) {

    let futureSpots = [ home ]
    
    let distance = 0
    
    while (true) {
    
        if (shallStop) { return }
    
        const currentSpots = futureSpots
        
        futureSpots = [ ]
        
        distance += 1
        
        for (const spot of currentSpots) {
        
            const row = spot.row
            const col = spot.col            
            
            const height = MAP[row][col].charCodeAt(0) 
            
            trySpot(height, distance, row - 1, col, futureSpots)
            trySpot(height, distance, row + 1, col, futureSpots)
            trySpot(height, distance, row, col - 1, futureSpots)
            trySpot(height, distance, row, col + 1, futureSpots)
        }
    }
}

function trySpot(height, distance, row, col, futureSpots) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    const thisDistance = TABLE[row][col]
    
    if (thisDistance != 0) {

        if (distance >= thisDistance) { return }
    }
    
    const symbol = MAP[row][col]
    
    const thisHeight = symbol.charCodeAt(0)
    
    if (height - thisHeight > 1) { return }
    
    if (symbol == "a") { numberOfSteps = distance; shallStop = true; return }
    
    TABLE[row][col] = distance
    
    futureSpots.push(createPoint(row,col))
}

///////////////////////////////////////////////////////////

function show() { // for the sample (small map)

    console.log("")
    
    for (const line of TABLE) {

        let s = ""
        
        for (const item of line) { s += item.toString().padStart(3) }
        
        console.log(s)    
    }
}

main()

