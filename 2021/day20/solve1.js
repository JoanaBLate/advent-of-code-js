"use strict"

// solving the puzzle takes (my computer) 0.033s

const input = Deno.readTextFileSync("input.txt").trim()

const algorithm = new Uint8Array(512)

const DATA = [ ]

const MARGIN = 2 

var WIDTH = 0

var HEIGHT = 0

const DARK = 0
const LIGHT = 1

const MAPS = [ ]

var anyDistantPixel = LIGHT


function main() {

    processInput()
    
    MAPS.push(createMapFromData())
    MAPS.push(createBlankMap())
    
 // show(MAPS[0])

    for (let n = 0; n < 2; n++) { updateMap() }    
    
    console.log("the answer is", countLight())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const sections = input.split("\n\n")
    
    fillAlgorithm(sections.shift().trim())
    
    const lines = sections.shift().split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
    
    HEIGHT = (2 * MARGIN) + DATA.length
    
    WIDTH =  (2 * MARGIN) + DATA[0].trim().length
}

///////////////////////////////////////////////////////////

function fillAlgorithm(source) {

    for (let n = 0; n < 512; n++) {
        
        if (source[n] == "#") { algorithm[n] = LIGHT }
    }
}

///////////////////////////////////////////////////////////

function createMapFromData() {

    const map = createBlankMap()
    
    const height = HEIGHT - (2 * MARGIN)  
    const width  = WIDTH  - (2 * MARGIN)   
    
    for (let row = 0; row < height; row++) { 

        for (let col = 0; col < width; col++) { 
    
            if (DATA[row][col] == "#") { map[MARGIN + row][MARGIN + col] = LIGHT }
        }
    }
    
    return map
}

function createBlankMap() {
 
    const map = [ ]   
    
    for (let n = 0; n < HEIGHT; n++) { map.push(new Uint8Array(WIDTH)) }
    
    return map
} 

///////////////////////////////////////////////////////////

function updateMap() {

    anyDistantPixel = (anyDistantPixel == DARK) ? LIGHT : DARK

    const source = MAPS[0]
    
    const result = MAPS[1]
    
    MAPS.push(MAPS.shift())

    for (let row = 0; row < HEIGHT; row++) { 

        for (let col = 0; col < WIDTH; col++) { 
    
            result[row][col] = findResultFor(source, row, col) 
        }
    }
}

function findResultFor(map, row, col) {

    let index = 0
    
    if (isLit(map, row - 1, col - 1)) { index += 256 }
    if (isLit(map, row - 1, col    )) { index += 128 }
    if (isLit(map, row - 1, col + 1)) { index += 64 }
    
    if (isLit(map, row    , col - 1)) { index += 32 }
    if (isLit(map, row    , col    )) { index += 16 }
    if (isLit(map, row    , col + 1)) { index += 8 }
    
    if (isLit(map, row + 1, col - 1)) { index += 4 }
    if (isLit(map, row + 1, col    )) { index += 2 }
    if (isLit(map, row + 1, col + 1)) { index += 1 }
    
    return algorithm[index]
}

function isLit(map, row, col) { 

    if (row < 0) { return anyDistantPixel == LIGHT }
    if (col < 0) { return anyDistantPixel == LIGHT }
    
    if (row > HEIGHT - 1) { return anyDistantPixel == LIGHT }
    if (col > WIDTH - 1)  { return anyDistantPixel == LIGHT }
    
    return (map[row][col] == LIGHT)
}

///////////////////////////////////////////////////////////

function countLight() {

    const map = MAPS[0]

    let count = 0

    for (let row = 0; row < HEIGHT; row++) { 

        for (let col = 0; col < WIDTH; col++) { 
    
            if (map[row][col] == LIGHT) { count += 1 }
        }
    }
    
    return count
}

///////////////////////////////////////////////////////////

function show(map) {

    console.log("") 
    
    for (const line of map) {
    
        let s = ""
        
        for (const c of line) { s += (c == DARK) ? "." : "#" }
        
        console.log(s)
    } 
    console.log("")    
}

main()

