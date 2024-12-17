// solution for https://adventofcode.com/2024/day/10 part 1

"use strict"

const input = Deno.readTextFileSync("day10-input.txt").trim()

const table = [ ]

var width = 0
var height = 0 


function main() {

    processInput()

    startTrails()
    continueTrails()
        
    console.log("the answer is", countScores())
}

function processInput() {
        
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) {
    
        const line = [ ]
        table.push(line)
    
        const strDigits = rawLine.trim().split("")
        
        for (const  strDigit of strDigits) { line.push(createCell(strDigit)) }    
    }

    width = table[0].length
    height = table.length
}

function createCell(strDigit) {
    return {
        "height": parseInt(strDigit),
        "trailheads": [ ]
    }
}

///////////////////////////////////////////////////////////////////////////////

function startTrails() {

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            const cell = table[row][col]
            
            if (cell.height != 0) { continue }
            
            cell.trailheads.push(row + "~" + col)
        }
    }
}

function continueTrails() {

    for (let height = 0; height < 9; height++) { continueTrailsFrom(height) }
}

function continueTrailsFrom(targetHeight) {

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            const cell = table[row][col]
            
            if (cell.height != targetHeight) { continue }
            
            continueTrailThis(targetHeight + 1, cell.trailheads, row - 1, col)
            continueTrailThis(targetHeight + 1, cell.trailheads, row + 1, col)
            continueTrailThis(targetHeight + 1, cell.trailheads, row, col - 1)
            continueTrailThis(targetHeight + 1, cell.trailheads, row, col + 1)            
        }
    }
}
    
function continueTrailThis(targetHeight, trailheads, row, col) {
    
    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row == height) { return }
    if (col == width)  { return }

    const cell = table[row][col]
    
    if (cell.height != targetHeight) { return }    
    
    for (const trailhead of trailheads) {
    
        if (! cell.trailheads.includes(trailhead)) { cell.trailheads.push(trailhead) }    
    }
}

///////////////////////////////////////////////////////////////////////////////

function countScores() {

    let scores = 0

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {

            const cell = table[row][col]
            
            if (cell.height == 9) { scores += cell.trailheads.length }
        }
    }
    
    return scores
}

console.time("execution time")
main()
console.timeEnd("execution time") // 5ms

