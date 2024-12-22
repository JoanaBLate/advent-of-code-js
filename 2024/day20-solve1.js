// solution for https://adventofcode.com/2024/day/20 part 1

"use strict"

const input = Deno.readTextFileSync("day20-input.txt").trim()

const map = [ ]

var width = 0
var height = 0

var homeCell = null

var goalCell = null

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
        
            if (cell.symbol != "#") { continue }
            
            if (cell.row == 0) { continue }
            if (cell.col == 0) { continue }
            
            if (cell.row == height - 1) { continue }
            if (cell.col == width  - 1) { continue }
        
            findShortcut(cell) 
        }    
    }
}

function findShortcut(cell) {
    
    const north = map[cell.row - 1][cell.col]
    const south = map[cell.row + 1][cell.col]
    const east  = map[cell.row][cell.col + 1]
    const west  = map[cell.row][cell.col - 1]
    
    const neighbors = [ ] // only cells that are in the path

    if (north.distance != -1) { neighbors.push(north) }
    if (south.distance != -1) { neighbors.push(south) }
    if (east.distance  != -1) { neighbors.push(east)  }
    if (west.distance  != -1) { neighbors.push(west)  }
    
    if (neighbors.length < 2) { return }
    
    orderByDistance(neighbors)

    const cellBeforeCut = neighbors.shift()
    
    const distanceBeforeCut = cellBeforeCut.distance
    
    for (const neighbor of neighbors) {
    
        const distanceAfterCut = neighbor.distance
        
        const economy = distanceAfterCut - distanceBeforeCut - 2
    
        if (economy >= 100) { bestShortcuts += 1 }    
    } 
}

///////////////////////////////////////////////////////////////////////////////

function orderByDistance(list) {

    let n = -1
    
    while (true) {
    
        n += 1
    
        const a = list[n]
        const b = list[n + 1]
        
        if (b == undefined) { return }
    
        if (a.distance < b.distance) { continue }
        
        list[n] = b
        list[n + 1] = a
    
        n = -1
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 16ms

