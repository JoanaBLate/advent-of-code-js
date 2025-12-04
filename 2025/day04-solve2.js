// solution for https://adventofcode.com/2025/day/4 part 2

"use strict"

const input = Deno.readTextFileSync("day04-input.txt").trim()

const map = [ ]

var width = 0

var height = 0

const removals = [ ] // [ row, col, row, col... ]

var result = 0

function main() {

    fillMap()
    
    width = map[0].length
    
    height = map.length
    
    while (true) {
            
        processMapOnce()
        
        if (removals.length == 0) { break }
        
        result += removals.length / 2
    
        applyRemovals()
    }
    
    console.log("the answer is", result)
}

function fillMap() {

    const rawLines = input.split("\n")

    for (const rawLine of rawLines) { 
    
        const boolLine = [ ]
    
        const line = rawLine.trim()
        
        for (const c of line) {
        
            const bool = (c == "@") ? true : false 
            
            boolLine.push(bool)
        }
                
        map.push(boolLine)
    }
} 

function processMapOnce() {

    for (let row = 0; row < height; row++) {

        for (let col = 0; col < width; col++) {
        
            processPosition(row, col)
        }
    }
}
    
function processPosition(centerRow, centerCol) {

    if (map[centerRow][centerCol] != true) { return }

    let rolls = 0
    
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {

        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        
            if (deltaRow == 0  &&  deltaCol == 0) { continue } // center position
            
            const row = centerRow + deltaRow
            const col = centerCol + deltaCol
            
            if (row < 0  || row >= height) { continue }
            if (col < 0  || col >= width)  { continue }
        
            if (map[row][col] == true) { rolls += 1 }
        }
    }
    
    if (rolls < 4) { removals.push(centerRow); removals.push(centerCol) }
}

function applyRemovals() {

    while (removals.length > 0) {
    
        map[removals.shift()][removals.shift()] = false    
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 22ms

