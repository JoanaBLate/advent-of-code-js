// solution for https://adventofcode.com/2024/day/16 part 1

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
    
    console.log("the answer is", Math.min(goalCell.north, goalCell.south, goalCell.east, goalCell.west))
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

    return { "row": row, "col": col, "blocked": blocked, "north": BIG, "south": BIG, "east": BIG, "west": BIG }        
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

console.time("execution time")
main()
console.timeEnd("execution time") // 20ms

