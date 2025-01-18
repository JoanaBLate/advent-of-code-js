// solution for https://adventofcode.com/2024/day/6 part 2  ***USING THE SAMPLE MAP***

// EXPECTS INITIAL DIRECTION TO BE NORTH (^)

"use strict"

const input = 
`....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`

const NORTH = 1
const SOUTH = 2
const EAST  = 3
const WEST  = 4

const map = [ ]

var width = 0
var height = 0

var homeRow = 0
var homeCol = 0
var cursorRow = 0
var cursorCol = 0
var direction = NORTH

var countOfLoopPaths = 0

var currentWalk = 0

const originalPath = [ ]

const testedCells = { }


function main() {

    processInput()
    walkOriginalPath()
    walkCandidateMaps()
    
    console.log("the answer is", countOfLoopPaths)
}

function processInput() {
        
    const lines = input.split("\n")
    
    const stringMap = [ ]
    
    for (const line of lines) { stringMap.push(line.trim()) }
    
    height = stringMap.length
    width = stringMap[0].length
        
    for (let row = 0; row < height; row++) { 

        const mapLine = [ ]
        map.push(mapLine)
        
        for (let col = 0; col < width; col++) { 
            
            const cell = createCell()
            mapLine.push(cell)
            
            const symbol = stringMap[row][col]

            if (symbol == "#") { cell.blocked = true; continue }
            if (symbol == ".") { continue }
            
            homeRow = row
            homeCol = col
            cursorRow = row
            cursorCol = col
        }
    }
}

function createCell() {
    return {
        "walkId": 0,
        "blocked": false,
        "walkedNorth": false,
        "walkedSouth": false,
        "walkedEast":  false,
        "walkedWest":  false
    }
}

///////////////////////////////////////////////////////////////////////////////

function walkOriginalPath() {

    while (walkOriginalPathOnce()) { }
}

function walkOriginalPathOnce() {

    originalPath.push({ "row": cursorRow, "col": cursorCol, "direction": direction })

    if (direction == NORTH) {
        cursorRow -= 1
        if (cursorRow < 0) { return false }
        if (map[cursorRow][cursorCol].blocked) { cursorRow += 1; direction = EAST }
        return true
    }

    if (direction == SOUTH) {
        cursorRow += 1
        if (cursorRow >= height) { return false }
        if (map[cursorRow][cursorCol].blocked) { cursorRow -= 1; direction = WEST }
        return true
    }

    if (direction == EAST) {
        cursorCol += 1
        if (cursorCol >= width) { return false }
        if (map[cursorRow][cursorCol].blocked) { cursorCol -= 1; direction = SOUTH }
        return true
    }

    if (direction == WEST) {
        cursorCol -= 1
        if (cursorCol < 0) { return false }
        if (map[cursorRow][cursorCol].blocked) { cursorCol += 1; direction = NORTH }
        return true
    }
}

///////////////////////////////////////////////////////////////////////////////

function walkCandidateMaps() {

    const homeId = homeRow + "~" + homeCol
    
    testedCells[homeId] = true // avoids blocking home (later)
    
    while (true) {
    
        const previousCell = originalPath.shift()
        
        const blockingCell = originalPath[0]
        
        if (blockingCell == undefined) { return }        
        
        const blockingCellId = blockingCell.row + "~" + blockingCell.col
        
        if (testedCells[blockingCellId] != undefined) { continue }
        
        testedCells[blockingCellId] = true
        
        map[blockingCell.row][blockingCell.col].blocked = true
        
        walkCandidateMap(previousCell.row, previousCell.col, previousCell.direction)
        
        map[blockingCell.row][blockingCell.col].blocked = false
    }
}

function walkCandidateMap(startRow, startCol, startDirection) {

    cursorRow = startRow
    cursorCol = startCol    
    direction = startDirection
    
    currentWalk += 1
        
    while (true) {
    
        const status = walkCandidateMapSegment()
    
        if (status == "out")  { return }        
        
        if (status == "loop") { countOfLoopPaths += 1; return }
    }
}

///////////////////////////////////////////////////////////////////////////////

function walkCandidateMapSegment() { // checks only the spinning cells (the ones right before the blocked cells)

    if (direction == NORTH) { return walkCandidateMapNorth() }
    if (direction == SOUTH) { return walkCandidateMapSouth() }
    if (direction == EAST)  { return walkCandidateMapEast()  }
    if (direction == WEST)  { return walkCandidateMapWest()  }
}

function walkCandidateMapNorth() {

    while (true) {

        cursorRow -= 1

        if (cursorRow < 0) { cursorRow += 1; return "out" }

        const nextCell = map[cursorRow][cursorCol]
    
        if (! nextCell.blocked) { continue }
    
        cursorRow += 1
        
        const currentCell = map[cursorRow][cursorCol]
    
        maybeResetCell(currentCell)

        if (currentCell.walkedNorth) { return "loop" }
    
        currentCell.walkedNorth = true
        
        direction = EAST
    
        return ""
    }
}

function walkCandidateMapSouth() {

    while (true) {

        cursorRow += 1

        if (cursorRow == height) { cursorRow -= 1; return "out" }

        const nextCell = map[cursorRow][cursorCol]
    
        if (! nextCell.blocked) { continue }
    
        cursorRow -= 1
        
        const currentCell = map[cursorRow][cursorCol]
    
        maybeResetCell(currentCell)

        if (currentCell.walkedSouth) { return "loop" }
    
        currentCell.walkedSouth = true
        
        direction = WEST
    
        return ""
    }
}

function walkCandidateMapEast() {

    while (true) {

        cursorCol += 1

        if (cursorCol == width) { cursorCol -= 1; return "out" }

        const nextCell = map[cursorRow][cursorCol]
    
        if (! nextCell.blocked) { continue }
    
        cursorCol -= 1
        
        const currentCell = map[cursorRow][cursorCol]
    
        maybeResetCell(currentCell)

        if (currentCell.walkedEast) { return "loop" }
    
        currentCell.walkedEast = true
        
        direction = SOUTH
    
        return ""
    }
}

function walkCandidateMapWest() {

    while (true) {

        cursorCol -= 1

        if (cursorCol < 0) { cursorCol += 1; return "out" }

        const nextCell = map[cursorRow][cursorCol]
    
        if (! nextCell.blocked) { continue }
    
        cursorCol += 1
        
        const currentCell = map[cursorRow][cursorCol]
    
        maybeResetCell(currentCell)

        if (currentCell.walkedWest) { return "loop" }
    
        currentCell.walkedWest = true
        
        direction = NORTH
    
        return ""
    }
}

function maybeResetCell(cell) {

    if (cell.walkId == currentWalk) { return }
    
    cell.walkId = currentWalk
    cell.walkedNorth = false
    cell.walkedSouth = false
    cell.walkedEast = false
    cell.walkedWest = false
}

console.time("execution time")
main()
console.timeEnd("execution time") // 50ms

