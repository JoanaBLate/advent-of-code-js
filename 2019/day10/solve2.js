"use strict"

// solving the puzzle takes (my computer) 0.040s

const map = [ ]

const asteroids = [ ]

const quadrant0 = [ ]
const quadrant1 = [ ]
const quadrant2 = [ ]
const quadrant3 = [ ]

var shots = 0
var target200 = null


function main() {

    processInput()
    
    let best = 0
    let shooter = null
    
    for (const asteroid of asteroids) { 
    
        const count = countVisibles(asteroid) 
        
        if (count > best) { best = count; shooter = asteroid }    
    }    
    
    for (const target of asteroids) { 
    
        if (target == shooter) { continue }
        
        setSlopeAndFillQuadrant(target, shooter.row, shooter.col)
    }
                  
    while (true) {
    
        shootQuadrant(shooter, quadrant0)        
        shootQuadrant(shooter, quadrant1)        
        shootQuadrant(shooter, quadrant2)        
        shootQuadrant(shooter, quadrant3)
        
        cleanQuadrant(quadrant0)
        cleanQuadrant(quadrant1)
        cleanQuadrant(quadrant2)
        cleanQuadrant(quadrant3)

        if (shots >= 200) { break }
    }
    
    console.log("the answer is", 100 * target200.row + target200.col)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()      
        
    const rawLines = input.split("\n")
    
    let row = -1
    
    for (const rawLine of rawLines) { 
    
        row += 1
    
        const line = rawLine.trim()
        
        map.push(line.split(""))
        
        let col = -1
        
        for (const c of line) { 
        
            col += 1
            if (c == "#") { asteroids.push(createAsteroid(row, col)) }
        }
    }
}

function createAsteroid(row, col) {

    return { "row": row, "col": col, "slope": 0, "dead": false }
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

///////////////////////////////////////////////////////////

function setSlopeAndFillQuadrant(target, baseRow, baseCol) {

    const relativeRow = target.row - baseRow
    const relativeCol = target.col - baseCol
    
    target.slope = Math.abs(relativeCol / relativeRow)
    
    //  the quadrants for relativeRow==zero (slope==Infinity) must be carefully chosen //
    
    if (relativeCol >= 0) { 
    
        if (relativeRow <= 0) { pushIncreasing(target, quadrant0); return }
    
        pushDecreasing(target, quadrant1)
        return 
    }
    
    // relativeCol < 0:
    
    if (relativeRow >= 0) { pushIncreasing(target, quadrant2); return }

    pushDecreasing(target, quadrant3) 
}

function pushIncreasing(asteroid, quadrant) { // increasing slopes order

    for (let index = 0; index < quadrant.length; index++) {
    
        const current = quadrant[index]
        
        if (asteroid.slope < current.slope) { quadrant.splice(index, 0, asteroid); return }
    }
    
    quadrant.push(asteroid)
}

function pushDecreasing(asteroid, quadrant) { // decreasing slopes order

    for (let index = 0; index < quadrant.length; index++) {
    
        const current = quadrant[index]
        
        if (asteroid.slope > current.slope) { quadrant.splice(index, 0, asteroid); return }
    }
    
    quadrant.push(asteroid)
}

///////////////////////////////////////////////////////////

function shootQuadrant(shooter, quadrant) {

    for (const target of quadrant) {

        if (! isVisible(shooter, target)) { continue }
        
        target.dead = true
        
        shots += 1
        
        if (shots == 200) { target200 = target }
    }
}

function cleanQuadrant(quadrant) {

    let index = 0
    
    while (index < quadrant.length) {

        const target = quadrant[index]
        
        if (! target.dead) { index += 1; continue }
        
        quadrant.splice(index, 1)
        
        map[target.row][target.col] = "."
    }
}

main()

