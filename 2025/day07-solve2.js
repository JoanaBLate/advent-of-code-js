// solution for https://adventofcode.com/2025/day/7 part 2

"use strict"

  // *NOT* EXPECTING TO FIND SPLITTER (^) ON EDGE COLUMNS (look at the puzzle input) //

const input = Deno.readTextFileSync("day07-input.txt").trim()

const map = [ ] 

const beamLines = [ ] // each line registers the number of timelines that reach it col

var mapWidth = 0

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { map.push(rawLine.trim()) }
    
    mapWidth = map[0].length
    
    fillBeamLines()

    const rootCol = map[0].indexOf("S")
    
    beamLines[0][rootCol] = 1
    
    for (let row = 0; row < beamLines.length - 1; row++) { processBeamLine(row) } // skips last line
    
    let timelines = 0
    
    const lastBeamLine = beamLines[beamLines.length - 1]
    
    for (const value of lastBeamLine) { timelines += value }
      
    console.log("\nthe answer is", timelines)
}

function fillBeamLines() {    
    
    for (const line of map) { beamLines.push([ ]) }
    
    for (const beamLine of beamLines) {
    
        for (let n = 0; n < mapWidth; n++) { beamLine.push(0) }
    }
}

function processBeamLine(row) {

    const currentBeamLine = beamLines[row]

    const nextBeamLine = beamLines[row + 1]
    
    const nextMapLine = map[row + 1]
    
    for (let index = 0; index < mapWidth; index++) {
    
        const currentColValue = currentBeamLine[index]
    
        if (currentColValue == 0) { continue }
    
        if (nextMapLine[index] == ".") { nextBeamLine[index] += currentColValue; continue }
    
        nextBeamLine[index - 1] += currentColValue
        nextBeamLine[index + 1] += currentColValue
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 3ms

