"use strict"

// solving the puzzle takes (my computer) 0.110s

const input = Deno.readTextFileSync("input.txt").trim()

const EMPTY = 0
const TOEAST = 1
const TOSOUTH = 2

var HEIGHT = 0
var WIDTH = 0

const MAP = [ ]

const ALLOWED = [ ]

const l = console.log


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
    
        ALLOWED.push(new Uint8Array(WIDTH))
    }
}

///////////////////////////////////////////////////////////

function playRoundEast() {
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            if (MAP[row][col] == TOEAST) { tryReserveToEast(row, col) }
        }
    }
    
    let moved = false
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            if (ALLOWED[row][col] == 1) { moveToEast(row, col); moved = true }
        }
    }
    return moved
}

function tryReserveToEast(row, col) {

    const _row = row
    const _col = col

    col += 1
    
    if (col == WIDTH) { col = 0 }
    
    if (MAP[row][col] == EMPTY) { ALLOWED[_row][_col] = 1 }
}

function moveToEast(row, col) {
    
    ALLOWED[row][col] = 0

    MAP[row][col] = EMPTY

    col += 1
    
    if (col == WIDTH) { col = 0 }
    
    MAP[row][col] = TOEAST
}

///////////////////////////////////////////////////////////

function playRoundSouth() {
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            if (MAP[row][col] == TOSOUTH) { tryReserveToSouth(row, col) }
        }
    }
    
    let moved = false
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {

            if (ALLOWED[row][col] == 1) { moveToSouth(row, col); moved = true }
        }
    }
    return moved
}

function tryReserveToSouth(row, col) {

    const _row = row
    const _col = col

    row += 1
    
    if (row == HEIGHT) { row = 0 }
    
    if (MAP[row][col] == EMPTY) { ALLOWED[_row][_col] = 1 }
}

function moveToSouth(row, col) {
    
    ALLOWED[row][col] = 0

    MAP[row][col] = EMPTY

    row += 1
    
    if (row == HEIGHT) { row = 0 }
    
    MAP[row][col] = TOSOUTH
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

