"use strict"

// solving the puzzle takes (my computer) 0.035s

/*

    HEXAGONAL COORDINATES (for this puzzle)

    even = row zero
    odd = its neighbor 

    e -> col += 1
    w -> col -= 1
    
    ne -> row -= 1; (odd)  col += 1
    nw -> row -= 1; (even) col -= 1

    se -> row += 1; (odd)  col += 1
    sw -> row += 1; (even) col -= 1

*/


const input = Deno.readTextFileSync("input.txt").trim()

const PATHS = [ ]

const TILES = { }


function main() {

    processInput()
    
    for (const path of PATHS) { walk(path) }
    
    console.log("the answer is", countBlackTiles())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { PATHS.push(parsePath(line.trim())) }
}

function parsePath(line) {

    const list = [ ]
    
    while (line != "") {
    
        if (line[0] == "e"  ||  line[0] == "w") { 
        
            list.push(line[0]); line = line.substr(1)
        }
        else {
        
            list.push(line.substr(0, 2)); line = line.substr(2)
        }    
    }
    return list
}

///////////////////////////////////////////////////////////

function walk(path) {

    let row = 0
    let col = 0

    for (const step of path) {
    
        if (step == "e") { col += 1; continue }
        if (step == "w") { col -= 1; continue }
        
        if (step[0] == "n") { row -= 1 } else { row += 1 }

        const oddRow = (row % 2 != 0)
        
        const evenRow = ! oddRow
        
        if (step[1] == "w"  && evenRow) { col -= 1 }        
        
        if (step[1] == "e"  && oddRow)  { col += 1 }
    }
    
    const id = row + "~" + col
    
    if (TILES[id] == undefined) { TILES[id] = 1; return }
    
    TILES[id] += 1
}

function countBlackTiles() {

    let count = 0
    
    const values = Object.values(TILES)
        
    for (const val of values) { if (val % 2 != 0) { count += 1 } }
    
    return count
}
    
main()

