"use strict"

// solving the puzzle takes (my computer) 0.031s

const input = Deno.readTextFileSync("input.txt").trimEnd()

const MAP = [ ]

var PATH = ""

var WIDTH = 0

var HEIGHT = 0

var ROW = 0
var COL = 0

var FACING = "east"


function main() {

    processInput()
    
    COL = MAP[0].indexOf(".")

    while (PATH != "") { walk() }
    
    //
    
    const row = ROW + 1 // base one
    
    const col = COL + 1 // base one
    
    const facing = [ "east", "south", "west", "north" ].indexOf(FACING)
    
    console.log("the answer is", 1000 * row + 4 * col + facing)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")
    
    PATH = parts.pop().trim()
    
    const lines = parts.shift().split("\n")
    
    for (const _line of lines) { 
        
        const line = _line.trimEnd()
        
        if (line == "") { continue }
        
        if (line.length > WIDTH) { WIDTH = line.length }
        
        MAP.push(line) 
    }
       
    HEIGHT = MAP.length
    
    for (let row = 0; row < HEIGHT; row++) { MAP[row] = MAP[row].padEnd(WIDTH, " ") }
}

///////////////////////////////////////////////////////////

function walk() {

    if (PATH[0] == "L") { PATH = PATH.substr(1); spinLeft(); return }

    if (PATH[0] == "R") { PATH = PATH.substr(1); spinRight(); return }

    let s = ""
    
    while (PATH != "") {
    
        if (PATH[0] == "L") { break }
        if (PATH[0] == "R") { break }
    
        s += PATH[0]
        
        PATH = PATH.substr(1)    
    }

    if (s == "") { return }

    move(parseInt(s))
}

///////////////////////////////////////////////////////////

function spinLeft() {

    if (FACING == "north") { FACING = "west"; return }
    if (FACING == "west")  { FACING = "south"; return }
    if (FACING == "south") { FACING = "east"; return }
    if (FACING == "east")  { FACING = "north"; return }
}

function spinRight() {

    if (FACING == "north") { FACING = "east"; return }
    if (FACING == "east")  { FACING = "south"; return }
    if (FACING == "south") { FACING = "west"; return }
    if (FACING == "west")  { FACING = "north"; return }
} 

function move(steps) {

    if (FACING == "north") { moveNorth(steps) }

    if (FACING == "south") { moveSouth(steps) }

    if (FACING == "west")  { moveWest(steps) }

    if (FACING == "east")  { moveEast(steps) }
}

///////////////////////////////////////////////////////////

function moveNorth(steps) {

    while (steps > 0) {
    
        steps -= 1
    
        let row = ROW - 1
        
        if (row < 0) { row = findEndOfCol(row, COL) }
            
        if (MAP[row][COL] == " ") { row = findEndOfCol(row, COL) }
            
        if (MAP[row][COL] == "#") { return }
            
        ROW = row 
    }
}

function moveSouth(steps) {

    while (steps > 0) {
    
        steps -= 1
    
        let row = ROW + 1
        
        if (row > HEIGHT - 1) { row = findStartOfCol(row, COL) }
            
        if (MAP[row][COL] == " ") { row = findStartOfCol(row, COL) }
            
        if (MAP[row][COL] == "#") { return }
            
        ROW = row 
    }
}

function moveWest(steps) {

    while (steps > 0) {
    
        steps -= 1
    
        let col = COL - 1
        
        if (col < 0) { col = findEndOfRow(ROW, col) }
            
        if (MAP[ROW][col] == " ") { col = findEndOfRow(ROW, col) }
            
        if (MAP[ROW][col] == "#") { return }
            
        COL = col 
    }
}

function moveEast(steps) {

    while (steps > 0) {
    
        steps -= 1
    
        let col = COL + 1
        
        if (col > WIDTH - 1) { col = findStartOfRow(ROW, col) }
            
        if (MAP[ROW][col] == " ") { col = findStartOfRow(ROW, col) }
            
        if (MAP[ROW][col] == "#") { return }
            
        COL = col 
    }
}

///////////////////////////////////////////////////////////

function findStartOfRow(row, col) {

    while (col > 0) {
    
        col -= 1
        
        if (MAP[row][col] == " ") { return col + 1 }
    }
    return 0
}

function findEndOfRow(row, col) {

    while (col < WIDTH - 1) {
    
        col += 1
        
        if (MAP[row][col] == " ") { return col - 1 }
    }
    return WIDTH - 1
}

function findStartOfCol(row, col) {

    while (row > 0) {
    
        row -= 1
        
        if (MAP[row][col] == " ") { return row + 1 }
    }
    return 0
}

function findEndOfCol(row, col) {

    while (row < HEIGHT - 1) {
    
        row += 1
        
        if (MAP[row][col] == " ") { return row - 1 }
    }
    return HEIGHT - 1
}

///////////////////////////////////////////////////////////

main()

