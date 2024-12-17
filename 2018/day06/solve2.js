"use strict"

// solving the puzzle takes (my computer) 0.060s

// this program considers an imaginary grid //

const bases = [ ]

var locations = 0

var MAX_X = 0
var MAX_Y = 0

function main() {

    processInput()
    
    findLocations()
     
    console.log("the answer is", locations)
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

function findLocations() {

    for (let x = 0; x <= MAX_X; x++) {

        for (let y = 0; y <= MAX_Y; y++) {

            let distance = 0

            for (const base of bases) {
            
                distance += Math.abs(x - base.x) + Math.abs(y - base.y)
            }
            
            if (distance <= 10000) { locations += 1 } 
        }
    }            
}

function newPoint(x, y) {
    
    return { "x": x, "y": y }
}

main()

