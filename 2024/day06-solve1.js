// solution for https://adventofcode.com/2024/day/6 part 1

// EXPECTS INITIAL DIRECTION TO BE NORTH (^)

"use strict"

const input = Deno.readTextFileSync("day06-input.txt").trim()

const NORTH = 0
const SOUTH = 1
const EAST = 2
const WEST = 3

const BLOCKED = 0
const VIRGIN = 1
const USED = 2

const map = [ ]

var width = 0
var height = 0

var cursorRow = 0
var cursorCol = 0
var direction = NORTH

function main() {

    processInput()
    
    walk()
    
    console.log("the answer is", countUsedSpots())
}

function processInput() {
        
    const lines = input.split("\n")
    
    const stringMap = [ ]
    
    for (const line of lines) { stringMap.push(line.trim().split("")) }
    
    height = stringMap.length
    width = stringMap[0].length
        
    for (let row = 0; row < height; row++) { 

        const mapLine = [ ]
        
        for (let col = 0; col < width; col++) { 
            //
            const symbol = stringMap[row][col]

            if (symbol == "#") { mapLine.push(BLOCKED); continue }
            if (symbol == ".") { mapLine.push(VIRGIN); continue }
            
            mapLine.push(USED)
            cursorRow = row
            cursorCol = col
        }
        map.push(mapLine)
    }
}

function walk() {

    while (walkOnce()) { }
}

function walkOnce() {

    if (direction == NORTH) {
        cursorRow -= 1
        if (cursorRow < 0) { return false }
        if (map[cursorRow][cursorCol] == BLOCKED) { cursorRow += 1; direction = EAST; return true }
        map[cursorRow][cursorCol] = USED; return true
    }

    if (direction == SOUTH) {
        cursorRow += 1
        if (cursorRow >= height) { return false }
        if (map[cursorRow][cursorCol] == BLOCKED) { cursorRow -= 1; direction = WEST; return true }
        map[cursorRow][cursorCol] = USED; return true
    }

    if (direction == EAST) {
        cursorCol += 1
        if (cursorCol >= width) { return false }
        if (map[cursorRow][cursorCol] == BLOCKED) { cursorCol -= 1; direction = SOUTH; return true }
        map[cursorRow][cursorCol] = USED; return true
    }

    if (direction == WEST) {
        cursorCol -= 1
        if (cursorCol < 0) { return false }
        if (map[cursorRow][cursorCol] == BLOCKED) { cursorCol += 1; direction = NORTH; return true }
        map[cursorRow][cursorCol] = USED; return true
    }
}

function countUsedSpots() {
    
    let count = 0

    for (let row = 0; row < height; row++) { 
        for (let col = 0; col < width; col++) { 
            //        
            if (map[row][col] == USED) { count += 1 }
        }
    }
    return count
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

