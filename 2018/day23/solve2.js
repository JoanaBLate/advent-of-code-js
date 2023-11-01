"use strict"

// solving the puzzle takes (my computer) 0.170s

const bots = [ ]

var LOW_X = 0
var LOW_Y = 0
var LOW_Z = 0

var HIGH_X = 0
var HIGH_Y = 0
var HIGH_Z = 0

var DIMENSION = 1

var memory = { }



function main() {
    
    processInput()
    
    findManhattanOfBestLocation()
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(">, r=")
        
        const radius = parseInt(parts.pop())
        
        const tokens = parts.shift().replace("pos=<", "").split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        const z = parseInt(tokens.shift())
        
        const bot = { "radius": radius, "x": x, "y": y, "z": z }
        
        bots.push(bot)
        
        if (x < LOW_X) { LOW_X = x }
        if (y < LOW_Y) { LOW_Y = y }
        if (z < LOW_Z) { LOW_Z = z }
        
        if (x > HIGH_X) { HIGH_X = x }
        if (y > HIGH_Y) { HIGH_Y = y }
        if (z > HIGH_Z) { HIGH_Z = z }
    }
}

///////////////////////////////////////////////////////////

function findManhattanOfBestLocation() {

    const dimX = HIGH_X - LOW_X
    const dimY = HIGH_Y - LOW_Y
    const dimZ = HIGH_Z - LOW_Z
    
    const dimension = Math.max(dimX, dimY, dimZ)
        
    while (DIMENSION < dimension) { DIMENSION *= 2 } // power of two; must be big enough to reach all bots
    
    let deltaCount = 1  // power of two; increases/decreases expectedCount
    
    while (deltaCount < bots.length) { deltaCount *= 2 }
    
    let expectedCount = 1

    let bestCount = 0
    let bestManhattan = 0      

    let data = null
    
    while (true) {
            
        data = mainSearch(expectedCount)

        if (data == null) { // expectedCount was too big :(
        
            if (deltaCount > 1) { deltaCount = Math.floor(deltaCount / 2) }
            
            expectedCount = Math.max(1, expectedCount - deltaCount)
        }
        else { // expectedCount was met!
            
            if (data.count > bestCount) { bestCount = data.count; bestManhattan = data.manhattan  }
            
            if (deltaCount == 1) { break } // cannot be better than this: the solution was found

            expectedCount += deltaCount
        }
    }
    
    const s = "(" + bestCount + " bots at x:" + data.x + " y:" + data.y + " z:" + data.z + ")"
    
    console.log("the answer is", bestManhattan, s)
}

///////////////////////////////////////////////////////////

function mainSearch(expectedCount) {

    if (memory[expectedCount] === null) { return null }

    if (memory[expectedCount] == undefined) {
    
        memory[expectedCount] = search(LOW_X, HIGH_X, LOW_Y, HIGH_Y, LOW_Z, HIGH_Z, DIMENSION, expectedCount)
    }   
    return memory[expectedCount]
}

function search(lowX, highX, lowY, highY, lowZ, highZ, step, expectedCount) { // recursive

    const positions = getPossiblePositions(lowX, highX, lowY, highY, lowZ, highZ, step, expectedCount)

    while (positions.length > 0) {
    
        let best = positions[0]
        let bestIndex = 0
        
        for (let index = 0; index < positions.length; index++) {
        
            const candidate = positions[index]
            
            if (candidate.manhattan < best.manhattan) { best = candidate; bestIndex = index }
        }

        if (step == 1) { return best } // the solution!
            
        // searching recursively, increasing the accuracy:
        
        const half = Math.floor(step / 2)
        
        lowX = best.x; highX = lowX + half
        
        lowY = best.y; highY = lowY + half
        
        lowZ = best.z; highZ = lowZ + half
        
        const data = search(lowX, highX, lowY, highY, lowZ, highZ, half, expectedCount)
        
        if (data == null) { 
        
            positions.splice(bestIndex, 1) // removing this position: doesn't match expectedCount
        }
        else { 
            return data // expectedCount matched!
        }
    }
    return null // no position matched expectedCount
}

///////////////////////////////////////////////////////////

function getPossiblePositions(lowX, highX, lowY, highY, lowZ, highZ, step, expectedCount) { 
    
    const positions = [ ]

    for (let x = lowX; x <= highX; x += step) {
    
        for (let y = lowY; y <= highY; y += step) {
        
            for (let z = lowZ; z <= highZ; z += step) {

                let count = countBotsInRange(x, y, z, step)

                if (count < expectedCount) { continue }
            
                const manhattan = Math.abs(x) + Math.abs(y) + Math.abs(z) 
                
                const data = { "x": x, "y": y, "z": z, "count": count, "manhattan": manhattan }
                
                positions.push(data)
            }
        }
    }    
    return positions
}

function countBotsInRange(x, y, z, step) {

    let count = 0
    
    for (const bot of bots) {

        const distance = Math.abs(x - bot.x) + Math.abs(y - bot.y) + Math.abs(z - bot.z) // manhattan system
        
        if (step == 1) {
        
            if (distance <= bot.radius) { count += 1 }
        }
        else {
            // optimistic count, to be confirmed/polished later
            
            if (distance - (3 * step) <= bot.radius) { count += 1 }
        }
    }      
    return count
}  

///////////////////////////////////////////////////////////

main()

