"use strict"

// solving the puzzle takes (my computer) 0.040s

const map = [ ]

const asteroids = [ ]


function main() {

    processInput()
    
    let best = 0
    
    for (const asteroid of asteroids) { 
    
        const count = countVisibles(asteroid) 
        
        if (count > best) { best = count }    
    }
     
    console.log("the answer is", best)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()      
        
    const rawLines = input.split("\n")
    
    let row = -1
    
    for (const rawLine of rawLines) { 
    
        row += 1
    
        const line = rawLine.trim()
        
        map.push(line)
        
        let col = -1
        
        for (const c of line) { 
        
            col += 1
            if (c == "#") { asteroids.push(createAsteroid(row, col)) }
        }
    }
}

function createAsteroid(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function countVisibles(asteroid) {

    let sum = 0
    
    for (const target of asteroids) {
    
        if (asteroid == target) { continue }
        
        if (isVisible(asteroid, target)) { sum += 1 }
    }
    return sum
}

function isVisible(asteroid, target) {

    const deltaRow = target.row - asteroid.row
    const deltaCol = target.col - asteroid.col   

    let row = target.row
    let col = target.col
    
    let steps = 0

    while (true) {
        
        steps += 1
    
        row -= Math.sign(deltaRow)
        
        if (deltaRow == 0) {
        
            col -= Math.sign(deltaCol)
        }
        else {
            const totalColAdvance = steps * deltaCol / Math.abs(deltaRow) // this way we avoid rounding errors
            
            col = target.col - totalColAdvance 
        }
        
        if (row != Math.floor(row)) { continue }
        if (col != Math.floor(col)) { continue }
        
        if (row == asteroid.row  &&  col == asteroid.col) { return true }
        
        if (map[row][col] == "#") { return false }    
    }
}

main()

