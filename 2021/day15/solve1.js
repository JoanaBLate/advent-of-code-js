"use strict"

// solving the puzzle takes (my computer) 0.040s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var HEIGHT = 0

var WIDTH = 0

const RISK = [ ]


function main() {

    processInput()
        
    createRiskTable()
    
    walk()
    
    console.log("the answer is", RISK[HEIGHT - 1][WIDTH - 1])
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    WIDTH = MAP[0].length
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function createRiskTable() {

    for (let n = 0; n < HEIGHT; n++) { RISK.push(createRiskTableLine()) }
}

function createRiskTableLine() {

    const list = new Array(WIDTH)
    
    list.fill(Infinity)
    
    return list
}

///////////////////////////////////////////////////////////

function walk() {

    RISK[0][1] = parseInt(MAP[0][1])
    RISK[1][0] = parseInt(MAP[1][0])

    let futures = [ createPoint(0, 1), createPoint(1, 0) ]
        
    while (true) {
        
        if (futures.length == 0) { return }
    
        const currents = futures
        
        futures = [ ]
                
        for (const current of currents) {
        
            const row = current.row
            const col = current.col
            
            const risk = RISK[row][col]
                        
            tryWalk(row - 1, col, risk, futures)
            tryWalk(row + 1, col, risk, futures)
            tryWalk(row, col - 1, risk, futures)
            tryWalk(row, col + 1, risk, futures)        
        }        
    }
}
    
function tryWalk(row, col, risk, futures) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }

    const newRisk = risk + parseInt(MAP[row][col])
    
    if (newRisk >= RISK[row][col]) { return }
    
    RISK[row][col] = newRisk
    
    futures.push(createPoint(row, col))    
}

main()

