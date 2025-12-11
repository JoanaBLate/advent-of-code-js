// solution for https://adventofcode.com/2025/day/9 part 1

"use strict"

const input = Deno.readTextFileSync("day09-input.txt").trim()

const allRedTiles = [ ] 

var largestArea = 0

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { processInputLine(rawLine.trim()) }
    
    searchAllRectangles()

    console.log("the answer is", largestArea)
}

function processInputLine(line) {

    const tokens = line.split(",")
    
    const col = parseInt(tokens.shift())
    const row = parseInt(tokens.shift())
    
    const tile = { "row": row, "col": col }
    
    allRedTiles.push(tile)
}

function searchAllRectangles() {

    const len = allRedTiles.length
    
    for (let indexA = 0; indexA < len; indexA++) {
    
        for (let indexB = indexA + 1; indexB < len; indexB++) {
                
            const tileA = allRedTiles[indexA]
            const tileB = allRedTiles[indexB]
            
            const width  = 1 + Math.abs(tileB.col - tileA.col)
            const height = 1 + Math.abs(tileB.row - tileA.row)

            const area = width * height
            
            if (area > largestArea) { largestArea = area }
        }
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

