"use strict"

// solving the puzzle takes (my computer) 0.025s

const planet = [ ]

var width = 0
var height = 0

const census = [ ]

const memory = [ ]


function main() {

    processInput()
    
    memory.push(stringifyPlanet())
    
    createCensus()
    
    while (true) {
    
        repopulate()
        
        const string = stringifyPlanet()
        
        if (memory.includes(string)) { break } else { memory.push(string) }
    }
 // show()
     
    console.log("the answer is", calcBiodiversity())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const cells = line.trim().split("")
        
        planet.push(cells)
    }
    
    height = planet.length
    width = planet[0].length
}

///////////////////////////////////////////////////////////

function stringifyPlanet() {

    let s = ""
    
    for (const line of planet) { s += line.join("") }

    return s
}

function createCensus() {

    for (let row = 0; row < height; row++) {
    
        const line = new Array(width)
        
        line.fill(0)
        
        census.push(line)
    }
}

function realizeCensus() {

    for (let row = 0; row < height; row++) {
    
        for (let col = 0; col < width; col++) {
        
            let count = 0
            
            count += countNeighbor(row - 1, col)
            count += countNeighbor(row + 1, col)
            count += countNeighbor(row, col - 1)
            count += countNeighbor(row, col + 1)

            census[row][col] = count
        }
    }
}

function countNeighbor(row, col) {

    if (row < 0) { return 0 }
    if (col < 0) { return 0 }
    if (row >= height) { return 0 }
    if (col >= width)  { return 0 }
 
    if (planet[row][col] == "#") { return 1 }
    
    return 0
}

function repopulate() {

    realizeCensus() 

    for (let row = 0; row < height; row++) {
    
        for (let col = 0; col < width; col++) {

            const neighbors = census[row][col]
            
            if (planet[row][col] == "#") {
            
                if (neighbors != 1) { planet[row][col] = "." }
            }
            else {
            
                if (neighbors == 1  || neighbors == 2) {  planet[row][col] = "#" }
            }
        }
    }
}

function calcBiodiversity() {

    const string = stringifyPlanet()
    
    let sum = 0
    
    let exponent = -1
    
    for (const c of string) {
    
        exponent += 1
        
        if (c == "#") { sum += Math.pow(2, exponent) } 
    }

    return sum
}

function show() {

    console.log("")
    
    for (const line of planet) { console.log(line.join("")) }
}

main()

