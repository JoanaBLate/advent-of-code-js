"use strict"

// solving the puzzle takes (my computer) 0.036s

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
    
    const home = findHome()
    
    setHomeInMap(home)
    
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

function findHome() {

    for (let row = 0; row < HEIGHT; row++) {
        
        for (let col = 0; col < WIDTH; col++) {
        
            if (MAP[row][col] == "S") { return createPoint(row, col) }
        }
    }
}

function setHomeInMap(home) {

    const line = MAP[home.row].split("")
    
    line[home.col] = "a"
    
    MAP[home.row] = line.join("")
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
    
    if (symbol == "E") { 
    
        if ("z".charCodeAt(0) - height <= 1) { numberOfSteps = distance; shallStop = true }
        
        return
    }    
    
    const thisHeight = symbol.charCodeAt(0)
    
    if (thisHeight - height > 1) { return }
    
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

