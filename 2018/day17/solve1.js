"use strict"

// solving the puzzle takes (my computer) 0.045s


// SET  shallDisplay=true  IF YOU WANT TO MONITOR THE STREAMS (step by step) //

// SET  shallOutputHydrology=true  IF YOU WANT A TEXT FILE PRINTED WITH THE HYDROLOGY //


const ids = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const DATA = [ ]

var lowestRow =  9999
var greatestRow = 0
var greatestCol = 0

var WIDTH = 0
var HEIGHT = 0

const table = [ ] 

const VIRGIN = 0
const CLAY = 1
const WATER = 2
const WETSAND = 3
const SPRING = 9

var currentStreams = null

var futureStreams = [ newStream(0, 500) ]

var round = 0

var shallDisplay = false

var shallOutputHydrology = false 

var minLeft = 99999999999999
var maxLeft = 0

var preferredId = "0" // for smoother (function) show


function main() {

    processInput()

    greatestCol += 1 // '= 1' is necessary for function getLayerStatus
    
    WIDTH = greatestCol + 1 
    HEIGHT = greatestRow + 1
    
    for (let n = 0; n < HEIGHT; n++) { table.push(new Uint8Array(WIDTH)) }
    
    table[0][500] = SPRING
    
    for (const data of DATA) { markClayOnGrid(data) }
    
    //    
    while (true) {
        
        round += 1

        if (shallDisplay) { console.log("round:", round) }
        
        currentStreams = futureStreams
        futureStreams = [ ]
        
        if (currentStreams.length == 0) { break }
        
        for (const stream of currentStreams) { runStream(stream) }
        
        if (shallDisplay) { show(); prompt("Press ENTER") }
    }
    
    console.log("\nthe answer is", countWater())

    if (shallOutputHydrology) { outputHydrology() }
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()   

    const lines = input.split("\n")
    
    for (const line of lines) { 
           
        const data = { "xStart": 0, "xEnd": 0, "yStart": 0, "yEnd": 0 } 
        
        DATA.push(data)
    
        const tokens = line.trim().split(", ")
        
        if (tokens[0][0] == "x") { fillDataXFirst(data, tokens) } else { fillDataYFirst(data, tokens) }

        if (data.yStart < lowestRow) { lowestRow = data.yStart } 
        if (data.yEnd   < lowestRow) { lowestRow = data.yEnd } 

        if (data.xStart > greatestCol) { greatestCol = data.xStart }
        if (data.xEnd   > greatestCol) { greatestCol = data.xEnd }        
        
        if (data.yStart > greatestRow) { greatestRow = data.yStart } 
        if (data.yEnd >   greatestRow) { greatestRow = data.yEnd } 
    }
}

function fillDataXFirst(data, segments) {

   data.xStart = parseInt(segments.shift().replace("x=", ""))
   data.xEnd = data.xStart
   
   const tokens = segments.shift().replace("y=", "").split("..")
   
   data.yStart = parseInt(tokens.shift())
   data.yEnd = parseInt(tokens.shift())
}

function fillDataYFirst(data, segments) {
   
   data.yStart = parseInt(segments.shift().replace("y=", ""))
   data.yEnd = data.yStart
   
   const tokens = segments.shift().replace("x=", "").split("..")
   
   data.xStart = parseInt(tokens.shift())
   data.xEnd = parseInt(tokens.shift())
}

///////////////////////////////////////////////////////////

function markClayOnGrid(data) {
   
   if (data.xStart == data.xEnd) {
     
        for (let y = data.yStart; y <= data.yEnd; y++) { table[y][data.xStart] = CLAY }
   }
   else {
   
        for (let col = data.xStart; col <= data.xEnd; col++) { table[data.yStart][col] = CLAY }
   }
}

function countWater() {

    let count = 0
    
    for (let index = lowestRow; index < table.length; index++) {
    
        const row = table[index]
    
        for (const cell of row) { if (cell == WATER  ||  cell == WETSAND) { count += 1 } }
    }    
    return count
}

///////////////////////////////////////////////////////////

function newStream(row, col) {

    const id = ids[0] // id is only used by (function) show 
    ids.push(ids.shift())
    
    if (shallDisplay) { console.log("Creating stream", id) }

    return { "id": id, "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function runStream(stream) { 

    if (shallDisplay) { console.log("Playing stream ", stream.id) }

    if (stream.row + 1 > greatestRow) { 
    
        if (shallDisplay) { console.log("Killing stream ", stream.id) }    
        return 
    }
    
    if (stream.col < minLeft) { minLeft = stream.col }
    if (stream.col > maxLeft) { maxLeft = stream.col }
    
    const valueBelow = table[stream.row + 1][stream.col]
  
    if (valueBelow == VIRGIN) { 
        
        stream.row += 1
        table[stream.row][stream.col] = WETSAND
        futureStreams.push(stream)
        return
    }

    if (valueBelow == WETSAND) { // happens sometimes
    
        if (shallDisplay) { console.log("Killing stream ", stream.id) } // cell already walked
        return 
    }
    
    if (shallDisplay) { console.log("Killing stream ", stream.id) }
 
    runStream2(stream)
}

function runStream2(stream) { 
    
    // now valueBelow is CLAY or WATER

    tryFlood(stream)
    
    // setting wet sand
    const row = stream.row
    const col = stream.col
    
    const leftStatus  = getLayerStatus(row, col, -1)
    const rightStatus = getLayerStatus(row, col, +1)
    
    const leftEnd = table[row][leftStatus.col]   // before applying wet sand to layer
    const rightEnd = table[row][rightStatus.col] // before applying wet sand to layer
    
    for (let col = leftStatus.col; col <= rightStatus.col; col++) { table[row][col] = WETSAND } 

    // new streams    
    
    let heritageOk = (preferredId == stream.id)
    
    if (! leftStatus.blocked  &&  leftEnd == VIRGIN) {

        const leftStream = newStream(row, leftStatus.col)
        
        futureStreams.push(leftStream)
        
        if (heritageOk) { preferredId = leftStream.id; heritageOk = false }
    }
    
    if (! rightStatus.blocked  &&  rightEnd == VIRGIN) {

        const rightStream = newStream(row, rightStatus.col)
        
        futureStreams.push(rightStream)
        
        if (heritageOk) { preferredId = rightStream.id }
    }   
}
 
///////////////////////////////////////////////////////////

function tryFlood(stream) { 

    while (true) {
    
        const flooded = tryFloodOneLayer(stream.row, stream.col)
        
        if (! flooded) { return }
        
        stream.row -= 1 
    }
}   

function tryFloodOneLayer(row, col) {
    
    const leftStatus  = getLayerStatus(row, col, -1)
    const rightStatus = getLayerStatus(row, col, +1)
    
    if (! leftStatus.blocked) { return false } // flowing
    if (! rightStatus.blocked) { return false } // flowing
    
    for (let col = leftStatus.col; col <= rightStatus.col; col++) { table[row][col] = WATER } 
                
    return true // flooded
}

function getLayerStatus(row, col, delta) {

    while (true) {
    
        col += delta
        
        if (col < 0  ||  col > greatestCol) { return { "col": col - delta, "blocked": true } }
        
        const side = table[row][col]
        
        if (side == CLAY  ||  side == WATER) { return { "col": col - delta, "blocked": true } }
        
        const bottom = table[row + 1][col]
        
        if (bottom == VIRGIN  ||  bottom == WETSAND) { return { "col": col, "blocked": false } }
    }
}

///////////////////////////////////////////////////////////

function show() {

    const guide = currentStreams[indexOfPreferredStream()]

    const baseRow = Math.max(0, guide.row - 10)
    const baseCol = Math.max(0, guide.col - 50)

    console.log("")
    
    for (let r = 0; r < 30; r++) {
    
        const row = baseRow + r
        const cells = table[row]
    
        if (cells == undefined) { break }
    
        let s = ""
     
        for (let c = 0; c < 100; c++) {

            const col = baseCol + c
            const value = cells[col]
            if (value == undefined) { break }
            
            let gotCurrentStream = false 
            
            for (const stream of currentStreams) {
            
                if (row == stream.row  &&  col == stream.col) { s += stream.id; gotCurrentStream = true }
            }            
            if (gotCurrentStream) { continue }
            
            
            let gotFutureStream = false 
            
            for (const stream of futureStreams) {
            
                if (row == stream.row  &&  col == stream.col) { s += stream.id; gotFutureStream = true }
            }            
            if (gotFutureStream) { continue }
            
            if (value == VIRGIN)       { s += "." }
            else if (value == CLAY)    { s += "#" }
            else if (value == WATER)   { s += "~" }
            else if (value == WETSAND) { s += "|" }
            else if (value == SPRING)  { s += "+" }
            else { s += "&" }
        }
        console.log(s)
    }
    console.log("")
}

function indexOfPreferredStream() {
    
    for (let index = 0; index < futureStreams.length; index++) {
    
        if (futureStreams[index].id == preferredId) { return index }
    }
    return 0
}

///////////////////////////////////////////////////////////

function outputHydrology() {

    const start = minLeft - 2
    const end = maxLeft + 20
    
    console.log("output: minLeft, maxLeft =", minLeft, maxLeft)

    let s = ""

    for (const row of table) {
        
        for (let col = start; col <= end; col++) {
        
            const value = row[col]
            
            if (value == VIRGIN)       { s += " " }
            else if (value == CLAY)    { s += "#" }
            else if (value == WATER)   { s += "~" }
            else if (value == WETSAND) { s += "|" }
            else if (value == SPRING)  { s += "+" }
            else { s += "&" }
        }
        s += "\n"
    }
    Deno.writeTextFileSync("hydrology.txt", s)
}

main()

