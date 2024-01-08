"use strict"

// solving the puzzle takes (my computer) 0.042s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0

var HEIGHT = 0

var futurePlots = [ ]


function main() {

    processInput()

    fillFuturePlotsWithHome()
    
    walk(64)
    
    console.log("the answer is", futurePlots.length)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    
    WIDTH = MAP[0].length
}

function createPoint(row, col) {

    return ({ "row": row, "col": col })
}

///////////////////////////////////////////////////////////

function fillFuturePlotsWithHome() {

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            if (MAP[row][col] != "S") { continue }
            
            futurePlots.push(createPoint(row, col))
            
            return
        }
    }
}

///////////////////////////////////////////////////////////

function walk(maxStep) {

    let step = 0
    
    while (true) {
    
        step += 1
        
        const currentPlots = futurePlots
        
        futurePlots = [ ]
    
        const walking = new Uint8Array(WIDTH * HEIGHT)
        
        for (const plot of currentPlots) { walkPlot(plot, walking) }
        
        if (step == maxStep) { return }
    }
}

function walkPlot(plot, walking) {

    tryWalk(plot.row - 1, plot.col, walking)
    tryWalk(plot.row + 1, plot.col, walking)
    tryWalk(plot.row, plot.col - 1, walking)
    tryWalk(plot.row, plot.col + 1, walking)
}

function tryWalk(row, col, walking) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    if (MAP[row][col] == "#") { return }

    const index = row * WIDTH + col
    
    if (walking[index] != 0) { return }

    walking[index] = 1

    futurePlots.push(createPoint(row, col))
}

main()

