// solution for https://adventofcode.com/2024/day/15 part 2

// expecting all map borders to be blocked ("#")

"use strict"

const input = Deno.readTextFileSync("day15-input.txt").trim()

const map = [ ]

var width = 0
var height = 0

var botRow = 0
var botCol = 0

var guide = ""


function main() {

    processInput()
    
    walk()

    console.log("the answer is", countBoxesGps())
}

function processInput() {
        
    const sections = input.split("\n\n")
    
    const rawMap = sections.shift().trim()
    
    const rawLines = rawMap.split("\n")
    
    for (const rawLine of rawLines) { 
    
        let line = ""
        
        for (const c of rawLine.trim()) {
            
            if (c == "#") { line += "##"; continue }
            if (c == ".") { line += ".."; continue }
            if (c == "O") { line += "[]"; continue }
            if (c == "@") { line += "@."; continue }
        }
        map.push(line.split(""))        
    }
    
    height = map.length
    width = map[0].length
    
    const rawGuide = sections.shift().trim()
    
    for (const segment of rawGuide.split("\n")) { guide += segment.trim() } 
    
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {   
            
            if (map[row][col] == "@") { botRow = row; botCol = col; return }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

function walk() {

    for (const direction of guide) {
        
        if (direction == "^") { walkVertical(-1); continue }
        if (direction == "v") { walkVertical(+1); continue }
        if (direction == ">") { walkHorizontal(+1); continue }
        if (direction == "<") { walkHorizontal(-1); continue }
    }
}

function walkVertical(deltaRow) {

    const futureRow = botRow + deltaRow

    const futureSpot = map[futureRow][botCol]

    if (futureSpot == "#") { return }

    if (futureSpot == ".") { 
    
        map[botRow][botCol] = "."
        botRow = futureRow
        map[botRow][botCol] = "@"
        return
    }
    
    if (! mayMoveBoxVertical(futureRow, botCol, deltaRow)) { return }
    
    moveBoxVertical(futureRow, botCol, deltaRow)
    
    map[botRow][botCol] = "."
    botRow = futureRow
    map[botRow][botCol] = "@"
}

function walkHorizontal(deltaCol) {

    let futureCol = botCol
    
    while (true) { // searchs for the first free space ahead

        futureCol += deltaCol
    
        const futureSpot = map[botRow][futureCol]

        if (futureSpot == "#") { return }
    
        if (futureSpot == ".") { break }
    }
    
    while (true) { // moves everything in the segment from the bot to the first free space ahead
    
        const previousCol = futureCol - deltaCol
    
        map[botRow][futureCol] = map[botRow][previousCol] 

        futureCol = previousCol
        
        if (futureCol == botCol) { break }        
    }

    map[botRow][botCol] = "."

    botCol += deltaCol
}

///////////////////////////////////////////////////////////////////////////////

function mayMoveBoxVertical(boxRow, boxCol, deltaRow) { // recursive function

    if (map[boxRow][boxCol] == "]") { boxCol -= 1 } // boxCol always means "["
    
    const futureRow = boxRow + deltaRow

    const futureSpotLeft  = map[futureRow][boxCol]
    const futureSpotRight = map[futureRow][boxCol + 1]

    if (futureSpotLeft  == "#") { return false }
    if (futureSpotRight == "#") { return false }
    
    if (futureSpotLeft == "[") { 
    
        if (! mayMoveBoxVertical(futureRow, boxCol, deltaRow)) { return false }
    }
    
    if (futureSpotLeft == "]") { 
    
        if (! mayMoveBoxVertical(futureRow, boxCol, deltaRow)) { return false }
    }
    
    if (futureSpotRight == "[") { 
    
        if (! mayMoveBoxVertical(futureRow, boxCol + 1, deltaRow)) { return false }
    }

    // futureSpotLeft == "."  &&  futureSpotRight == "."
        
    return true
}

function moveBoxVertical(boxRow, boxCol, deltaRow) { // movement already checked // recursive function

    if (map[boxRow][boxCol] == "]") { boxCol -= 1 } // boxCol always means "["
    
    const futureRow = boxRow + deltaRow

    const futureSpotLeft  = map[futureRow][boxCol]
    const futureSpotRight = map[futureRow][boxCol + 1]
    
    if (futureSpotLeft == "[") { moveBoxVertical(futureRow, boxCol, deltaRow) }
    
    if (futureSpotLeft == "]") { moveBoxVertical(futureRow, boxCol, deltaRow) }
    
    if (futureSpotRight == "[") { moveBoxVertical(futureRow, boxCol + 1, deltaRow) }

    // futureSpotLeft == "."  &&  futureSpotRight == "."
    
    map[boxRow][boxCol] = "."
    map[boxRow][boxCol + 1] = "."

    map[futureRow][boxCol] = "["
    map[futureRow][boxCol + 1] = "]"
}

///////////////////////////////////////////////////////////////////////////////  

function countBoxesGps() {

    let gps = 0
    
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {   

            if (map[row][col] == "[") { gps += 100 * row + col }
        }
    } 
    return gps
}

function showMap() {
    
    for (const line of map) { console.log(line.join("")) }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 5ms

