"use strict"

// solving the puzzle takes (my computer) 0.030s

const input = Deno.readTextFileSync("input.txt").trim()

const AIR = 0
const ROCK = 1
const SAND = 2
const SPRING = 3

const SEGMENTS = [ ]

const leftMargin = 5   // arbitrary value
const rightMargin = 5  // arbitrary value

var lowestRow = +Infinity
var lowestCol = +Infinity

var greatestRow = -Infinity
var greatestCol = -Infinity

var WIDTH = 0
var HEIGHT = 0

var DELTACOL = 0

var springRow = 0
var springCol = 500

var abyssRow = 0

const MAP = [ ]


function main() {

    processInput()
    
    adjustDimensionsAndPositions()
    
    createMap()
    
    let count = 0
    
    while (true) {
    
        count += 1
        
        if (dropSand()) { break }
    }
    
   // show()
    
    console.log("the answer is", count - 1)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" -> ")
        
        while (tokens.length > 1) {
        
            const segment = createSegment(tokens[0], tokens[1])
            
            SEGMENTS.push(segment)
            
            tokens.shift()
        }
    } 
}

function createSegment(tokenA, tokenB) {

    const pointA = createPointFromToken(tokenA)

    const pointB = createPointFromToken(tokenB)

    return { "pointA": pointA, "pointB": pointB }
}

function createPointFromToken(source) {

    const tokens = source.split(",")
    
    const row = parseInt(tokens.pop())

    const col = parseInt(tokens.pop())
    
    if (row < lowestRow) { lowestRow = row } 
    if (col < lowestCol) { lowestCol = col }        

    if (row > greatestRow) { greatestRow = row } 
    if (col > greatestCol) { greatestCol = col }
    
    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function adjustDimensionsAndPositions() {
    
    abyssRow = greatestRow + 1

    HEIGHT = abyssRow + 1     
    
    WIDTH = leftMargin + (greatestCol - lowestCol + 1) + rightMargin
    
    DELTACOL = leftMargin - lowestCol
    
    springCol += DELTACOL
}

///////////////////////////////////////////////////////////

function createMap() {

    for (let row = 0; row < HEIGHT; row++) { MAP.push(new Uint8Array(WIDTH)) }
    
    MAP[springRow][springCol] = 3

    for (const segment of SEGMENTS) { writeSegment(segment) }
}

function writeSegment(segment) {

    let rowA = segment.pointA.row
    let colA = segment.pointA.col + DELTACOL
    let rowB = segment.pointB.row
    let colB = segment.pointB.col + DELTACOL
    
    if (rowA > rowB) {
    
        const temp = rowA
        rowA = rowB
        rowB = temp    
    }
    
    if (colA > colB) {
    
        const temp = colA
        colA = colB
        colB = temp    
    }
    
    for (let row = rowA; row <= rowB; row++) {

        for (let col = colA; col <= colB; col++) { MAP[row][col] = ROCK }
    }
}

///////////////////////////////////////////////////////////

function dropSand() {

    let row = springRow
    let col = springCol
    
    while (true) {
    
        if (row == abyssRow) { return true }
    
        if (MAP[row + 1][col] == AIR) { row += 1; continue }
    
        if (MAP[row + 1][col - 1] == AIR) { row += 1; col -= 1; continue }
        
        if (MAP[row + 1][col + 1] == AIR) { row += 1; col += 1; continue }
        
        MAP[row][col] = SAND
        
        return false    
    }
}

///////////////////////////////////////////////////////////

function show() {

    console.log("")
    
    for (const line of MAP) {

        let s = ""
        
        for (const item of line) { s += ".#o+"[item] }
        
        console.log(s)
    }
    
    console.log("")
}

main()

