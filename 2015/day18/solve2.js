"use strict"

// solving the puzzle takes (my computer) .062s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    // We need to represent a grid of 100 vs 100 integers (0 or 1).
    // We could create a bi-dimensional array for that (matrix).
    // But I am going to use a single dimension array of 100 * 100 items.
    
    const grid = [ ]
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const line = rawLine.trim()
        
        for (const c of line) { 
        
            const value = (c == "#") ? 1 : 0

            grid.push(value)
        }
    }
    
    stuckLights(grid)
    
    for (let n = 0; n < 100; n++) { processGridOnce(grid); stuckLights(grid) }
    
    let total = 0
    
    for (const light of grid) { total += light }
    
    console.log("total lights on is", total)
}

function processGridOnce(grid) {

    const ref = grid.slice()
    
    for (let x = 0; x < 100; x++) {
        for (let y = 0; y < 100; y++) {
            
            const index = y * 100 + x
    
            const lightIsOn = ref[index]
            
            const neighbors = getNeighbors(ref, x, y)
            
            if (lightIsOn) {
            
                if (neighbors != 2  &&  neighbors != 3) { grid[index] = false }
            }
            else {
            
                if (neighbors == 3) { grid[index] = true }
            }
        }
    }
}

function stuckLights(grid) {

    grid[ 0 * 100 +  0] = 1

    grid[ 0 * 100 + 99] = 1

    grid[99 * 100 +  0] = 1

    grid[99 * 100 + 99] = 1
}

function getNeighbors(ref, x, y) { // skips x,y because it is the current light not its neighbor

    let count = 0 +
    
    getNeighbor(ref, x-1, y-1) +
    getNeighbor(ref, x  , y-1) +
    getNeighbor(ref, x+1, y-1) +
    
    getNeighbor(ref, x-1, y) +
    getNeighbor(ref, x+1, y) +
    
    getNeighbor(ref, x-1, y+1) +
    getNeighbor(ref, x  , y+1) +
    getNeighbor(ref, x+1, y+1) 
    
    return count
}

function getNeighbor(ref, x, y) {

    if (x < 0 || x > 99) { return 0 }
    if (y < 0 || y > 99) { return 0 }
    
    const index = y * 100 + x 
    
    return ref[index]
}

main()

