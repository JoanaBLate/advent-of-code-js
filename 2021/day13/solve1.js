"use strict"

// solving the puzzle takes (my computer) 0.067s

const input = Deno.readTextFileSync("input.txt").trim()

const DOTS = [ ]

const FOLDS = [ ]

var HEIGHT = 0

var WIDTH = 0

const MAP = [ ]


function main() {

    processInput()
    
    createOriginalMap()
    
    let map = MAP
        
    for (const fold of FOLDS) { map = processFolding(map, fold); break }
           
//    show(map)
    
    console.log("the answer is", countDots(map))
}

///////////////////////////////////////////////////////////

function processInput() {

    let maxX = 0 
    let maxY = 0 
        
    const groups = input.split("\n\n")
    
    const lines = groups.shift().split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        
        if (x > maxX) { maxX = x }
        if (y > maxY) { maxY = y }
        
        DOTS.push({ "x": x, "y": y })
    }
    
    WIDTH = maxX + 1
    HEIGHT = maxY + 1
    
    const lines2 = groups.shift().split("\n")

    for (const line of lines2) { 
    
        const tokens = line.trim().replace("fold along ", "").split("=")
    
        const dimension = tokens.shift()
        
        const coord = parseInt(tokens.shift())  
        
        FOLDS.push({ "dimension": dimension, "coord": coord })  
    }
}

///////////////////////////////////////////////////////////

function createOriginalMap() {

    for (let n = 0; n < HEIGHT; n++) { MAP.push(new Uint8Array(WIDTH)) }
    
    for (const dot of DOTS) { MAP[dot.y][dot.x] = 1 }
}

///////////////////////////////////////////////////////////

function processFolding(map, fold) {

    if (fold.dimension == "y") { 
    
        return processFoldingY(map, fold)
    }
    else {
    
        return processFoldingX(map, fold)    
    }
}

///////////////////////////////////////////////////////////

function processFoldingY(sourceMap, fold) {

    const width = sourceMap[0].length

    const mapA = [ ]
    
    while (mapA.length < fold.coord) { mapA.push(sourceMap.shift()) }
    
    sourceMap.shift() // discharging
    
    const mapB = [ ]
    
    while (sourceMap.length != 0) {  mapB.push(sourceMap.pop()) }
    
    //   
    
    while (mapA.length < mapB.length) { mapA.unshift(new Uint8Array(width)) }
    
    while (mapB.length < mapA.length) { mapB.unshift(new Uint8Array(width)) }
    
    //
    
    for (let row = 0; row < mapB.length; row++) {
    
        for (let col = 0; col < width; col++) {
        
            if (mapB[row][col] == 1) { mapA[row][col] = 1 }
        }    
    }
    return mapA
}

///////////////////////////////////////////////////////////

function processFoldingX(sourceMap, fold) {
    
    const map = [ ]
    
    while (sourceMap.length != 0) {
    
        const line = createFoldingXLine(sourceMap.shift(), fold.coord)
        
        map.push(line)    
    }
    
    return map
}

function createFoldingXLine(sourceLine, edge) {

    const strLine = sourceLine.join("")
    
    let segmentA = strLine.substr(0, edge)
    
    let segmentB = strLine.substr(edge + 1) // discharging the edge
    
    while (segmentA.length < segmentB.length) { segmentA = " " + segmentA }
    while (segmentB.length < segmentA.length) { segmentB += " " }
    
    let temp = ""
    
    for (const c of segmentB) { temp = c + temp }
    
    segmentB = temp
    
    //
        
    const line = new Uint8Array(segmentA.length)
    
    for (let n = 0; n < segmentA.length; n++) {
    
        if (segmentA[n] == "1"  ||  segmentB[n] == "1") { line[n] = 1 }
    }
    
    return line  
}

///////////////////////////////////////////////////////////

function countDots(map) {

    let count = 0
    
    for (const line of map) {
    
        for (const item of line) { count += item }
    }
    
    return count
}

///////////////////////////////////////////////////////////

function show(map) {

    console.log("")

    for (const line of map) {
    
        let s = ""

        for (const item of line) { s += item == 0 ? "." : "x" }
        
        console.log(s)
    }    
}

main()

