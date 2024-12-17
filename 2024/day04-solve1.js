// solution for https://adventofcode.com/2024/day/4 part 1

"use strict"

const input = Deno.readTextFileSync("day04-input.txt").trim()

const allLines = [ ]

var width = 0
var height = 0

var xmasCount = 0

function main() {

    processInput()

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            
            checkXmasAt(row, col)   
        }
    }
    
    console.log("the answer is", xmasCount)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { allLines.push(line.trim()) }
    
    height = allLines.length
    width = allLines[0].length
}

function checkXmasAt(row, col) {

    if (allLines[row][col] != "X") { return }
    
    checkXmasToEast(row, col)
    checkXmasToWest(row, col)
    checkXmasToNorth(row, col)
    checkXmasToSouth(row, col)
    checkXmasToNorthEast(row, col)
    checkXmasToNorthWest(row, col)
    checkXmasToSouthEast(row, col)
    checkXmasToSouthWest(row, col)
}

function gotMatch(row, col, symbol) {

    if (row < 0) { return false }
    if (col < 0) { return false }

    if (row >= height) { return false }
    if (col >= width)  { return false }

    return allLines[row][col] == symbol
}

///////////////////////////////////////////////////////////////////////////////

function checkXmasToEast(row, col) {
    if (! gotMatch(row, col + 1,  "M")) { return }
    if (! gotMatch(row, col + 2,  "A")) { return }
    if (! gotMatch(row, col + 3,  "S")) { return }
    xmasCount += 1
}

function checkXmasToWest(row, col) {
    if (! gotMatch(row, col - 1,  "M")) { return }
    if (! gotMatch(row, col - 2,  "A")) { return }
    if (! gotMatch(row, col - 3,  "S")) { return }
    xmasCount += 1
}

function checkXmasToNorth(row, col) {
    if (! gotMatch(row - 1, col,  "M")) { return }
    if (! gotMatch(row - 2, col,  "A")) { return }
    if (! gotMatch(row - 3, col,  "S")) { return }
    xmasCount += 1
}

function checkXmasToSouth(row, col) {
    if (! gotMatch(row + 1, col,  "M")) { return }
    if (! gotMatch(row + 2, col,  "A")) { return }
    if (! gotMatch(row + 3, col,  "S")) { return }
    xmasCount += 1
}

function checkXmasToNorthEast(row, col) {
    if (! gotMatch(row - 1, col + 1,  "M")) { return }
    if (! gotMatch(row - 2, col + 2,  "A")) { return }
    if (! gotMatch(row - 3, col + 3,  "S")) { return }
    xmasCount += 1
}

function checkXmasToNorthWest(row, col) {
    if (! gotMatch(row - 1, col - 1,  "M")) { return }
    if (! gotMatch(row - 2, col - 2,  "A")) { return }
    if (! gotMatch(row - 3, col - 3,  "S")) { return }
    xmasCount += 1
}

function checkXmasToSouthEast(row, col) {
    if (! gotMatch(row + 1, col + 1,  "M")) { return }
    if (! gotMatch(row + 2, col + 2,  "A")) { return }
    if (! gotMatch(row + 3, col + 3,  "S")) { return }
    xmasCount += 1
}

function checkXmasToSouthWest(row, col) {
    if (! gotMatch(row + 1, col - 1,  "M")) { return }
    if (! gotMatch(row + 2, col - 2,  "A")) { return }
    if (! gotMatch(row + 3, col - 3,  "S")) { return }
    xmasCount += 1
}

console.time("execution time")
main()
console.timeEnd("execution time") // 5ms

