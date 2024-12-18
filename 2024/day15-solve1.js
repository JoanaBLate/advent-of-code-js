// solution for https://adventofcode.com/2024/day/15 part 1

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
    
    for (const rawLine of rawLines) { map.push(rawLine.trim().split("")) }
    
    height = map.length
    width = map[0].length
    
    
    const rawGuide = sections.shift().trim()
    
    for (const segment of rawGuide.split("\n")) { guide += segment.trim() } 
    
    
    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {   
        
            if (map[row][col] == "@") { botRow = row; botCol = col; return }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

function walk() {

    for (const direction of guide) {
        
        if (direction == "^") { walkTo(-1, 0); continue }
        if (direction == "v") { walkTo(+1, 0); continue }
        if (direction == ">") { walkTo(0, +1); continue }
        if (direction == "<") { walkTo(0, -1); continue }
    }
}

function walkTo(deltaRow, deltaCol) {

    let futureRow = botRow
    let futureCol = botCol
    
    while (true) { // searchs for the first free space ahead

        futureRow += deltaRow
        futureCol += deltaCol
    
        const futureSpot = map[futureRow][futureCol]

        if (futureSpot == "#") { return }
    
        if (futureSpot == ".") { break }
    }
    
    while (true) { // moves everything in the segment from the bot to the first free space ahead
    
        const previousRow = futureRow - deltaRow
        const previousCol = futureCol - deltaCol
    
        map[futureRow][futureCol] = map[previousRow][previousCol] 

        futureRow = previousRow
        futureCol = previousCol
        
        if (futureRow == botRow  &&  futureCol == botCol) { break }        
    }

    map[botRow][botCol] = "."

    botRow += deltaRow
    botCol += deltaCol
}

///////////////////////////////////////////////////////////////////////////////  

function countBoxesGps() {

    let gps = 0
    
    for (let row = 0; row < width; row++) {
        for (let col = 0; col < height; col++) {   
        
            if (map[row][col] == "O") { gps += 100 * row + col }
        }
    } 
    return gps
}

function showMap() {
    
    for (const line of map) { console.log(line.join("")) }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

