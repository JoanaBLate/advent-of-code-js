// solution for https://adventofcode.com/2024/day/8 part 2

"use strict"

const input = Deno.readTextFileSync("day08-input.txt").trim()

const map = [ ]

const allAntennas = { }

var width = 0
var height = 0

const allAntinodes = { }


function main() {

    processInput()
    
    const symbols = Object.keys(allAntennas)
    
    for (const symbol of symbols) { findAntinodes(allAntennas[symbol]) }
    
    console.log("the answer is", Object.keys(allAntinodes).length)
}

function processInput() {
        
    const lines = input.split("\n")
    
    let row = -1
    
    for (const rawLine of lines) { 
    
        row += 1
    
        const line = rawLine.trim()
        
        map.push(line)
        
        let col = -1
        
        for (const symbol of line) {
        
            col += 1   
            
            if (symbol == ".") { continue }
            
            if (allAntennas[symbol] == undefined) { allAntennas[symbol] = [ ] }
            
            allAntennas[symbol].push({ "row": row, "col": col })
        }
    }
    
    height = map.length
    width = map[0].length
}

function findAntinodes(antennas) {

    const off = antennas.length
    
    for (let n = 0; n < off - 1; n++) {
        for (let p = n + 1; p < off; p++) {

            const a = antennas[n]
            const b = antennas[p]
            
            findAntinodesFor(a, b)
        }
    }
}

function findAntinodesFor(a, b) {

    const deltaRow = b.row - a.row
    const deltaCol = b.col - a.col

    registerAntinodes(a.row, a.col, deltaRow, deltaCol) // forward
    registerAntinodes(a.row, a.col, deltaRow * -1, deltaCol * -1) // backwards
}

function registerAntinodes(baseRow, baseCol, deltaRow, deltaCol) {

    let row = baseRow
    let col = baseCol
    
    while (true) {
        
        allAntinodes[row + ":" + col] = true
        
        row += deltaRow
        col += deltaCol
        
        if (row < 0) { return }
        if (col < 0) { return }
        if (row >= height) { return }
        if (col >= width)  { return }
    }
}
    
console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

