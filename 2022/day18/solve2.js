"use strict"

// solving the puzzle takes (my computer) 0.035s

const input = Deno.readTextFileSync("input.txt").trim()

const AIR = 0  // later it will mean air pocket
const CUBE = 1
const HOLE = 2 // surface hole or a tube to a surface hole

const DATA = [ ]

var greatestX = 0
var greatestY = 0
var greatestZ = 0

const CUBES = [ ] // 3 dimension array

const surfaceHoles = [ ] 


function main() {

    processInput()
    
    createCubes()
    
    fillCubes()
    
    findSurfaceHoles()
    
    extendSurfaceHoles()

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

    for (const data of DATA) { CUBES[data.x][data.y][data.z] = CUBE }
}

///////////////////////////////////////////////////////////

function findSurfaceHoles() {

    for (let x = 0; x <= greatestX; x++) {
    
        for (let y = 0; y <= greatestY; y++) {

            findSurfaceHole(x, y, 0)
            findSurfaceHole(x, y, greatestZ)
        }
    }

    for (let x = 0; x <= greatestX; x++) {
    
        for (let z = 0; z <= greatestZ; z++) {

            findSurfaceHole(x, 0, z)
            findSurfaceHole(x, greatestY, z)
        }
    }
    
    for (let y = 0; y <= greatestY; y++) {
    
        for (let z = 0; z <= greatestZ; z++) {

            findSurfaceHole(0, y, z)
            findSurfaceHole(greatestX, y, z)
        }
    }
}

function findSurfaceHole(x, y, z) {

    if (CUBES[x][y][z] != AIR) { return }
    
    CUBES[x][y][z] = HOLE
    
    surfaceHoles.push({ "x": x, "y": y, "z": z })
}

///////////////////////////////////////////////////////////

function extendSurfaceHoles() {

    for (const hole of surfaceHoles) { extendSurfaceHole(hole.x, hole.y, hole.z) } 
}

function extendSurfaceHole(x, y, z) {
    
    extendHole(x - 1, y, z)
    extendHole(x + 1, y, z)
    
    extendHole(x, y - 1, z)
    extendHole(x, y + 1, z)
    
    extendHole(x, y, z - 1)
    extendHole(x, y, z + 1)
}

function extendHole(x, y, z) {
    
    if (x < 0) { return }
    if (y < 0) { return }
    if (z < 0) { return }
    
    if (x > greatestX) { return }
    if (y > greatestY) { return }
    if (z > greatestZ) { return }
    
    if (CUBES[x][y][z] != AIR) { return }
    
    CUBES[x][y][z] = HOLE 
    
    extendHole(x - 1, y, z)
    extendHole(x + 1, y, z)
    
    extendHole(x, y - 1, z)
    extendHole(x, y + 1, z)
    
    extendHole(x, y, z - 1)
    extendHole(x, y, z + 1)
}

///////////////////////////////////////////////////////////

function countCoveredFaces() {

    let count = 0
    
    for (const cube of DATA) { count += countCoveredFacesThis(cube) }
    
    return count
}

function countCoveredFacesThis(cube) {

    let count = 0

    if (isCubeOrAirPocket(cube.x - 1, cube.y, cube.z)) { count += 1 }
    if (isCubeOrAirPocket(cube.x, cube.y - 1, cube.z)) { count += 1 }
    if (isCubeOrAirPocket(cube.x, cube.y, cube.z - 1)) { count += 1 }

    if (isCubeOrAirPocket(cube.x + 1, cube.y, cube.z)) { count += 1 }
    if (isCubeOrAirPocket(cube.x, cube.y + 1, cube.z)) { count += 1 }
    if (isCubeOrAirPocket(cube.x, cube.y, cube.z + 1)) { count += 1 }
    
    return count
}

function isCubeOrAirPocket(x, y, z) {
    
    if (x < 0) { return false }
    if (y < 0) { return false }
    if (z < 0) { return false }
    
    if (x > greatestX) { return false }
    if (y > greatestY) { return false }
    if (z > greatestZ) { return false }
    
    if (CUBES[x][y][z] == AIR)  { return true }
    if (CUBES[x][y][z] == CUBE) { return true }
    
    return false // hole 
}

///////////////////////////////////////////////////////////

main()

