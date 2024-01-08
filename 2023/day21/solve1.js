"use strict"

// solving the puzzle takes (my computer) 0.040s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0

var HEIGHT = 0

var TARGET = "T"

var FUTURE = "F"


function main() {

    processInput()

    adjustHomeSymbol()
    
    walk(64)
    
 // show()
    console.log("the answer is", countPlots())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim().split("")) }
    
    HEIGHT = MAP.length
    
    WIDTH = MAP[0].length
}

///////////////////////////////////////////////////////////

function adjustHomeSymbol() {

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            if (MAP[row][col] == "S") { MAP[row][col] = "F"; return }
        }
    }
}

function countPlots() {

    let count = 0

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            if (MAP[row][col] == ".") { continue }
            if (MAP[row][col] == "#") { continue }
            
            count += 1
        }
    }
    
    return count
}

///////////////////////////////////////////////////////////

function walk(maxStep) {

    let step = 0
    
    while (true) {

        step += 1

        if (TARGET == "T") { TARGET = "F"; FUTURE = "T" } else { TARGET = "T"; FUTURE = "F" }
        
        for (let row = 0; row < HEIGHT; row++) {
        
            for (let col = 0; col < WIDTH; col++) {
            
                if (MAP[row][col] != TARGET) { continue }
                
                MAP[row][col] = "."

                tryWalk(row - 1, col)
                tryWalk(row + 1, col)
                tryWalk(row, col - 1)
                tryWalk(row, col + 1)
            }
        }
        
        if (step == maxStep) { return }
    }
}

function tryWalk(row, col) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    if (MAP[row][col] == "#") { return }
    
    MAP[row][col] = FUTURE
}

///////////////////////////////////////////////////////////

function show() {

    console.log("")
    for (const line of MAP) { console.log(line.join(" ")) }
}

main()

