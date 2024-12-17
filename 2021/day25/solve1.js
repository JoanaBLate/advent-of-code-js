"use strict"

// solving the puzzle takes (my computer) 0.075s

const input = Deno.readTextFileSync("input.txt").trim()

const EMPTY = 0
const TOEAST = 1
const TOSOUTH = 2

var HEIGHT = 0
var WIDTH = 0

const MAP = [ ]


function main() {

    processInput()

 // show()

    let count = 0
   
    while (true) {
   
        let moved = false 
        
        if (playRoundEast()) { moved = true }

        if (playRoundSouth()) { moved = true }
        
        count += 1
        
        if (! moved) { break }
    }
    
    console.log("the answer is", count)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    HEIGHT = lines.length
    
    WIDTH = lines[0].trim().length
    
    for (const line of lines) { 
            
        const array = new Uint8Array(WIDTH)
    
        for (let col = 0; col < WIDTH; col++) {
    
            if (line[col] == ">") { array[col] = TOEAST }
            if (line[col] == "v") { array[col] = TOSOUTH }    
        }
                
        MAP.push(array)
    }
}

///////////////////////////////////////////////////////////

function playRoundEast() {
    
    let moved = false
    
    for (let row = 0; row < HEIGHT; row++) {
    
        let lastArrivingCol = -1
    
        const mayTeleport = (MAP[row][0] == EMPTY)

        for (let col = 0; col < WIDTH; col++) {
        
            if (col == lastArrivingCol) { continue }

            if (MAP[row][col] != TOEAST) { continue }
            
            let newCol = col + 1
            
            if (newCol == WIDTH) { 
                
                if (! mayTeleport) { continue }
                
                newCol = 0 
            }
            
            if (MAP[row][newCol] != EMPTY) { continue }
            
            MAP[row][col] = EMPTY
            MAP[row][newCol] = TOEAST 
            
            lastArrivingCol = newCol
            moved = true           
        }
    }
    
    return moved
}

///////////////////////////////////////////////////////////

function playRoundSouth() {
    
    let moved = false
    
    for (let col = 0; col < WIDTH; col++) {
    
        let lastArrivingRow = -1
    
        const mayTeleport = (MAP[0][col] == EMPTY)

        for (let row = 0; row < HEIGHT; row++) {
        
            if (row == lastArrivingRow) { continue }

            if (MAP[row][col] != TOSOUTH) { continue }
            
            let newRow = row + 1
            
            if (newRow == HEIGHT) { 
                
                if (! mayTeleport) { continue }
                
                newRow = 0 
            }
            
            if (MAP[newRow][col] != EMPTY) { continue }
            
            MAP[row][col] = EMPTY
            MAP[newRow][col] = TOSOUTH 
            
            lastArrivingRow = newRow
            moved = true           
        }
    }
    
    return moved
}

///////////////////////////////////////////////////////////

function show() {

    console.log("")
    
    for (const line of MAP) {
    
        let s = ""
        
        for (const item of line) { s += " " + ".>v"[item] }
    
        console.log(s)
    }
}

main()

