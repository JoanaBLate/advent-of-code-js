"use strict"

// solving the puzzle takes (my computer) 0.150s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

const MARGIN = 80 // **WARNING** -> arbitary value (tested for *MY* input)

var WIDTH = 0

var HEIGHT = 0

const ELVES = [ ]

const CHOSEN = [ ]

const DIRECTIONS = [ "north", "south", "west", "east" ]

var MOVING = false


function main() {

    const stringMap = processInput()
    
    fillChosen()
    
    createMapAndFillElves(stringMap)
    
    let n = 0
    
    while (true) {
    
        n += 1
        
        playRound()
        
        if (! MOVING) { break }   
    }

 // show()
    
   console.log("the answer is", n)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const map = [ ]    
        
    const lines = input.split("\n")
    
    const originalWidth = lines[0].trim().length
    
    const sideMargin = ".".repeat(MARGIN)
    
    const verticalMargin = ".".repeat(MARGIN + originalWidth + MARGIN)
    
    for (let n = 0; n < MARGIN; n++) { map.push(verticalMargin) }
    
    for (const line of lines) { 
    
        map.push(sideMargin + line.trim() + sideMargin)
    }
    
    for (let n = 0; n < MARGIN; n++) { map.push(verticalMargin) }
    
    HEIGHT = map.length
    WIDTH = map[0].length
    
    return map
}

///////////////////////////////////////////////////////////

function fillChosen() {

    for (let row = 0; row < HEIGHT; row++) { CHOSEN.push(new Uint8Array(WIDTH)) }
}

function resetChosen() {

    for (const array of CHOSEN) {
    
        for (let col = 0; col < WIDTH; col++) { array[col] = 0 }
    }
}

///////////////////////////////////////////////////////////
    
function createMapAndFillElves(stringMap) {

    for (let row = 0; row < HEIGHT; row++) {
    
        const array = new Uint8Array(WIDTH)
        
        MAP.push(array)    
    
        const stringLine = stringMap[row]
        
        for (let col = 0; col < WIDTH; col++) { 
        
            if (stringLine[col] != "#") { continue }

            const elf = createElf(row, col)
            
            ELVES.push(elf)

            array[col] = 1
        }        
    }
}

function createElf(row, col) {

    return { "row": row, "col": col, "chosenRow": 0, "chosenCol": 0, "moving": false }
}

///////////////////////////////////////////////////////////

function playRound() {

    MOVING = false

    resetChosen()
    
    for (const elf of ELVES) { chooseSpot(elf) }
    
    for (const elf of ELVES) { moveElf(elf) }
    
    DIRECTIONS.push(DIRECTIONS.shift())
}

///////////////////////////////////////////////////////////

function chooseSpot(elf) {

    elf.moving = false
    
    const row = elf.row
    const col = elf.col
    
    const nw = MAP[row - 1][col - 1]
    const n  = MAP[row - 1][col]
    const ne = MAP[row - 1][col + 1]
    
    const w = MAP[row][col - 1]
    const e = MAP[row][col + 1]

    const sw = MAP[row + 1][col - 1]
    const s  = MAP[row + 1][col]
    const se = MAP[row + 1][col + 1]
    
    const north = nw + n + ne

    const south = sw + s + se
    
    const west = nw + w + sw
    
    const east = ne + e + se
    
    if (north + south + west + east == 0) { return } // no neighbors
    
    //    
    
    for (const direction of DIRECTIONS) {
        
        if (direction == "north"  &&  north == 0) { reserveSpot(elf, row - 1, col); return }
        
        if (direction == "south"  &&  south == 0) { reserveSpot(elf, row + 1, col); return }
        
        if (direction == "west"   &&  west  == 0) { reserveSpot(elf, row, col - 1); return }
        
        if (direction == "east"   &&  east  == 0) { reserveSpot(elf, row, col + 1); return }
    }       
}
    
function reserveSpot(elf, row, col) {
    
    elf.moving = true 

    elf.chosenRow = row
    elf.chosenCol = col

    CHOSEN[row][col] += 1
}    

///////////////////////////////////////////////////////////

function moveElf(elf) {

    if (! elf.moving) { return }
    
    MOVING = true
    
    const newRow = elf.chosenRow
    const newCol = elf.chosenCol

    if (CHOSEN[newRow][newCol] > 1) { return } // conflict
    
    MAP[elf.row][elf.col] = 0
    
    elf.row = newRow
    elf.col = newCol

    MAP[elf.row][elf.col] = 1
}

///////////////////////////////////////////////////////////

function show() {

    console.log("")
    
    for (const line of MAP) {
    
        let s = ""
        
        for (const x of line) { s += (x == 0 ? "." : "x") }
        
        console.log(s) 
    }
}

///////////////////////////////////////////////////////////

main()

