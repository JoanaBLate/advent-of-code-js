"use strict"

// solving the puzzle takes (my computer) 0.150s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const grid = [ ]
    
    for (let n = 0; n < 1000; n++) { grid.push(createGridCol()) } // the grid is ready
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
        
        const endCoordToken = tokens.pop()
        
        tokens.pop() // 'through'
                
        const beginCoordToken = tokens.pop()
        
        const kind = tokens.pop() // 'on', 'off' or 'toggle'

        
        const beginCoordValues = beginCoordToken.split(",")
        
        const beginX = parseInt(beginCoordValues.shift())
        const beginY = parseInt(beginCoordValues.shift())

        
        const endCoordValues = endCoordToken.split(",")
        
        const endX = parseInt(endCoordValues.shift())
        const endY = parseInt(endCoordValues.shift())
        
        //
        
        for (let x = beginX; x <= endX; x++) {
            for (let y = beginY; y <= endY; y++) {
            
                if (kind == "on")  { grid[x][y] = true; continue }
                if (kind == "off") { grid[x][y] = false; continue }
                
                const lit = grid[x][y] 
                grid[x][y] = ! lit // toggle
            }
        }
    }
    
    console.log("total lit lights is", calcTotal(grid))
}

function createGridCol() {

    const col = [ ]
    
    for (let n = 0; n < 1000; n++) { col.push(false) }
    
    return col
}

function calcTotal(grid) {
    
    var total = 0
    
    for (let x = 0; x < 1000; x++) {
        for (let y = 0; y < 1000; y++) {
        
            if (grid[x][y] == true) { total += 1 }
        }
    }
    
    return total
}

main()

