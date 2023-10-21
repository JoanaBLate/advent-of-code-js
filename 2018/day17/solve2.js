"use strict"

// solving the puzzle takes (my computer) 0.045s


// SET  shallDisplay=true  IF YOU WANT TO MONITORE THE STREAMS (step by step) //

// SET  shallOutputHydrology=true  IF YOU WANT A **large** TEXT FILE PRINTED WITH THE HYDROLOGY //


const ids = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const DATA = [ ]

var lowestRow =  9999
var greatestRow = 0
var greatestCol = 0

var WIDTH = 0
var HEIGHT = 0

const table = [ ]  // table of rows // (0 .)  (1 #)   (2 ~)   (3 |)  (9 +)  //

var streams = null

var round = 0

var shallDisplay = false

var shallOutputHydrology = false 

var minLeft = 99999999999999
var maxLeft = 0


function main() {

    processInput()

    greatestCol += 1 // '= 1' is necessary for function getLayerStatus
    
    WIDTH = greatestCol + 1 
    HEIGHT = greatestRow + 1
    
    for (let n = 0; n < HEIGHT; n++) { table.push(new Uint8Array(WIDTH)) }
    
    table[0][500] = 9 // spring
    
    for (const data of DATA) { markClayOnGrid(data) }
    
    //    
    streams = [ newStream(0, 500) ]
    
    while (true) {
        
        round += 1

        if (shallDisplay) { console.log("round:", round) }
        
        deleteDeadStreams()
        
        if (streams.length == 0) { break }
        
        const off = streams.length // this kind of loop avoids added new streams "playing twice" in their first round!!!
        
        for (let index = 0; index < off; index++) { runStream(streams[index]) }
        
        if (shallDisplay) { show(); prompt("Press ENTER") }
    }
    
    console.log("\nthe answer is", countWater())

    if (shallOutputHydrology) { outputHydrology() }
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
            
            if (value == 0)  { s += " " }
            else if (value == 1)  { s += "#" }
            else if (value == 2)  { s += "~" }
            else if (value == 3)  { s += "|" }
            else if (value == 9)  { s += "+" }
            else { s += "&" }
        }
        s += "\n"
    }
    Deno.writeTextFileSync("hydrology.txt", s)
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
     
        for (let y = data.yStart; y <= data.yEnd; y++) { table[y][data.xStart] = 1 }
   }
   else {
   
        for (let col = data.xStart; col <= data.xEnd; col++) { table[data.yStart][col] = 1 }
   }
}

function countWater() {

    let count = 0
    
    for (let index = lowestRow; index < table.length; index++) {
    
        const row = table[index]
    
        for (const cell of row) { if (cell == 2) { count += 1 } }
    }    
    return count
}

///////////////////////////////////////////////////////////

function newStream(row, col) {

    const id = ids[0]
    ids.push(ids.shift())
    
    if (shallDisplay) { console.log("Creating stream", id) }

    return { "id": id, "row": row, "col": col, "dead": false }
}

function deleteDeadStreams() {

    for (let index = streams.length - 1; index > -1; index--) {
    
        if (streams[index].dead) { streams.splice(index, 1) }
    }
}

///////////////////////////////////////////////////////////

function runStream(stream) { 

    // (0 .)  (1 #)   (2 ~)   (3 |)   (9 +) //

    if (shallDisplay) { console.log("Playing stream ", stream.id) }

    if (stream.row + 1 > greatestRow) { 
    
        stream.dead = true
        if (shallDisplay) { console.log("Killing stream ", stream.id) }    
        return 
    }
    
    if (stream.col < minLeft) { minLeft = stream.col }
    if (stream.col > maxLeft) { maxLeft = stream.col }
    
    const valueBelow = table[stream.row + 1][stream.col]
  
    if (valueBelow == 0) { 
        
        stream.row += 1
        table[stream.row][stream.col] = 3
        return
    }
    
    if (valueBelow == 3) { 
    
        stream.dead = true
        if (shallDisplay) { console.log("Killing stream ", stream.id) }    
        return 
    }
    
    // now valueBelow is 1 or 2    
    
    stream.dead = true
    if (shallDisplay) { console.log("Killing stream ", stream.id) }
    
    tryFlood(stream)
    
   // setting wet sand
    const row = stream.row
    const col = stream.col
    
    const leftStatus  = getLayerStatus(row, col, -1)
    const rightStatus = getLayerStatus(row, col, +1)
    
    for (let col = leftStatus.col; col <= rightStatus.col; col++) { table[row][col] = 3 } 
  
    if (! leftStatus.blocked) {

        const leftStream = newStream(row, leftStatus.col)
        streams.push(leftStream)
    }
    
    if (! rightStatus.blocked) {

        const rightStream = newStream(row, rightStatus.col)
        streams.push(rightStream)
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
    
    for (let col = leftStatus.col; col <= rightStatus.col; col++) { table[row][col] = 2 } 
                
    return true // flooded
}

function getLayerStatus(row, col, delta) {

    while (true) {
    
        col += delta
        
        if (col < 0  ||  col > greatestCol) { return { "col": col - delta, "blocked": true } }
        
        const side = table[row][col]
        
        if (side == 1  ||  side == 2) { return { "col": col - delta, "blocked": true } }
        
        const bottom = table[row + 1][col]
        
        if (bottom == 0  ||  bottom == 3) { return { "col": col, "blocked": false } }
    }
}

///////////////////////////////////////////////////////////

function show(index) {

    if (index == undefined) { index = getIndexOfTheLowestStream() }
    
    const guide = streams[index]

    const baseRow = Math.max(0, guide.row - 20)
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
            
            let gotStream = false 
            
            for (const stream of streams) {
            
                if (row == stream.row  &&  col == stream.col) { 
                
                    if (stream.dead) { continue }
                    
                    s += stream.id; gotStream = true }
            }
            
            if (gotStream) { continue }
            
            if (value == 0)  { s += "." }
            else if (value == 1)  { s += "#" }
            else if (value == 2)  { s += "~" }
            else if (value == 3)  { s += "|" }
            else if (value == 9)  { s += "+" }
            else { s += "&" }
        }
        console.log(s)
    }
    console.log("")
}

function getIndexOfTheLowestStream() {

    const lastIndex = streams.length - 1
    let chosenIndex = lastIndex
    let chosenBottom = 0
    
    for (let index = lastIndex - 1; index > -1; index--) {
    
        if (streams[index].row > chosenBottom) { chosenBottom = streams[index].row; chosenIndex = index }
    }
    return chosenIndex
}

main()

