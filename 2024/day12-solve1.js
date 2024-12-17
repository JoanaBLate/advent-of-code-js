// solution for https://adventofcode.com/2024/day/12 part 1

"use strict"

const input = Deno.readTextFileSync("day12-input.txt").trim()

const garden = [ ]
const processed = [ ]

var width = 0
var height = 0

var currentSymbol = ""
var areaSize = 0
var areaPerimeter = 0

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
    areaPerimeter = 0
    
    walkFrom(row, col)
    
    result += areaSize * areaPerimeter
}
    
function walkFrom(row, col) {
    
    const pointsToWalk = [ createPoint(row, col) ]
    
    while (true) {
    
        const point = pointsToWalk.pop()
        
        if (point == undefined) { return }
        
        areaSize += 1
        
        const row = point.row
        const col = point.col

        tryCatchNeighbor(row - 1, col, pointsToWalk)
        tryCatchNeighbor(row + 1, col, pointsToWalk)
        tryCatchNeighbor(row, col + 1, pointsToWalk)
        tryCatchNeighbor(row, col - 1, pointsToWalk)
    }
}

function tryCatchNeighbor(row, col, pointsToWalk) {

    if (row < 0) { areaPerimeter += 1; return }
    if (col < 0) { areaPerimeter += 1; return }
    if (row == height) { areaPerimeter += 1; return }
    if (col == width)  { areaPerimeter += 1; return }
    
    if (garden[row][col] != currentSymbol) { areaPerimeter += 1; return }
    
    if (processed[row][col]) { return }

    processed[row][col] = true
    
    pointsToWalk.push(createPoint(row, col))
}        

function createPoint(row, col) {

    return { "row": row, "col": col }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 9ms

