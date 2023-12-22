"use strict"

// solving the puzzle takes (my computer) 0.130s

const map = [ ]

var height = 0

var width = 0

const targetNumberOfSpins = 1000000000


function main() {

    processInput()    
    
    const memory = [ ]
    
    const counts = [ ]
    
    let indexOfAncestor = -1
        
    while (true) {
    
        spin()
    
        const s = mapToString()
        
        const n = countRocks()
    
        indexOfAncestor = memory.indexOf(s)
        
        if (indexOfAncestor != -1) { break }

        memory.push(s)    
        
        counts.push(n)    
        
    }

    const initialSpins = indexOfAncestor
    
    const spinsPerLoop = memory.length - initialSpins
    
    const remainingSpins = (targetNumberOfSpins - initialSpins) % spinsPerLoop
        
    const index = initialSpins + remainingSpins - 1
    
    console.log("the answer is", counts[index])
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        map.push(line.trim().split(""))
    }
    
    height = map.length
    width = map[0].length
}

function spin() {

    sendRocksToNorth()
    sendRocksToWest()
    sendRocksToSouth()
    sendRocksToEast()
}

///////////////////////////////////////////////////////////

function sendRocksToNorth() {

    for (let row = 1; row < height; row++) {
    
        for (let col = 0; col < width; col++) {
    
            if (map[row][col] == "O") { sendRockToNorth(row, col) }
        }
    }
}

function sendRockToNorth(row, col) {

    while (row > 0) {
    
        if (map[row - 1][col] != ".") { return }
        
        map[row][col] = "."
        map[row - 1][col] = "O"
        
        row -= 1
    }
}

///////////////////////////////////////////////////////////

function sendRocksToSouth() {

    for (let row = height - 2; row > -1; row--) {
    
        for (let col = 0; col < width; col++) {
    
            if (map[row][col] == "O") { sendRockToSouth(row, col) }
        }
    }
}

function sendRockToSouth(row, col) {

    while (row < height - 1) {
    
        if (map[row + 1][col] != ".") { return }
        
        map[row][col] = "."
        map[row + 1][col] = "O"
        
        row += 1
    }
}

///////////////////////////////////////////////////////////

function sendRocksToWest() {

    for (let row = 0; row < height; row++) {
    
        for (let col = 1; col < width; col++) {
    
            if (map[row][col] == "O") { sendRockToWest(row, col) }
        }
    }
}

function sendRockToWest(row, col) {

    while (col > 0) {
    
        if (map[row][col - 1] != ".") { return }
        
        map[row][col] = "."
        map[row][col - 1] = "O"
        
        col -= 1
    }
}

///////////////////////////////////////////////////////////

function sendRocksToEast() {

    for (let row = 0; row < height; row++) {
    
        for (let col = width -2; col > -1; col--) {
    
            if (map[row][col] == "O") { sendRockToEast(row, col) }
        }
    }
}

function sendRockToEast(row, col) {

    while (col < width - 1) {
    
        if (map[row][col + 1] != ".") { return }
        
        map[row][col] = "."
        map[row][col + 1] = "O"
        
        col += 1
    }
}

///////////////////////////////////////////////////////////

function countRocks() {

    let sum = 0
    
    for (let n = 0; n < height; n++) { 
    
        const factor = height - n 

        sum += factor * countRocksRow(n)
    }
    
    return sum
}

function countRocksRow(n) {

    let count = 0

    for (const c of map[n]) { if (c == "O") { count += 1 } }
    
    return count
}

///////////////////////////////////////////////////////////

function mapToString() {

    let s = ""
    
    for (const line of map) { s += ";" + lineToString(line) }
    
    return s.substr(1)
}

function lineToString(line) {

    let s = ""
    
    let n = -1
    
    for (const c of line) {
    
        n += 1
        
        if (c == "O") { s += String.fromCharCode(n) }
    }
    
    return s.substr(1)
}

function show() {

    for (const line of map) { console.log("  " + line.join(" ")) }
}

main()

