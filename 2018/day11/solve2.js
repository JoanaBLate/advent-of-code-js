"use strict"

// solving the puzzle takes (my computer) 0.140s

var gridSerialNumber = 0

const grid = [ ]

var ROW = 0
var COL = 0
var SIDE = 0
var BEST = -9999999


function main() {

    processInput()
    
    initGrid()
    
    setGridValues()
     
    for (let side = 3; side <= 300; side++) { tryThisSide(side) }
     
    console.log("the answer is", (COL+1) + "," + (ROW+1) + "," + SIDE)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    gridSerialNumber = parseInt(input)
}

function initGrid() {

    for (let n = 0; n < 300; n++) { grid.push(createRow()) }
}

function createRow() {
    
    const row = [ ]
    
    for (let n = 0; n < 300; n++) { row.push(0) } 
    
    return row   
}

function setGridValues() {

    for (let row = 0; row < 300; row++) { 

        for (let col = 0; col < 300; col++) { 
        
            grid[row][col] = calcCellValue(col + 1, row + 1)
        }
    }
}

function calcCellValue(x, y) {

    const rackId = x + 10
    
    let powerLevel = rackId * y
    
    powerLevel += gridSerialNumber
    
    powerLevel *= rackId
    
    const rest = powerLevel % 100
    
    powerLevel -= rest
    
    powerLevel = powerLevel / 100
    
    powerLevel = powerLevel % 10 - 5
    
    return powerLevel
}

///////////////////////////////////////////////////////////

function tryThisSide(side) {

    const layer = makeThickLayer(side, 0)
    
    let power = 0
    
    for (let row = 0; row <= 300 - side; row++) { 
    
        if (row > 0) { updateThickLayerDown(layer, side, row - 1) }
        
        for (let col = 0; col <= 300 - side; col++) { 
        
            if (col == 0) {
                
                power = calcFirstSquareValue(layer, side, col)
            }
            else {
            
                power -= layer[col - 1]
                power += layer[col + side - 1]
            }
            
            if (power > BEST) {
                ROW = row
                COL = col
                SIDE = side
                BEST = power
            }
        }
    }
}

function calcFirstSquareValue(layer, side, baseCol) {

    let power = 0
    
    for (let col = baseCol; col < baseCol + side; col++) { power += layer[col] }
    
    return power
}
 
function makeThickLayer(height, baseRow) { // width=300 (all cols)

    const cols = new Int32Array(300)
    
    for (let col = 0; col < 300; col++) {
    
        let power = 0 
    
        for (let row = 0; row < height; row++) { 
        
            power += grid[baseRow + row][col]
        }
        
        cols[col] = power
    }
    
    return cols
}

function updateThickLayerDown(layer, height, baseRow) {

    for (let col = 0; col < 300; col++) {
    
        layer[col] -= grid[baseRow][col] 
    
        layer[col] += grid[baseRow + height][col] 
    }
}

main()

