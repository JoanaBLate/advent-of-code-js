"use strict"

// solving the puzzle takes (my computer) 0.028s

const NORTH = 1
const SOUTH = 2
const WEST  = 3
const EAST  = 4

const map = [ ]

var width = 0

var height = 0

var tableNorth = [ ]
var tableSouth = [ ]
var tableWest  = [ ]
var tableEast  = [ ]

const beams = [ createBeam(0, 0, EAST) ]


function main() {

    processInput()
    
    tableNorth = new Uint8Array(width * height)
    tableSouth = new Uint8Array(width * height)
    tableWest  = new Uint8Array(width * height)
    tableEast  = new Uint8Array(width * height)
    
    tableEast[0] = 1
    
  // show()
  
    while (beams.length > 0) { walk(beams[0]) }
    
    console.log("the answer is", sumTables())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
            
    const lines = input.split("\n")
    
    for (const line of lines) { map.push(line.trim()) }
    
    height = map.length
    
    width = map[0].length
}

function createBeam(row, col, direction) {

    return { "row": row, "col": col, "direction": direction }
}

function walk(beam) {

 // console.log(beam)
    
    updateBeamDirection(beam)

    if (beam.direction == NORTH) { beam.row -= 1 }
    if (beam.direction == SOUTH) { beam.row += 1 }
    if (beam.direction == EAST)  { beam.col += 1 }
    if (beam.direction == WEST)  { beam.col -= 1 }

    if (beam.row < 0) { beams.shift(); return }
    if (beam.col < 0) { beams.shift(); return }

    if (beam.row > height - 1) { beams.shift(); return }
    if (beam.col > width - 1)  { beams.shift(); return }
    
    const table = getTable(beam.direction)
    
    const position = beam.row * width + beam.col
    
    if (table[position] != 0) { beams.shift(); return }
    
    table[position] = 1
}

function updateBeamDirection(beam) {
    
    const symbol = map[beam.row][beam.col]
    
    if (symbol == ".") { return }
    
    if (symbol == "\\") { 
    
        if (beam.direction == NORTH) { beam.direction = WEST; return }
        if (beam.direction == SOUTH) { beam.direction = EAST; return }
        if (beam.direction == EAST)  { beam.direction = SOUTH; return }
        if (beam.direction == WEST)  { beam.direction = NORTH; return }
    }
    
    if (symbol == "/") { 
    
        if (beam.direction == NORTH) { beam.direction = EAST; return }
        if (beam.direction == SOUTH) { beam.direction = WEST; return }
        if (beam.direction == EAST)  { beam.direction = NORTH; return }
        if (beam.direction == WEST)  { beam.direction = SOUTH; return }
    }
    
    if (symbol == "-") { 
    
        if (beam.direction == EAST)  { return }
        if (beam.direction == WEST)  { return }
        
        beam.direction = EAST
                
        beams.push(createBeam(beam.row, beam.col, WEST))
    }
    
    if (symbol == "|") { 
    
        if (beam.direction == NORTH)  { return }
        if (beam.direction == SOUTH)  { return }
        
        beam.direction = NORTH
        
        beams.push(createBeam(beam.row, beam.col, SOUTH))
    }
}

function getTable(direction) {

    if (direction == NORTH) { return tableNorth }
    if (direction == SOUTH) { return tableSouth }
    if (direction == WEST)  { return tableWest }
    if (direction == EAST)  { return tableEast }
}

function sumTables() {

    let sum = 0
    
    const off = width * height 
    
    for (let n = 0; n < off; n++) {
    
        if (tableNorth[n] == 1) { sum += 1; continue }
        if (tableSouth[n] == 1) { sum += 1; continue }
        if (tableWest[n] == 1)  { sum += 1; continue }
        if (tableEast[n] == 1)  { sum += 1; continue }
    }
    return sum
}

function show() {

    for (const line of map) { console.log (" " + line) }
}

main()

