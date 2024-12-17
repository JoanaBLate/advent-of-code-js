// solution for https://adventofcode.com/2024/day/4 part 2

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

    if (allLines[row][col] != "A") { return }
    
    if (! isGoodDiagonal(row - 1, col - 1, row + 1, col + 1)) { return }
    if (! isGoodDiagonal(row - 1, col + 1, row + 1, col - 1)) { return }
    
    xmasCount += 1
}

function isGoodDiagonal(rowA, colA, rowB, colB) {

    const a = symbolAt(rowA, colA)
    const b = symbolAt(rowB, colB)
    
    if (a == "M"  &&  b == "S") { return true }
    if (a == "S"  &&  b == "M") { return true }
    
    return false
}

function symbolAt(row, col) {

    if (row < 0) { return "" }
    if (col < 0) { return "" }

    if (row >= height) { return "" }
    if (col >= width)  { return "" }

    return allLines[row][col]
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

