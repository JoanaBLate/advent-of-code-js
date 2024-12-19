// solution for https://adventofcode.com/2024/day/16 part 2

// expecting all map borders to be blocked ("#")

"use strict"

const input = Deno.readTextFileSync("day16-input.txt").trim()

const table = [ ]

var homeRow = 0
var homeCol = 0

var goalCell = null

const BIG = 1000 * 1000 // means not walked (in that direction)


function main() {

    processInput()

    walk()
    
    search()
    
    console.log("the answer is", countCellsInPaths())
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    let row = -1
    
    for (const rawLine of rawLines) { 
    
        const line = [ ]
        table.push(line)
        
        row += 1
        
        let col = -1
        
        for (const c of rawLine.trim()) {
        
            col += 1
            
            const cell = createCell(row, col, c == "#")
            line.push(cell)
            
            if (c == "S") { homeRow = row; homeCol = col } 
            if (c == "E") { goalCell = cell }
        }
    }    
}

function createCell(row, col, blocked) {

    return { "row": row, "col": col, "blocked": blocked, "north": BIG, "south": BIG, "east": BIG, "west": BIG, "inPath": false }        
}

///////////////////////////////////////////////////////////////////////////////

function walk() {

    const homeCell = table[homeRow][homeCol]
    homeCell.east  = 0
    
    const cellsToWalk = [ homeCell ]

    while (true) {
    
        const cell = cellsToWalk.pop()
        
        if (cell == undefined) { return }
        
        const leastCost = Math.min(cell.north, cell.south, cell.east, cell.west)
        
        grabCellNorth(cell, leastCost, cellsToWalk)
        grabCellSouth(cell, leastCost, cellsToWalk)
        grabCellEast(cell,  leastCost, cellsToWalk)
        grabCellWest(cell,  leastCost, cellsToWalk)
    }
}

function grabCellNorth(previousCell, leastCost, cellsToWalk) {

    const cell = table[previousCell.row - 1][previousCell.col]
    
    if (cell.blocked) { return }

    let cost = leastCost + 1  

    if (leastCost == previousCell.north) {
        // do nothing
    }
    else if (leastCost == previousCell.east) {
        cost += 1000
    }
    else if (leastCost == previousCell.west) {
        cost += 1000
    }
    else { // south
        cost += 2000
    }
    
    if (cost >= cell.north) { return } // not the cheapest path
    
    cell.north = cost
    
    cellsToWalk.push(cell) 
}

function grabCellSouth(previousCell, leastCost, cellsToWalk) {

    const cell = table[previousCell.row + 1][previousCell.col]
    
    if (cell.blocked) { return }

    let cost = leastCost + 1  

    if (leastCost == previousCell.south) {
        // do nothing
    }
    else if (leastCost == previousCell.east) {
        cost += 1000
    }
    else if (leastCost == previousCell.west) {
        cost += 1000
    }
    else { // north
        cost += 2000
    }
    
    if (cost >= cell.south) { return } // not the cheapest path
    
    cell.south = cost
    
    cellsToWalk.push(cell) 
}

function grabCellEast(previousCell, leastCost, cellsToWalk) {

    const cell = table[previousCell.row][previousCell.col + 1]
    
    if (cell.blocked) { return }

    let cost = leastCost + 1  

    if (leastCost == previousCell.east) {
        // do nothing
    }
    else if (leastCost == previousCell.north) {
        cost += 1000
    }
    else if (leastCost == previousCell.south) {
        cost += 1000
    }
    else { // west
        cost += 2000
    }
    
    if (cost >= cell.east) { return } // not the cheapest path
    
    cell.east = cost
    
    cellsToWalk.push(cell) 
}

function grabCellWest(previousCell, leastCost, cellsToWalk) {

    const cell = table[previousCell.row][previousCell.col - 1]
    
    if (cell.blocked) { return }

    let cost = leastCost + 1  

    if (leastCost == previousCell.west) {
        // do nothing
    }
    else if (leastCost == previousCell.north) {
        cost += 1000
    }
    else if (leastCost == previousCell.south) {
        cost += 1000
    }
    else { // east
        cost += 2000
    }
    
    if (cost >= cell.west) { return } // not the cheapest path
    
    cell.west = cost
    
    cellsToWalk.push(cell) 
}

///////////////////////////////////////////////////////////////////////////////

function search() { // walking backwards
    
    goalCell.inPath = true

    const leastCost = Math.min(goalCell.north, goalCell.south, goalCell.east, goalCell.west)
    
    const northCell = table[goalCell.row - 1][goalCell.col]
    const southCell = table[goalCell.row + 1][goalCell.col]

    const eastCell  = table[goalCell.row][goalCell.col + 1]
    const westCell  = table[goalCell.row][goalCell.col - 1]
    
    searchThis(northCell, leastCost, "south")
    searchThis(southCell, leastCost, "north")

    searchThis(eastCell, leastCost, "west")
    searchThis(westCell, leastCost, "east")
}

function searchThis(cell, targetCost, pathDirection) { // recursive function
    
    if (cell.blocked) { return }
    if (cell.inPath)  { return }
    
    if (pathDirection == "north") {
    
        if (cell.north + 1 == targetCost) { searchFrom(cell, cell.north, "north") }
        
        if (cell.east + 1001 == targetCost) { searchFrom(cell, cell.east, "east") }
        
        if (cell.west + 1001 == targetCost) { searchFrom(cell, cell.west, "west") }
        
        return
    }
    
    if (pathDirection == "south") {
    
        if (cell.south + 1 == targetCost) { searchFrom(cell, cell.south, "south") }
        
        if (cell.east + 1001 == targetCost) { searchFrom(cell, cell.east, "east") }
        
        if (cell.west + 1001 == targetCost) { searchFrom(cell, cell.west, "west") }
        
        return
    }
    
    if (pathDirection == "east") {
    
        if (cell.east + 1 == targetCost) { searchFrom(cell, cell.east, "east") }
        
        if (cell.north + 1001 == targetCost) { searchFrom(cell, cell.north, "north") }
        
        if (cell.south + 1001 == targetCost) { searchFrom(cell, cell.south, "south") }
        
        return
    }
    
    if (pathDirection == "west") {
    
        if (cell.west + 1 == targetCost) { searchFrom(cell, cell.west, "west") }
        
        if (cell.north + 1001 == targetCost) { searchFrom(cell, cell.north, "north") }
        
        if (cell.south + 1001 == targetCost) { searchFrom(cell, cell.south, "south") }
        
        return
    }
}

function searchFrom(cell, targetCost, pathDirection) {

    cell.inPath = true

    searchThis(table[cell.row - 1][cell.col], targetCost, pathDirection) // north
    searchThis(table[cell.row + 1][cell.col], targetCost, pathDirection) // south
    searchThis(table[cell.row][cell.col + 1], targetCost, pathDirection) // east
    searchThis(table[cell.row][cell.col - 1], targetCost, pathDirection) // west
}

///////////////////////////////////////////////////////////////////////////////

function countCellsInPaths() {

    let count = 0
    
    for (const line of table) {
        for (const cell of line) {
        
            if (cell.inPath) { count += 1 }   
        }
    }
    return count
}

console.time("execution time")
main()
console.timeEnd("execution time") // 23ms

