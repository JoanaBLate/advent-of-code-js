"use strict"

// solving the puzzle takes (my computer) 0.025s

const map = [ ]

var width = 0
var height = 0


function main() {

    processInput()
    
    let count = 0
    
    let col = -3
    
    for (let row = 0; row < height; row++) {    

        col += 3

        if (map[row][col % width] == "#") { count += 1 }
    }
    
    console.log("the answer is", count)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { map.push(line.trim()) }
    
    height = map.length
    width = map[0].length
}


main()

