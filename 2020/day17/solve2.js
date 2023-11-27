"use strict"

// solving the puzzle takes (my computer) 0.220s

const hypercubes = { }

const hyperkeys = [ ]

const GHOST = 13   // fourth dimension
const DEPTH = 13
const WIDTH = 20   // FOR A 8X8 INITIAL GRID
const HEIGHT = 20  // FOR A 8X8 INITIAL GRID


function main() {

    fillHypercubes() 
    
    processInput()
    
    let round = 0
    
    while (round < 6) {
    
        round += 1

        executeCensus()
    
        repopulateAndResetNeighbours()
    }
    
    console.log("the answer is", countActive())
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")

    const thisHeight = lines.length

    const thisWidth = lines[0].trim().length
    
    const heightOffset = Math.floor((HEIGHT - thisHeight) / 2)
    
    const widthOffset = Math.floor((WIDTH - thisWidth) / 2)   
        
    for (let row = 0; row < thisHeight; row++) { 
    
        for (let col = 0; col < thisWidth; col++) { 
    
            if (lines[row][col] != "#") { continue }
            
            const key = "6~6~" + (heightOffset + row) + "~" + (widthOffset + col) // fills the center of the whole damn thing
            
            hypercubes[key].full = true
        }
    }
}

///////////////////////////////////////////////////////////

function fillHypercubes() { // NO negative indices

    for (let ghost = 0; ghost < GHOST; ghost++) { 

        for (let depth = 0; depth < DEPTH; depth++) { 

            for (let row = 0; row < HEIGHT; row++) { 
    
                for (let col = 0; col < WIDTH; col++) { 
        
                    const key = ghost + "~" + depth + "~" + row + "~" + col
                    
                    hyperkeys.push(key)
                    
                    hypercubes[key] = { "full": false, "neighbors": 0 }
                }
            }
        }
    }
    Object.seal(hypercubes)
}
    
///////////////////////////////////////////////////////////

function executeCensus() { 

    for (const key of hyperkeys) { 
    
        const hypercube = hypercubes[key]

        if (hypercube.full) { executeCensusFor(key) }
    }
}

function executeCensusFor(key) {

    const coords = key.split("~")
    
    const ghost = parseInt(coords.shift())
    const depth = parseInt(coords.shift())
    const row   = parseInt(coords.shift())
    const col   = parseInt(coords.shift())
    
    for (let g = ghost - 1; g <= ghost + 1; g++) { 

        for (let d = depth - 1; d <= depth + 1; d++) { 

            for (let r = row - 1; r <= row + 1; r++) { 
    
                for (let c = col - 1; c <= col + 1; c++) { 
        
                    const newKey = g + "~" + d + "~" + r + "~" + c
                    
                    if (newKey == key) { continue } // skips itself
                    
                    const hypercube = hypercubes[newKey]
                    
                    if (hypercube == undefined) { continue }
                    
                    hypercube.neighbors += 1
                }
            }
        }
    }
}

///////////////////////////////////////////////////////////

function repopulateAndResetNeighbours() {

    for (const key of hyperkeys) { 
    
        const hypercube = hypercubes[key]
                
        if (hypercube.full) {
        
            if (hypercube.neighbors < 2  ||  hypercube.neighbors > 3) { hypercube.full = false }
        }
        
        else { // it is "."
        
            if (hypercube.neighbors == 3) { hypercube.full = true }
        }
        
        hypercube.neighbors = 0
    }
}

///////////////////////////////////////////////////////////

function countActive() {

    let count = 0
    
    for (const key of hyperkeys) { 
    
        if (hypercubes[key].full) { count += 1 } 
    }

    return count
}

main()

