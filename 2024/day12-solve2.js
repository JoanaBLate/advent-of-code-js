// solution for https://adventofcode.com/2024/day/12 part 2

"use strict"

const input = Deno.readTextFileSync("day12-input.txt").trim()

const garden = [ ]
const processed = [ ]

var width = 0
var height = 0

var currentSymbol = ""
var areaSize = 0
var topBorderPlots = { } // by row
var bottomBorderPlots = { } // by row
var leftBorderPlots = { } // by col
var rightBorderPlots = { } // by col

var result = 0


function main() {

    processInput()

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            
            processPlot(row, col)   
        }
    }
    
    console.log("the answer is", result)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { garden.push(line.trim()) }

    height = garden.length
    width = garden[0].length

    for (const line of garden) { 
    
        const doneLine = [ ]
        processed.push(doneLine)
        
        for (const symbol of line) { doneLine.push(false) }
    }
}

///////////////////////////////////////////////////////////////////////////////

function processPlot(row, col) {
    
    if (processed[row][col]) { return }
    
    processed[row][col] = true

    currentSymbol = garden[row][col]

    areaSize = 0
    topBorderPlots = { }
    bottomBorderPlots = { }
    leftBorderPlots = { }
    rightBorderPlots = { }
    
    walkFrom(row, col)
    
    result += areaSize * findNumberOfSides()
}
    
function walkFrom(row, col) {
    
    const pointsToWalk = [ createPoint(row, col) ]
    
    while (true) {
    
        const point = pointsToWalk.pop()
        
        if (point == undefined) { return }
        
        areaSize += 1
        
        const row = point.row
        const col = point.col

        tryCatchNeighbor(row, col, -1,  0, pointsToWalk)
        tryCatchNeighbor(row, col, +1,  0, pointsToWalk)
        tryCatchNeighbor(row, col,  0, -1, pointsToWalk)
        tryCatchNeighbor(row, col,  0, +1, pointsToWalk)
    }
}

function tryCatchNeighbor(baseRow, baseCol, deltaRow, deltaCol, pointsToWalk) {

    const neighborRow = baseRow + deltaRow
    const neighborCol = baseCol + deltaCol

    if (neighborRow < 0) { pushToTopBorderPlots(baseRow, baseCol); return }
    if (neighborCol < 0) { pushToLeftBorderPlots(baseRow, baseCol); return }
    
    if (neighborRow == height) { pushToBottomBorderPlots(baseRow, baseCol); return }
    if (neighborCol == width)  { pushToRightBorderPlots(baseRow, baseCol); return }
    
    if (garden[neighborRow][neighborCol] != currentSymbol) { 
    
        if (neighborRow < baseRow) { pushToTopBorderPlots(baseRow, baseCol); return }
        if (neighborCol < baseCol) { pushToLeftBorderPlots(baseRow, baseCol); return }
    
        if (neighborRow > baseRow) { pushToBottomBorderPlots(baseRow, baseCol); return }
        if (neighborCol > baseCol) { pushToRightBorderPlots(baseRow, baseCol); return }
    }
    
    if (processed[neighborRow][neighborCol]) { return }

    processed[neighborRow][neighborCol] = true
    
    pointsToWalk.push(createPoint(neighborRow, neighborCol))
}        

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function pushToTopBorderPlots(row, col) {

    if (topBorderPlots[row] == undefined) { topBorderPlots[row] = [ ] }
    
    topBorderPlots[row].push(col)
}

function pushToBottomBorderPlots(row, col) {

    if (bottomBorderPlots[row] == undefined) { bottomBorderPlots[row] = [ ] }
    
    bottomBorderPlots[row].push(col)
}

function pushToLeftBorderPlots(row, col) {

    if (leftBorderPlots[col] == undefined) { leftBorderPlots[col] = [ ] }
    
    leftBorderPlots[col].push(row)
}

function pushToRightBorderPlots(row, col) {

    if (rightBorderPlots[col] == undefined) { rightBorderPlots[col] = [ ] }
    
    rightBorderPlots[col].push(row)
}

///////////////////////////////////////////////////////////////////////////////

function findNumberOfSides() {

    let sides = 0
    
    for (const dict of [ topBorderPlots, bottomBorderPlots, leftBorderPlots, rightBorderPlots ]) {
    
        sides += findNumberOfSidesThis(dict)
    }
    return sides
}

function findNumberOfSidesThis(dict) {

    let sides = 0
    
    for (const list of Object.values(dict)) {
    
        sides += findNumberOfSidesThisList(list)
    }
    return sides
}

function findNumberOfSidesThisList(list) {

    list.sort(function (a, b) { return a - b })

    const newList = [ ]
    
    while (true) {
    
        const candidate = list.shift()
        if (candidate == undefined) { break }
        
        const previous = newList.at(-1)
        
        if (previous == undefined) { newList.push(candidate); continue }
        
        if (candidate - previous == 1) { newList.pop() } // removing neighbor on same same side
        
        newList.push(candidate)    
    }
    
    return newList.length
}

console.time("execution time")
main()
console.timeEnd("execution time") // 17ms

