"use strict"

// solving the puzzle takes (my computer) 0.060s

// this program considers an imaginary grid //

const bases = [ ]

const sizes = [ ]

var MAX_X = 0
var MAX_Y = 0

function main() {

    processInput()
    
    fillSizes()
    
    resetSizesByEdge()
    
    sizes.sort(function (a, b) { return b - a })
     
    console.log("the answer is", sizes[0])
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        
        if (x > MAX_X) { MAX_X = x }
        if (y > MAX_Y) { MAX_Y = y }
        
        bases.push(newPoint(x, y))
    }
}

function fillSizes() {

    for (const base of bases) { sizes.push(0) } // base is just a helper
    
    for (let x = 0; x <= MAX_X; x++) {

        for (let y = 0; y <= MAX_Y; y++) {

            const ids = findClosestBases(x, y)
            
            if (ids.length > 1) { continue } // match
            
            const id = ids[0]            
            
            sizes[id] += 1
        }
    }            
}

function findClosestBases(x, y) {

    let bestIds = [ ]
    let bestDistance = 999999999

    for (let index = 0; index < bases.length; index++) {
    
        const point = bases[index]
        
        const distance = Math.abs(x - point.x) + Math.abs(y - point.y)
        
        if (distance > bestDistance) { continue }
        
        if (distance < bestDistance) { bestDistance = distance; bestIds = [ index ]; continue }
    
        bestIds.push(index) // distance == bestDistance
    }

    return bestIds
}

function resetSizesByEdge() {

    for (let x = 0; x <= MAX_X; x++) { 
    
        resetSizeThis(x, 0)
        resetSizeThis(x, MAX_Y) 
    }
    
    for (let y = 0; y <= MAX_Y; y++) { 
    
        resetSizeThis(0, y)
        resetSizeThis(MAX_X, y) 
    }
}

function resetSizeThis(x, y) {

    const ids = findClosestBases(x, y)
    
    for (const id of ids) { sizes[id] = 0 }
}

function newPoint(x, y) {
    
    return { "x": x, "y": y }
}

main()

