// study for https://adventofcode.com/2025/day/9 part 2

"use strict"

// this program is just to get a simplified vision of the perimeter
// you must adjust the resolution of your screen or save the output 
// to a file and "read" it zoomed out

const input = Deno.readTextFileSync("input.txt").trim()

const allRedTiles = [ ]

const map = [ ]

function main() {

    fillAllRedTiles()
    
    for (let n = 0; n < 200; n++) {
    
        const list = [ ]
        
        for (let m = 0; m < 200; m++) { list.push(" ") }
        
        map.push(list)
    }
        
    drawOnMap()
    
    console.log("")
    for (const line of map) { console.log(line.join("")) }
    console.log("")   
}

function fillAllRedTiles() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(",")
    
        const col = Math.floor(parseInt(tokens.shift()) / 500)
        const row = Math.floor(parseInt(tokens.shift()) / 500)
        
        allRedTiles.push({ "row": row, "col": col })
    }
}

function drawOnMap() {

    for (let index = 1; index < allRedTiles.length; index++) {
    
        drawSegmentOnMap(index - 1, index)
    }
    
    drawSegmentOnMap(allRedTiles.length - 1, 0) // last -> first redTiles
}
    
function drawSegmentOnMap(indexA, indexB) {

    const tileA = allRedTiles[indexA]
    const tileB = allRedTiles[indexB]
        
    const top = (tileA.row < tileB.row) ? tileA.row : tileB.row

    const bottom = (tileB.row > tileA.row) ? tileB.row : tileA.row
    
    const left = (tileA.col < tileB.col) ? tileA.col : tileB.col
    
    const right = (tileB.col > tileA.col) ? tileB.col : tileA.col

    if (top == bottom) { // horizontal
    
        for (let col = left; col <= right; col++) { map[top][col] = "#" }    
    }
    else { // vertical
            
        for (let row = top; row <= bottom; row++) { map[row][left] = "#" }
    }
}

main()


