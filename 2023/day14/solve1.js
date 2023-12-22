"use strict"

// solving the puzzle takes (my computer) 0.025s

const map = [ ]

var height = 0

var width = 0


function main() {

    processInput()
    
    sendRocksToNorth()
    
    // show()
    
    console.log("the answer is", countRocks())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        map.push(line.trim().split(""))
    }
    
    height = map.length
    width = map[0].length
}

function sendRocksToNorth() {

    for (let row = 1; row < height; row++) {
    
        for (let col = 0; col < width; col++) {
    
            if (map[row][col] == "O") { sendRockToNorth(row, col) }
        }
    }
}

function sendRockToNorth(row, col) {

    while (row > 0) {
    
        if (map[row - 1][col] != ".") { return }
        
        map[row][col] = "."
        map[row - 1][col] = "O"
        
        row -= 1
    }
}

function countRocks() {

    let sum = 0
    
    for (let n = 0; n < height; n++) { 
    
        const factor = height - n 

        sum += factor * countRocksRow(n)
    }
    
    return sum
}

function countRocksRow(n) {

    let count = 0

    for (const c of map[n]) { if (c == "O") { count += 1 } }
    
    return count
}

function show() {

    for (const line of map) { console.log("  " + line.join(" ")) }
}

main()

