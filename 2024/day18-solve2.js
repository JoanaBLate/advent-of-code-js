// solution for https://adventofcode.com/2024/day/18 part 2

// expecting NO duplicated coordinates!

"use strict"

const input = Deno.readTextFileSync("day18-input.txt").trim()

const width = 71
const height = 71

const map = [ ]

const strCoordinates = [ ]


function main() {

    makeMap()

    processInput()
    
    console.log("the answer is", findTheFirstBlockingByte())
}

function makeMap() {

    for (let row = 0; row < height; row++) { 

        const line = [ ]
        map.push(line)
        
        for (let col = 0; col < width; col++) { line.push(createCell(row, col)) }
    }
}

function createCell(row, col) {

    return { "row": row, "col": col, "blockRound": 1000 * 1000, "walkRound": -1 }
}

function processInput() {
    
    const lines = input.split("\n")
    
    while (lines.length != 0) {
        
        const str = lines.shift().trim()
        
        strCoordinates.push(str)
        
        const coords = str.split(",")
        
        const row = parseInt(coords.shift())
        const col = parseInt(coords.shift())
        
        map[row][col].blockRound = strCoordinates.length - 1    
    }
}

///////////////////////////////////////////////////////////////////////////////

function walk(walkRound) {

    const goalRow = width - 1
    const goalCol = height - 1

    const homeCell = map[0][0]
    
    homeCell.walkRound = walkRound

    let cellsToWalk = [ homeCell ]

    while (true) {
        
        const newCellsToWalk = [ ]
    
        for (const cell of cellsToWalk) {
        
            const row = cell.row
            const col = cell.col
            
            if (row == goalRow  &&  col == goalCol) { return true }
            
            grabCell(row - 1, col, walkRound, newCellsToWalk)
            grabCell(row + 1, col, walkRound, newCellsToWalk)
            grabCell(row, col - 1, walkRound, newCellsToWalk)
            grabCell(row, col + 1, walkRound, newCellsToWalk)
        }
        
        cellsToWalk = newCellsToWalk
        
        if (cellsToWalk.length == 0) { return false }        
    }
}

function grabCell(row, col, walkRound, newCellsToWalk) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row == height) { return }
    if (col == width)  { return }

    const cell = map[row][col]
    
    if (cell.blockRound <= walkRound) { return }
    
    if (cell.walkRound == walkRound) { return }

    cell.walkRound = walkRound  
    
    newCellsToWalk.push(cell)
}

///////////////////////////////////////////////////////////////////////////

function findTheFirstBlockingByte() {

    let highestFree = 0
    let lowestBlocked = strCoordinates.length - 1
    
    while (true) {
        
        if (highestFree + 1 == lowestBlocked) { return strCoordinates[lowestBlocked] }
    
        let round = Math.floor((highestFree + lowestBlocked) / 2)
        
        const free = walk(round)
        
        if (free) { highestFree = round } else { lowestBlocked = round }
    }
}
  
///////////////////////////////////////////////////////////////////////////////

function showMap(walkRound) {

    for (const line of map) {

        let s = ""
        for (const cell of line) { 
        
            let c = "."
            if (cell.blockRound <= walkRound) { c = "#" }
            if (cell.walkRound  == walkRound) { c = "O" }
            s += c
        }
        console.log(s)
    }
}        

console.time("execution time")
main()
console.timeEnd("execution time") // 8ms


