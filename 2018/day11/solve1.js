"use strict"

// solving the puzzle takes (my computer) 0.030s

var gridSerialNumber = 0

const grid = [ ]


function main() {

    processInput()
    
    initGrid()
    
    setGridValues()
     
    console.log("the answer is", coordinatesOfLargestPower())
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

function coordinatesOfLargestPower() {

    let bestPower = -9999999
    
    let bestCoord = ""

    for (let row = 0; row < 298; row++) { 

        for (let col = 0; col < 298; col++) { 
        
            const power = calcGroupValue(row, col)
            
            if (power > bestPower) { 
            
                bestPower = power
                bestCoord = (col + 1) + "," + (row + 1)
            }
        }
    }
    return bestCoord
}

function calcGroupValue(row, col) {

    return 0 +
    grid[row][col]   + grid[row][col+1]   + grid[row][col+2] +
    grid[row+1][col] + grid[row+1][col+1] + grid[row+1][col+2] +
    grid[row+2][col] + grid[row+2][col+1] + grid[row+2][col+2]
}

main()

