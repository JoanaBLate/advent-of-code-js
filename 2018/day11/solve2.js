"use strict"

// solving the puzzle takes (my computer) 10.250s

var gridSerialNumber = 0

const grid = [ ]

var ROW = 0
var COL = 0
var SIDE = 0
var BEST = -9999999

const lib30 = { }


function main() {

    processInput()
    
    initGrid()
    
    setGridValues()
    
    fillLib30()
     
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

function fillLib30() {

    const side = 30 
    
    for (let row = 0; row <= 300 - side; row++) { 

        for (let col = 0; col <= 300 - side; col++) { 
            
            lib30[row + "~" + col] = calcGroupValueCore(row, col, side)
        }
    }
}

///////////////////////////////////////////////////////////

function tryThisSide(side) {

    console.log("checking", side,"x", side, "squares")

    for (let row = 0; row <= 300 - side; row++) { 

        for (let col = 0; col <= 300 - side; col++) { 
        
            const power = calcGroupValue(row, col, side)
            
            if (power > BEST) {
                ROW = row
                COL = col
                SIDE = side
                BEST = power
            }
        }
    }
}


function calcGroupValue(baseRow, baseCol, side) {

    if (side < 30) { return calcGroupValueCore(baseRow, baseCol, side) }
    
    return calcGroupValueCache(baseRow, baseCol, side)
}
 
///////////////////////////////////////////////////////////
 
function calcGroupValueCache(baseRow, baseCol, side) {
 
    let power = 0
    
    for (let row = 0; row < side; row += 30) { 

        for (let col = 0; col < side; col += 30) { 
    
            power += lib30[baseRow + "~" + baseCol]
        }
    }    
    
    const missing = side % 30
    const done = side - missing    
    
    for (let row = 0; row < missing; row += 1) { 

        for (let col = 0; col < missing; col += 1) { 
    
            power += grid[done + row][done + col]
        }
    }    
}

function calcGroupValueCore(baseRow, baseCol, side) {

    let power = 0
    
    for (let row = 0; row < side; row++) { 

        for (let col = 0; col < side; col++) { 
        
            power += grid[baseRow + row][baseCol + col]
        }
    }
    return power
}

main()

