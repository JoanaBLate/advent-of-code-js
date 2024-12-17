"use strict"

// solving the puzzle takes (my computer) 0.032s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

var greatestX = 0
var greatestY = 0
var greatestZ = 0

const CUBES = [ ]


function main() {

    processInput()
    
    createCubes()
    
    fillCubes()
    
    const allFaces = DATA.length * 6
    
    console.log("the answer is", allFaces - countCoveredFaces())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        const z = parseInt(tokens.shift())
        
        if (x > greatestX) { greatestX = x } 
        if (y > greatestY) { greatestY = y } 
        if (z > greatestZ) { greatestZ = z } 
        
        DATA.push({ "x": x, "y": y, "z": z })
    }
}

///////////////////////////////////////////////////////////

function createCubes() {

    for (let x = 0; x <= greatestX; x++) { CUBES.push(createDimensionY()) }
}

function createDimensionY() {

    const dimensionY = [ ]
    
    for (let y = 0; y <= greatestY; y++) { dimensionY.push(createDimensionZ()) }
    
    return dimensionY
}

function createDimensionZ() {

    return new Uint8Array(greatestZ + 1)
}

///////////////////////////////////////////////////////////

function fillCubes() {

    for (const data of DATA) { CUBES[data.x][data.y][data.z] = 1 }
}

///////////////////////////////////////////////////////////

function countCoveredFaces() {

    let count = 0
    
    for (const cube of DATA) { count += countCoveredFacesThis(cube) }
    
    return count
}

function countCoveredFacesThis(cube) {

    let count = 0

    if (exists(cube.x - 1, cube.y, cube.z)) { count += 1 }
    if (exists(cube.x, cube.y - 1, cube.z)) { count += 1 }
    if (exists(cube.x, cube.y, cube.z - 1)) { count += 1 }

    if (exists(cube.x + 1, cube.y, cube.z)) { count += 1 }
    if (exists(cube.x, cube.y + 1, cube.z)) { count += 1 }
    if (exists(cube.x, cube.y, cube.z + 1)) { count += 1 }
    
    return count
}

function exists(x, y, z) {
    
    if (x < 0) { return false }
    if (y < 0) { return false }
    if (z < 0) { return false }
    
    if (x > greatestX) { return false }
    if (y > greatestY) { return false }
    if (z > greatestZ) { return false }
    
    return CUBES[x][y][z] == 1
}

///////////////////////////////////////////////////////////

main()

