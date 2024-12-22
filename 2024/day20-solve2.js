// solution for https://adventofcode.com/2024/day/20 part 2

"use strict"

const input = Deno.readTextFileSync("day20-input.txt").trim()

const map = [ ]

var width = 0
var height = 0

var homeCell = null

var goalCell = null

const minimumEconomy = 100

var bestShortcuts = 0


function main() {

    processInput()
    
    walk()
    
    findAllShortcuts()
    
    console.log("the answer is", bestShortcuts)
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    let row = -1
    for (const rawLine of rawLines) { 
    
        row += 1
        const mapLine = [ ]
        map.push(mapLine)
        
        let col = -1
        for (const symbol of rawLine.trim()) {
        
            col += 1

            const cell = createCell(row, col, symbol)
            
            if (symbol == "S") { homeCell = cell }
            if (symbol == "E") { goalCell = cell }

            mapLine.push(cell)       
        }
    }
    
    height = map.length
    width = map[0].length
}

function createCell(row, col, symbol) {

    return { "row": row, "col": col, "symbol": symbol, "distance": -1 }
}

///////////////////////////////////////////////////////////////////////////////

function walk() {

    homeCell.distance = 0

    let cellsToWalk = [ homeCell ]

    while (true) {
        
        const newCellsToWalk = [ ]
    
        for (const cell of cellsToWalk) {
        
            const row = cell.row
            const col = cell.col
            const distance = cell.distance + 1
            
            if (cell == goalCell) { return } // not necessary for my input
            
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
    
    if (cell.symbol == "#") { return }
    
    if (cell.distance != -1) { return }
    
    cell.distance = distance  
    
    newCellsToWalk.push(cell)
}

///////////////////////////////////////////////////////////////////////////////

function findAllShortcuts() {

    for (const line of map) {
    
        for (const cell of line) { 
        
            if (cell.distance != -1) { findShortcut(cell) }
        }    
    }
}

function findShortcut(baseCell) {

    for (let deltaRow = -20; deltaRow <= 20; deltaRow++) {

             const row = baseCell.row + deltaRow
             if (row < 0) { continue }
             if (row > height - 1) { return }

        for (let deltaCol = -20; deltaCol <= 20; deltaCol++) {
             
             const col = baseCell.col + deltaCol 
             if (col < 0) { continue }            
             if (col > width - 1) { break } 
        
             const manhattan = Math.abs(deltaRow) + Math.abs(deltaCol) // manhattan distance
             
             if (manhattan == 0) { continue }
             if (manhattan > 20) { continue }  
             
             const cell = map[row][col]
             
             if (cell.distance == -1) { continue }
             
             const economy = cell.distance - baseCell.distance - manhattan
             
             if (economy < minimumEconomy) { continue }
             
             bestShortcuts += 1              
        }
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 99ms

