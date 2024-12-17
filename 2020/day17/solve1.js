"use strict"

// solving the puzzle takes (my computer) 0.050s

const allLayers = [ ]

const DEPTH = 13
const WIDTH = 20   // FOR A 8X8 INITIAL GRID
const HEIGHT = 20  // FOR A 8X8 INITIAL GRID


function main() {

    for (let n = 0; n < DEPTH; n++) { allLayers.push(createLayer()) }
    
    processInput()
    
    let round = 0
    
    while (round < 6) {
    
        round += 1

        executeCensus()
    
        repopulate()
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
        
    const map = allLayers[6].map
    
    for (let row = 0; row < thisHeight; row++) { 
    
        for (let col = 0; col < thisWidth; col++) { 
    
            map[heightOffset + row][widthOffset + col] = lines[row][col]
        }
    }
}

function createLayer() {

    const string = ".".repeat(WIDTH)

    const map = [ ]
    
    const census = new Array(HEIGHT)
    
    for (let row = 0; row < HEIGHT; row++) { 
    
        map.push(string.split(""))
    
        census[row] = new Uint8Array(WIDTH)
    }    

    return { "map": map, "census": census }
}

///////////////////////////////////////////////////////////

function executeCensus() {

    for (let n = 0; n < DEPTH; n++) { executeCensusFor(n) }
}

function executeCensusFor(index) {
    
    const previous = allLayers[index - 1]

    const current = allLayers[index]
 
    const next = allLayers[index + 1]

    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {
        
            let count = 0
            
            count += countNeighbor(previous, row-1, col-1)
            count += countNeighbor(previous, row-1, col  )
            count += countNeighbor(previous, row-1, col+1)
            //
            count += countNeighbor(previous, row , col-1)
            count += countNeighbor(previous, row , col  )
            count += countNeighbor(previous, row , col+1)
            //            
            count += countNeighbor(previous, row+1, col-1)
            count += countNeighbor(previous, row+1, col  )
            count += countNeighbor(previous, row+1, col+1)


            count += countNeighbor(current, row-1, col-1)
            count += countNeighbor(current, row-1, col  )
            count += countNeighbor(current, row-1, col+1)
            //
            count += countNeighbor(current, row , col-1)
         // count += countNeighbor(current, row , col  ) // skips it self
            count += countNeighbor(current, row , col+1)
            //            
            count += countNeighbor(current, row+1, col-1)
            count += countNeighbor(current, row+1, col  )
            count += countNeighbor(current, row+1, col+1)
            

            count += countNeighbor(next, row-1, col-1)
            count += countNeighbor(next, row-1, col  )
            count += countNeighbor(next, row-1, col+1)
            //
            count += countNeighbor(next, row , col-1)
            count += countNeighbor(next, row , col  )
            count += countNeighbor(next, row , col+1)
            //            
            count += countNeighbor(next, row+1, col-1)
            count += countNeighbor(next, row+1, col  )
            count += countNeighbor(next, row+1, col+1)
            
            current.census[row][col] = count
        }
    }
}

function countNeighbor(layer, row, col) {

    if (layer == undefined) { return 0 }

    if (row < 0) { return 0 }
    if (col < 0) { return 0 }
    
    if (row > HEIGHT - 1) { return 0 }
    if (col > WIDTH  - 1) { return 0 }
    
    return (layer.map[row][col] == "#") ? 1 : 0
}

///////////////////////////////////////////////////////////

function repopulate() {

    for (let n = 0; n < DEPTH; n++) { repopulateThis(allLayers[n]) }
}

function repopulateThis(layer) {

    const map = layer.map
    const census = layer.census
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {
        
            const neighbors = census[row][col]
        
            if (map[row][col] == "#") {
            
                if (neighbors < 2  ||  neighbors > 3) { map[row][col] = "." }
            }
            
            else { // it is "."
            
                if (neighbors == 3) { map[row][col] = "#" }
            }
        }
    }
}

///////////////////////////////////////////////////////////

function countActive() {

    let count = 0
    
    for (const layer of allLayers) { count += countActiveThis(layer.map) }

    return count
}

function countActiveThis(map) {

    let count = 0
    
    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {
        
            if (map[row][col] == "#") { count += 1 }
        }
    }
    return count
}

///////////////////////////////////////////////////////////

function show(obj, label) {

    label = label || ""
    
    console.log("\n" + label)
    
    for (const row of obj.map) { console.log("", row.join(" ")) }
    
    console.log("")
    
    for (const row of obj.census) { 
    
        let s = ""
        for (const item of row) { s += item.toString().padStart(2) }
        console.log(s)
    }
}

main()

