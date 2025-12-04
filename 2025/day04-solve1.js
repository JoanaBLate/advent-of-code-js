// solution for https://adventofcode.com/2025/day/4 part 1

"use strict"

const input = Deno.readTextFileSync("day04-input.txt").trim()

const map = [ ]

var width = 0

var height = 0

var counter = 0

function main() {

    const rawLines = input.split("\n")

    for (const rawLine of rawLines) { map.push(rawLine.trim()) }
    
    width = map[0].length
    
    height = map.length
    
    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) {
        
            checkPosition(row, col)
        }
    }
    
    console.log("the answer is", counter)
}

function checkPosition(centerRow, centerCol) {

    if (map[centerRow][centerCol] != "@") { return }

    let rolls = 0
    
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {

        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        
            if (deltaRow == 0  &&  deltaCol == 0) { continue } // center position
            
            const row = centerRow + deltaRow
            const col = centerCol + deltaCol
            
            if (row < 0  || row >= height) { continue }
            if (col < 0  || col >= width)  { continue }
        
            if (map[row][col] == "@") { rolls += 1 }
        }
    }
    
    if (rolls < 4) { counter += 1 }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 3ms

