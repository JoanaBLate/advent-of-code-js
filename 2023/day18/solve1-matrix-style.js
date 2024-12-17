"use strict"

// solving the puzzle takes (my computer) 0.040s

// not using any math theorem!

const DATA = [ ]

const dict = { }  // row~col: color

var row = 0

var col = 0

var smallestRow = 0

var biggestRow = 0

var smallestCol = 0

var biggestCol = 0

var width = 0

var height = 0

const map = [ ]


function main() {

    processInput()
    
    digAll() 
    
    setMap()   
    
    rawFloodOutside() // 3ms

    floodPuddles() // 5ms

    // showMap()

    console.log("the answer is", countTranches())    
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const direction = tokens.shift()
        
        const amount = parseInt(tokens.shift())
        
        DATA.push({ "direction": direction, "amount": amount })
    }
}

function digAll() {

    for (const data of DATA) { dig(data) }
    
    width = biggestCol - smallestCol + 1
    
    height = biggestRow - smallestRow + 1
}    

function dig(data) {

    for (let n = 0; n < data.amount; n++) {
    
        if (data.direction == "U") { row -= 1 }

        if (data.direction == "D") { row += 1 }

        if (data.direction == "L") { col -= 1 }

        if (data.direction == "R") { col += 1 }
        
        dict[row + "~" + col] = true   
        
        if (row > biggestRow) { biggestRow = row }
        if (col > biggestCol) { biggestCol = col }
        
        if (row < smallestRow) { smallestRow = row }
        if (col < smallestCol) { smallestCol = col }
    }
}

///////////////////////////////////////////////////////////////////////////////

function setMap() {

    for (let n = 0; n < height; n++) {
    
        const arr = new Array(width)
        
        arr.fill(".")
        
        map.push(arr)     
    }
    
    for (const key of Object.keys(dict)) {
    
        const rawCoords = key.split("~")
        
        const row = parseInt(rawCoords.shift()) - smallestRow
        const col = parseInt(rawCoords.shift()) - smallestCol
        
        map[row][col] = "#"    
    }
}

function showMap() {

    console.log("")

    for (const line of map) { console.log(line.join("")) }

    console.log("")
}

///////////////////////////////////////////////////////////

function rawFloodOutside() {

    for (let row = 0; row < height; row++) {
    
        floodBorderPoint(row, 0, 0, +1)
        floodBorderPoint(row, width - 1, 0, -1)
    }

    for (let col = 0; col < width; col++) { 

        floodBorderPoint(0, col, +1, 0)
        floodBorderPoint(height - 1, col, -1, 0)
    }
}

function floodBorderPoint(_row, _col, deltaRow, deltaCol) {

    let row = _row
    let col = _col

    while (true) {
    
        if (row < 0) { return }
        if (col < 0) { return }
        if (row > height + 1) { return }
        if (col > width  + 1) { return }
    
        if (map[row][col] == "#") { return }
        
        map[row][col] = "@"
        
        row += deltaRow
        col += deltaCol    
    }
}

///////////////////////////////////////////////////////////

function floodPuddles() {

    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) { 
        
            if ( isPuddle(row, col)) { floodPuddle(row, col) }
        }
    }
}

function isPuddle(row, col) {

    if (map[row][col] != ".") { return false }
    
    if (isOutsider(row, col - 1)) { return true }
    if (isOutsider(row, col + 1)) { return true }
    if (isOutsider(row - 1, col)) { return true }
    if (isOutsider(row + 1, col)) { return true }
    
    return false
}

function isOutsider(row, col) {

    if (row < 0) { return false }
    if (col < 0) { return false }
    if (row > height + 1) { return false }
    if (col > width  + 1) { return false }

    return map[row][col] == "@"
}

function floodPuddle(row, col) {

    map[row][col] = "@"
    
    let futurePoints = [ createPoint(row, col) ]
    
    while (futurePoints.length != 0) {
    
        const currentPoints = futurePoints
        
        futurePoints = [ ]
        
        for (const point of currentPoints) {
        
            processPoint(point, 0, -1)
            processPoint(point, 0, +1)
            processPoint(point, -1, 1)
            processPoint(point, +1, 1)
        }    
    }
    
    function processPoint(point, deltaRow, deltaCol) {
    
        const row = point.row + deltaRow
        const col = point.col + deltaCol
        
        if (row < 0) { return }
        if (col < 0) { return }
        if (row > height + 1) { return }
        if (col > width  + 1) { return }
        
        if (map[row][col] != ".") { return }
        
        map[row][col] = "@"
        
        futurePoints.push(createPoint(row, col))
    }
}

///////////////////////////////////////////////////////////

function countTranches() {

    let count = 0
    
    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) { 
        
            if (map[row][col] != "@") { count += 1 }
        }
    }
    return count
}
        
///////////////////////////////////////////////////////////        
        
function createPoint(row, col) {

    return { "row": row, "col": col }
}

main()

