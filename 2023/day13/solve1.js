"use strict"

// solving the puzzle takes (my computer) 0.027s

const maps = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const map of maps) { sum += resultFor(map) }
     
    console.log("the answer is", sum)
}

function resultFor(map) {
      
    const result = 100 * findMirrorTopRows(map)
    
    if (result != 0) { return result }
        
    return findMirrorLeftCols(map)         
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")
    
    for (const part of parts) { 
    
        const map = [ ]
        
        const lines = part.split("\n")
        
        for (const line of lines) { map.push(line.trim()) }
        
        maps.push(map)
    }
}

function rotate(source) {

    const sourceWidth = source[0].length
    
    const sourceHeight = source.length

    const map = [ ]
    
    for (let col = 0; col < sourceWidth; col++) {
    
        let line = ""
        
        for (let row = 0; row < sourceHeight; row++) {
    
            line = source[row][col] + line
        }
        map.push(line)
    }
    return map
}

///////////////////////////////////////////////////////////

function findMirrorLeftCols(map) {

    const rotated = rotate(map)

    return findMirrorTopRows(rotated)
}

///////////////////////////////////////////////////////////

function findMirrorTopRows(map) {

    const height = map.length    
    
    let numberOfTopRows = 0
    
    for (let row = 0; row < height - 1; row++) {
    
        if (map[row] != map[row + 1]) { continue }
        
        if (failsAsMirror(map, row)) { continue }
        
        numberOfTopRows = row + 1
    }        
    
    return numberOfTopRows
}
        
function failsAsMirror(map, start) {
    
    let a = start
    let b = start + 1
    
    while (true) {
    
        a -= 1
        b += 1
        
        if (a < 0) { return false }
        
        if (b == map.length) { return false }
    
        if (map[a] != map[b]) { return true }
    }
}

///////////////////////////////////////////////////////////

main()

