"use strict"

// solving the puzzle takes (my computer) 0.105s

const DATA = [ ]

const census = [ ]

var width = 0
var height = 0


function main() {

    processInput()
    
    for (let n = 0; n < height; n++) { census.push(new Uint8Array(width)) }
    
    runTillStopChanging()     
     
    console.log("the answer is", countOccupiedSeats())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim().split("")) }
    
    height = DATA.length
    width  = DATA[0].length
}

///////////////////////////////////////////////////////////

function runTillStopChanging() {
    
    let lastState = dataToString()
    
    while (true) {
    
        realizeCensus()
        repopulate()
        
        const currentState = dataToString()
        
        if (currentState == lastState) { break } 
        
        lastState  = currentState    
    }
}

function realizeCensus() {
    
    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) {

            let count = 0
            
            count += countNeighbor(row, col, -1, -1)
            count += countNeighbor(row, col, -1,  0)
            count += countNeighbor(row, col, -1, +1)
            
            count += countNeighbor(row, col,  0, -1)
            // skips own position
            count += countNeighbor(row, col,  0, +1)

            count += countNeighbor(row, col, +1, -1)
            count += countNeighbor(row, col, +1,  0)
            count += countNeighbor(row, col, +1, +1)          
            
            census[row][col] = count
        }
    }
}

function countNeighbor(row, col, deltaRow, deltaCol) {

    while (true) {
    
        row += deltaRow
        col += deltaCol
        
        if (row < 0) { return 0 }
        if (col < 0) { return 0 }
        
        if (row > height - 1) { return 0 }
        if (col > width - 1)  { return 0 }
        
        const item = DATA[row][col]
        
        if (item == "L") { return 0 }
        if (item == "#") { return 1 }
    }
}

function repopulate() {

    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) {
        
            const item = DATA[row][col]
            
            if (item == "L") {
            
                if (census[row][col] == 0) { DATA[row][col] = "#" }
                
                continue             
            }
            
            if (item == "#") {
            
                if (census[row][col] >= 5) { DATA[row][col] = "L" }
                
                continue             
            }        
        }        
    }
}

///////////////////////////////////////////////////////////

function dataToString() {

    let s = ""
    
    for (const line of DATA) { s += line.join("") }

    return s
}

function countOccupiedSeats() {

    let count = 0
    
    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) {
     
            if (DATA[row][col] == "#") { count += 1 }
        }
    }
    return count
}

main()

