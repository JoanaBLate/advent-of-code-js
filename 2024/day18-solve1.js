// solution for https://adventofcode.com/2024/day/18 part 1

"use strict"

const input = Deno.readTextFileSync("day18-input.txt").trim()

const width = 71
const height = 71

const map = [ ]

const BIG = 1000 * 1000 // means cell not walked


function main() {

    makeMap()

    processInput()
    
    walk()
    
 // showMap()
    
    console.log("the answer is", map[width - 1][height - 1].distance)
}

function makeMap() {

    for (let row = 0; row < height; row++) { 

        const line = [ ]
        map.push(line)
        
        for (let col = 0; col < width; col++) { line.push(createCell(row, col)) }
    }
}

function createCell(row, col) {

    return { "row": row, "col": col, "blocked": false, "distance": BIG }
}

function processInput() {
    
    const lines = input.split("\n")
    
    for (let n = 0; n < 1024; n++) {
    
        const coords = lines.shift().trim().split(",")
        
        const row = parseInt(coords.shift())
        const col = parseInt(coords.shift())
        
        map[row][col].blocked = true    
    }
}

///////////////////////////////////////////////////////////////////////////////

function walk() {

    const homeCell = map[0][0]
    
    homeCell.distance = 0

    let cellsToWalk = [ homeCell ]

    while (true) {
        
        const newCellsToWalk = [ ]
    
        for (const cell of cellsToWalk) {
        
            const row = cell.row
            const col = cell.col
            const distance = cell.distance + 1
            
            grabCell(row - 1, col, distance, newCellsToWalk)
            grabCell(row + 1, col, distance, newCellsToWalk)
            grabCell(row, col - 1, distance, newCellsToWalk)
            grabCell(row, col + 1, distance, newCellsToWalk)
        }
        
        cellsToWalk = newCellsToWalk
        
        if (cellsToWalk.length == 0) { return }        
    }
}

function grabCell(row, col, distance, newCellsToWalk) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row == height) { return }
    if (col == width)  { return }

    const cell = map[row][col]
    
    if (cell.blocked) { return }
    
    if (cell.distance <= distance) { return }

    cell.distance = distance  
    
    newCellsToWalk.push(cell)
}

///////////////////////////////////////////////////////////////////////////////

function showMap() {

    for (const line of map) {

        let s = ""
        for (const cell of line) { 
        
            let c = "."
            if (cell.blocked) { c = "#" }
            if (cell.distance != BIG) { c = "O" }
            s += c
        }
        console.log(s)
    }
}        

console.time("execution time")
main()
console.timeEnd("execution time") // 5ms


