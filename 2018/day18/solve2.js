"use strict"

// solving the puzzle takes (my computer) 0.540s

// we must find a repeating pattern //

const table = [ ]

var reference = [ ]

var rowLength = 0

var round = 0

const OPEN = "."
const WOODED = "|"
const LUMBERYARD = "#"

function main() {

    processInput()
    
    rowLength = table[0].length
    
    while (round < 1000) { runOneRound() } // waiting for the birth of the repeating pattern
    
    //
    const model = reference.join("")
     
    while (true) { 
    
        runOneRound() 
        
        if (model == reference.join("")) { break }
    }
    
    const lengthOfLoop = round - 1000
    
    let missing  = (1000000000 - round) % lengthOfLoop
    
    while (missing > 0) {
    
        runOneRound()
        missing -= 1
    }
    
    //
    let wooded = 0
    let lumberyard = 0
    
    for (const line of table) {
    
        for (const cell of line) {
        
            if (cell == WOODED) { wooded += 1 }
            if (cell == LUMBERYARD) { lumberyard += 1 }  
        }
    }
    
    console.log("the answer is", wooded * lumberyard)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        table.push(line.trim().split(""))
    }
}

function runOneRound() {

    round += 1
    
    reference = [ ]
    
    for (const line of table) { reference.push(line.join("")) }   
    
    for (let row = 0; row < table.length; row++) {
    
        for (let col = 0; col < rowLength; col++) {
    
            updateCell(row, col)
        }
    }
}

function updateCell(row, col) {

    const neighbors = { "open": 0, "wooded": 0, "lumberyard": 0 }
    
    collect(neighbors, row-1, col-1)
    collect(neighbors, row-1, col)
    collect(neighbors, row-1, col+1)
    
    collect(neighbors, row, col-1)
    collect(neighbors, row, col+1)
    
    collect(neighbors, row+1, col-1)
    collect(neighbors, row+1, col)
    collect(neighbors, row+1, col+1)
    //
    
    const cell = reference[row][col]
    
    if (cell == OPEN) {
    
        if (neighbors.wooded >= 3) { table[row][col] = WOODED }
        return
    }
    
    if (cell == WOODED) {
    
        if (neighbors.lumberyard >= 3) { table[row][col] = LUMBERYARD }
        return
    }
    
    if (cell == LUMBERYARD) {
    
        if (neighbors.lumberyard < 1) { table[row][col] = OPEN; return }
 
        if (neighbors.wooded < 1) { table[row][col] = OPEN; return }
        return
    }
}

function collect(data, row, col) {

    const line = reference[row]
    
    if (line == undefined) { return }
    
    const cell = line[col]
 
    if (cell == "") { return }
    
    if (cell == OPEN) { data.open += 1; return }
    if (cell == WOODED) { data.wooded += 1; return }
    if (cell == LUMBERYARD) { data.lumberyard += 1; return }
}

main()

