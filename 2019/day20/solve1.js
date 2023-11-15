"use strict"

// solving the puzzle takes (my computer) 0.040s

const map = [ ]

var WIDTH = 0
var HEIGHT = 0

const deadEnds = [ ]

const NODES = { } // row~col: data

var homeCoord = ""
var exitCoord = ""


var bestDistance = 999999


function main() {

    processInput()
  
    findNodesAndDeadEnds() 
    
    blockDeadEnds()
    
    findPortalTrips()

    findLandTrips()
    
    findBestDistance()
    
//  show()  
   console.log("the answer is", bestDistance)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt")
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        if (line != "") { map.push(line.split("")) }
    }
    
    WIDTH = map[0].length
    HEIGHT = map.length
}

function findNodesAndDeadEnds() {
        
    for (let row = 2; row < HEIGHT - 2; row++) { // skips margin

        for (let col = 2; col < WIDTH - 2; col++) { // skips margin
        
            if (map[row][col] != ".") { continue }
        
            let count = 0
            
            count += checkNeighbor(row, col, -1, 0)
            count += checkNeighbor(row, col, +1, 0)
            count += checkNeighbor(row, col, 0, -1)
            count += checkNeighbor(row, col, 0, +1)
        
            if (count > 2) { deadEnds.push(createPoint(row, col)) }
        }
    }
}

function checkNeighbor(baseRow, baseCol, deltaRow, deltaCol) {

    const row = baseRow + deltaRow
    const col = baseCol + deltaCol

    const item =  map[row][col]
    
    if (item == "#") { return 1 }
    if (item == " ") { return 1 } // unreachable by "." neighbor
    if (item == ".") { return 0 }
    
    // got letter

    let portal = ""
    
    if (deltaRow == -1) {   
        portal = map[row-1][col] + item
    }
    else if (deltaCol == -1) { 
        portal = map[row][col-1] + item
    }
    else if (deltaRow == +1) { 
        portal = item + map[row+1][col]
    }
    else { // if (deltaCol == +1) { 
        portal = item + map[row][col+1]
    }
    
    NODES[baseRow + "~" + baseCol] = createNode(baseRow, baseCol, portal)
    
    if (portal == "AA") { homeCoord = baseRow + "~" + baseCol }
    if (portal == "ZZ") { exitCoord = baseRow + "~" + baseCol }
    
    return 0
}

///////////////////////////////////////////////////////////

function blockDeadEnds() {

    while (deadEnds.length > 0) {
    
        const point = deadEnds.shift()
        
        blockDeadEnd(point.row, point.col) 
    }
}
   
function blockDeadEnd(row, col) {
    
    if (map[row][col] == "#") { return }
    
    map[row][col] = "#"
    
    blockIfDeadEnd(row-1, col)
    blockIfDeadEnd(row+1, col)
    blockIfDeadEnd(row, col-1)
    blockIfDeadEnd(row, col+1)
}

function blockIfDeadEnd(row, col) { 

    if (map[row][col] != ".") { return }

    let count = 0
    
    if (map[row-1][col] == "#") { count += 1 }
    if (map[row+1][col] == "#") { count += 1 }
    if (map[row][col-1] == "#") { count += 1 }
    if (map[row][col+1] == "#") { count += 1 }

    if (count > 2) { deadEnds.push(createPoint(row, col)) }
}

///////////////////////////////////////////////////////////

function findPortalTrips() { 

    const coords = Object.keys(NODES)
    
    for (const coord1 of coords) {
    
        const data1 = NODES[coord1]
        
        for (const coord2 of coords) {
        
            if (coord1 == coord2) { continue }
            
            const data2 = NODES[coord2]
            
            if (data1.portal != data2.portal) { continue }
            
            data1.trips.push(createTrip(coord2, 1))
        }
    }
}
          
///////////////////////////////////////////////////////////

function findLandTrips() { 

    const coords = Object.keys(NODES)
    
    for (const coord of coords) {
    
        const values = coord.split("~")
        
        const row = parseInt(values.shift())
        const col = parseInt(values.shift())
        
        const trips = explore(row, col)
        
        for (const trip of trips) { NODES[coord].trips.push(trip) }
    }
}

///////////////////////////////////////////////////////////

function explore(row, col) {

    const myTrips = [ ]
    
    let futurePoints = [ createPoint(row, col) ]

    const walkTable = new Uint8Array(WIDTH * HEIGHT)    

    const index = row * WIDTH + col
    
    walkTable[index] = 1
    
    let distance = 0

    while (true) {

        const currentPoints = futurePoints
        
        futurePoints = [ ]
        
        for (const point of currentPoints) {
            
            const row = point.row
            const col = point.col
                                    
            grabNeighbor(row-1, col)
            grabNeighbor(row+1, col)
            grabNeighbor(row, col-1)
            grabNeighbor(row, col+1)            
        }
        
        if (futurePoints.length == 0) { return myTrips }
        
        distance += 1
    }
    
    function grabNeighbor(row, col) {

        if (row < 0) { return }
        if (col < 0) { return }

        if (row >= HEIGHT) { return }
        if (col >= WIDTH)  { return }

        const index = row * WIDTH + col
        
        if (walkTable[index] == 1) { return }
        
        walkTable[index] = 1 // touched
        
        const symbol = map[row][col] 
        
        if (symbol != ".") { return }
        
        const point = createPoint(row, col)
        
        futurePoints.push(point) 
        
        const coord = row + "~" + col
        
        if (NODES[coord] == undefined) { return }

        myTrips.push(createTrip(coord, distance + 1))
    }
}

///////////////////////////////////////////////////////////

function findBestDistance() {
    
    let futurePaths = [ createPath([ homeCoord ], 0) ]
    
    while (futurePaths.length > 0) {

        const currentPaths = futurePaths
        
        futurePaths = [ ]

        for (const path of currentPaths) {
        
            if (path.spots.at(-1) == exitCoord) {
            
                if (path.distance < bestDistance) { bestDistance = path.distance }

                continue
            }
            
            if (path.distance > bestDistance) { continue }
            
            const newPaths = walkPathOnce(path)
            
            for (const newPath of newPaths) { futurePaths.push(newPath) }
        }
    }
}

function walkPathOnce(basePath) { 

    const newPaths = [ ]

    const lastSpot = basePath.spots.at(-1)
    
    const node = NODES[lastSpot]
    
    for (const trip of node.trips) {
    
        if (basePath.spots.includes(trip.destiny)) { continue }
        
        const newSpots = basePath.spots.slice()
        
        newSpots.push(trip.destiny)
        
        const newDistance = basePath.distance + trip.distance
        
        const newPath = createPath(newSpots, newDistance)
        
        newPaths.push(newPath)
    }
    
    return newPaths
}

///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function createTrip(destiny, distance) {

    return { "destiny": destiny, "distance": distance }
}

function createNode(row, col, portal) {

    return { "row": row, "col": col, "portal": portal, "trips": [ ] }
}

function createPath(spots, distance) {

    return { "spots": spots, "distance": distance }
}

function show() {

    console.log("")
    
    console.log("-".repeat(WIDTH + 2))
    
    for (const line of map) { console.log("|" + line.join("") + "|") }
    
    console.log("-".repeat(WIDTH + 2))
    
    console.log("")
}

main()

