"use strict"

// solving the puzzle takes (my computer) 0.153s

/*
    (FOR MY INPUT)
      
    FIVE IMPORTANT OBSERVATIONS
    
    the plots grow in a very regular diamond shape
    
    the plots are ALWAYS distributed in a perfect regular grid,
    no matter the rocks
    
    plots will take all available space (excluding the cross neighbors)
    
    at each step:        
      the occupation of the center row grows 1 position to the left and 1 position to the right        
      the occupation of the center column grows 1 position to the rop and 1 position to the bottom
        
    till step 130 (inclusive) all map states are different,
    after step 130, states of steps 129 and 130 repeat forever:
    step 131 repeats the state at step 129
    step 132 repeats the state at step 130
    step 133 repeats the state at step 129 and so on

*/

const input = Deno.readTextFileSync("input.txt").trim()

const STEPS = 26501365 // number of steps of the puzzle                       

var MAP = null // always virgin

var WIDTH = 0

var HEIGHT = 0

var homeRow = 0

var homeCol = 0

const FREE = 0

const ROCK = 1


function main() {

    processInput()
    
   // drawDiamond()
    
    // counts:
    const squareA = walkAndCount(homeRow, homeCol, 129)

    const squareB = walkAndCount(homeRow, homeCol, 130)
    
    const shortTriangleA = walkAndCount(0, 0, 64)
    
    const shortTriangleB = walkAndCount(0, 130, 64)
    
    const shortTriangleC = walkAndCount(130, 0, 64)
    
    const shortTriangleD = walkAndCount(130, 130, 64)
        
    const largeTriangleA = walkAndCount(0, 0, 195)
    
    const largeTriangleB = walkAndCount(0, 130, 195)
    
    const largeTriangleC = walkAndCount(130, 0, 195)

    const largeTriangleD = walkAndCount(130, 130, 195)
    
    const extremityA = walkAndCount(0, 65, 130)
    
    const extremityB = walkAndCount(65, 0, 130)
    
    const extremityC = walkAndCount(65, 130, 130)
    
    const extremityD = walkAndCount(130, 65, 130)
    
    //
    
    const allSquares = (STEPS - 65) / 131

    let numberOfSquaresA = 1
    
    let numberOfSquaresB = 0

    let amount = 0
    
    for (let n = 0; n < allSquares; n++) { 

        if (n % 2 == 0) { numberOfSquaresA += amount } else { numberOfSquaresB += amount }

        amount += 4
    }    
    
    const rectangles = numberOfSquaresA * squareA + numberOfSquaresB * squareB

    const largeTriangles = largeTriangleA + largeTriangleB + largeTriangleC + largeTriangleD
    
    const shortTriangles = shortTriangleA + shortTriangleB + shortTriangleC + shortTriangleD
    
    const extremities = extremityA + extremityB + extremityC + extremityD
    
    const result = rectangles + (allSquares - 1) * largeTriangles + allSquares * shortTriangles + extremities
    
    console.log("the answer is", result)
}

///////////////////////////////////////////////////////////

function processInput() {

    const lines = input.split("\n")
    
    HEIGHT = lines.length
    
    WIDTH = lines[0].trim().length
    
    MAP = new Uint8Array(WIDTH * HEIGHT)

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
            
            const index = row * WIDTH + col
        
            if (lines[row][col] == "#") { MAP[index] = ROCK; continue }
            
            if (lines[row][col] == "S") { homeRow = row; homeCol = col }
        }
    }
}

function cloneVirginMap() {
    
    const map = new Uint8Array(WIDTH * HEIGHT)

    for (let n = 0; n < map.length; n++) { map[n] = MAP[n] }
    
    return map
}

///////////////////////////////////////////////////////////

function walkAndCount(startRow, startCol, maxStep) {

    const map = walk(startRow, startCol, maxStep) 
    
    return countPlots(map)
}

function walk(startRow, startCol, maxStep) {

    let TARGET = 2
    let FUTURE = 3

    const map = cloneVirginMap()

    const index = startRow * WIDTH + startCol
    
    map[index] = TARGET
    
    let step = 0
    
    while (true) {
    
        step += 1
    
        for (let row = 0; row < HEIGHT; row++) {
        
            for (let col = 0; col < WIDTH; col++) {
            
                const index = row * WIDTH + col
            
                if (map[index] != TARGET) { continue }
  
                map[index] = FREE

                tryWalk(map, row - 1, col, FUTURE)
                tryWalk(map, row + 1, col, FUTURE)
                tryWalk(map, row, col - 1, FUTURE)
                tryWalk(map, row, col + 1, FUTURE)
            }
        }  
        
        if (step == maxStep) { return map }

        if (TARGET == 2) { TARGET = 3; FUTURE = 2 } else { TARGET = 2; FUTURE = 3 }
    }      
}

function tryWalk(map, row, col, FUTURE) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    const index = row * WIDTH + col
    
    if (map[index] == ROCK) { return }

    map[index] = FUTURE
}

///////////////////////////////////////////////////////////

function countPlots(map) {

    let count = 0

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            const index = row * WIDTH + col
    
            if (map[index] == FREE) { continue }
            if (map[index] == ROCK) { continue }            
        
            count += 1
        }
    }
    return count
}

///////////////////////////////////////////////////////////

function drawDiamond() {

    const map = walk(homeRow, homeCol, 64)
    
    show(map)
}

function show(map) {

    for (let row = 0; row < HEIGHT; row++) {
    
        let s = ""
        
        for (let col = 0; col < WIDTH; col++) {
        
            const index = row * WIDTH + col

            s += ".#TF"[map[index]]
        }
        console.log(s)
    }
}    

main()

