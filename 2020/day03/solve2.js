"use strict"

// solving the puzzle takes (my computer) 0.025s

const map = [ ]

var width = 0
var height = 0


function main() {

    processInput()
    
    const a = runOnce(1, 1)
    const b = runOnce(1, 3)
    const c = runOnce(1, 5)
    const d = runOnce(1, 7)
    const e = runOnce(2, 1)
    
    console.log("the answer is", a * b * c * d * e)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { map.push(line.trim()) }
    
    height = map.length
    width = map[0].length
}

function runOnce(deltaRow, deltaCol) {

    let count = 0
        
    let col = -deltaCol
    
    for (let row = 0; row < height; row += deltaRow) { 
    
        col += deltaCol

        if (map[row][col % width] == "#") { count += 1 }
    }
    
    return count
}

main()

