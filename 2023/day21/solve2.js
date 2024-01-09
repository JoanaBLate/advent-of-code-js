"use strict"

// solving the puzzle takes (my computer) 0.153s

/*
    (FOR MY INPUT)
      
    IMPORTANT OBSERVATIONS
    
    this puzzle requires a *tailor made* solution, a previous knowledge
    of its behavior; so this program directly assigns 131 to DIM (instead 
    of reading WIDTH and HEIGHT from the input) and makes other assumptions
    
    the plots grow in a very regular diamond shape
    
    the plots are ALWAYS distributed in a perfect regular grid,
    no matter the rocks
    
    plots will take all available space (excluding the cross neighbors)
    
    at each step:        
      the occupation of the center row grows 1 position to the left and 1 position to the right        
      the occupation of the center column grows 1 position to the rop and 1 position to the bottom
        
    till step 130 (inclusive) all square map states are different,
    after step 130, states of steps 129 and 130 repeat forever:
    step 131 repeats the state at step 129
    step 132 repeats the state at step 130
    step 133 repeats the state at step 129 and so on
    
    >> run the file BIG-DIAMOND.js to visualize the essence of the WHOLE geometry
       (you will need to use font size 4, probably)
    
    >> to visualize some map kind do as in the example bellow (JUST ONCE each time)
    
        const smallTriangleD = walkAndCount(130, 130, 64) // current code line
        
        show(walk(130, 130, 64)) // line to be inserted for visualization

*/

const input = Deno.readTextFileSync("input.txt").trim()

const STEPS = 26501365 // number of steps of the puzzle                       

var MAP = null // always virgin

var DIM = 131

var homeRow = 0

var homeCol = 0

const FREE = 0

const ROCK = 1


function main() {

    processInput()
    
   // drawDiamond()
    
    // counting used plots for each map(131 x 131) kind:
    
    const squareA = walkAndCount(homeRow, homeCol, 129)

    const squareB = walkAndCount(homeRow, homeCol, 130)
    
    const smallTriangleA = walkAndCount(0, 0, 64)
    
    const smallTriangleB = walkAndCount(0, 130, 64)
    
    const smallTriangleC = walkAndCount(130, 0, 64)
    
    const smallTriangleD = walkAndCount(130, 130, 64)
        
    const bigTriangleA = walkAndCount(0, 0, 195)
    
    const bigTriangleB = walkAndCount(0, 130, 195)
    
    const bigTriangleC = walkAndCount(130, 0, 195)

    const bigTriangleD = walkAndCount(130, 130, 195)
    
    const tailA = walkAndCount(0, 65, 130)
    
    const tailB = walkAndCount(65, 0, 130)
    
    const tailC = walkAndCount(65, 130, 130)
    
    const tailD = walkAndCount(130, 65, 130)
    
    // summing the counts:
    
    const branche = Math.floor(STEPS / DIM)

    let numberOfSquaresA = 1
    
    let numberOfSquaresB = 0

    let amount = 0
    
    for (let n = 0; n < branche; n++) { 

        if (n % 2 == 0) { numberOfSquaresA += amount } else { numberOfSquaresB += amount }

        amount += 4
    }    
    
    const rectangles = numberOfSquaresA * squareA + numberOfSquaresB * squareB

    const bigTriangles = bigTriangleA + bigTriangleB + bigTriangleC + bigTriangleD
    
    const smallTriangles = smallTriangleA + smallTriangleB + smallTriangleC + smallTriangleD
    
    const tails = tailA + tailB + tailC + tailD
    
    const result = rectangles + (branche - 1) * bigTriangles + branche * smallTriangles + tails
    
    console.log("the answer is", result)
}

///////////////////////////////////////////////////////////

function processInput() {

    const lines = input.split("\n")
    
    MAP = new Uint8Array(DIM * DIM)

    for (let row = 0; row < DIM; row++) {
    
        for (let col = 0; col < DIM; col++) {
            
            const index = row * DIM + col
        
            if (lines[row][col] == "#") { MAP[index] = ROCK; continue }
            
            if (lines[row][col] == "S") { homeRow = row; homeCol = col }
        }
    }
}

function cloneVirginMap() {
    
    const map = new Uint8Array(DIM * DIM)

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

    const index = startRow * DIM + startCol
    
    map[index] = TARGET
    
    let step = 0
    
    while (true) {
    
        step += 1
        
        if (step % 2 == 0) { TARGET = 3; FUTURE = 2 } else { TARGET = 2; FUTURE = 3 }
    
        for (let row = 0; row < DIM; row++) {
        
            for (let col = 0; col < DIM; col++) {
            
                const index = row * DIM + col
            
                if (map[index] != TARGET) { continue }
  
                map[index] = FREE

                tryWalk(map, row - 1, col, FUTURE)
                tryWalk(map, row + 1, col, FUTURE)
                tryWalk(map, row, col - 1, FUTURE)
                tryWalk(map, row, col + 1, FUTURE)
            }
        }  
        
        if (step == maxStep) { return map }
    }      
}

function tryWalk(map, row, col, FUTURE) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > DIM - 1)  { return }
    if (col > DIM  - 1) { return }
    
    const index = row * DIM + col
    
    if (map[index] == ROCK) { return }

    map[index] = FUTURE
}

///////////////////////////////////////////////////////////

function countPlots(map) {

    let count = 0

    for (let row = 0; row < DIM; row++) {
    
        for (let col = 0; col < DIM; col++) {
        
            const index = row * DIM + col
    
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

    for (let row = 0; row < DIM; row++) {
    
        let s = ""
        
        for (let col = 0; col < DIM; col++) {
        
            const index = row * DIM + col

            s += ".#TF"[map[index]]
        }
        console.log(s)
    }
}    

main()

