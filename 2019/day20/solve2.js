"use strict"

// solving the puzzle takes (my computer) 0.045s


// this program treats the nearest walkable spot to a portal as the portal  //


const map = [ ]

var WIDTH = 0
var HEIGHT = 0

const deadEnds = [ ]

const PORTALS = { } // name-without-level: row, col, trips 

const positionsWithPortal = { } // row~col: name-without-level


function main() {

    processInput()
  
    findPortalsAndDeadEnds() 
    
    blockDeadEnds()

    findPortalTrips()

    findLandTrips()
    
 // show()  
    console.log("the answer is", findBestDistance())
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

function findPortalsAndDeadEnds() {
        
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
    
    const isExternal = (baseRow == 2  ||  baseRow == HEIGHT - 3  ||  baseCol == 2  ||  baseCol == WIDTH - 3)
    
    portal += isExternal ? "e" : "i"
    
    PORTALS[portal] = createPortal(baseRow, baseCol)
    
    positionsWithPortal[baseRow + "~" + baseCol] = portal        
    
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

    const portals = Object.keys(PORTALS)
    
    for (const portal of portals) {
    
        if (portal == "AAe") { continue }
        if (portal == "ZZe") { continue }
    
        const data = PORTALS[portal]
        
        const a = portal.substr(0, 2)
        
        const b = (portal[2] == "i") ? "e" : "i"
        
        const destiny = a + b
        
        const levelChange = (portal.endsWith("i")) ? +1 : -1
        
        data.trips.push(createTrip(destiny, 1, levelChange))
    }
}
          
///////////////////////////////////////////////////////////

function findLandTrips() { 

    const portals = Object.keys(PORTALS)
    
    for (const portal of portals) {
    
        const data = PORTALS[portal]
        
        const trips = explore(data.row, data.col)
        
        for (const trip of trips) { data.trips.push(trip) }
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
        
        const portal = positionsWithPortal[coord]
        
        if (portal == undefined) { return }
        
        if (portal == "AAe") { return } // filtered!

        myTrips.push(createTrip(portal, distance + 1, 0))
    }
}

///////////////////////////////////////////////////////////

function findBestDistance() {
    
    const reserved = { "AAe~0": true }
    
    const currentNodes = [ createNode("AAe~0", 0) ]
       
    while (currentNodes.length > 0) {

        const closest = extractClosestNode(currentNodes)
        
        if (closest.portal == "ZZe~0") { return closest.distance }
        
        const core = closest.portal.substr(0, 3)

        const level = parseInt(closest.portal.substr(4))
        
        for (const trip of PORTALS[core].trips) {
            
            const newLevel = level + trip.levelChange
            
            if (newLevel < 0) { continue }
            
            const newSpot = trip.destiny + "~" + newLevel
            
            if (reserved[newSpot]) { continue }
            
            reserved[newSpot] = true
            
            const newDistance = closest.distance + trip.distance
            
            const newNode = createNode(newSpot, newDistance)
            
            currentNodes.push(newNode)
        }
    }

    console.log("could not reach target")    
    Deno.exit()
}

function extractClosestNode(nodes) { // expects nodes is not empty

    let bestNode = nodes[0]
    let bestIndex = 0
    
    let n = 0
    
    while (true) {
    
        n += 1
        
        const candidate = nodes[n]
        
        if (candidate == undefined) { break }
        
        if (candidate.distance < bestNode.distance) { bestNode = candidate; bestIndex = n }    
    }

    nodes.splice(bestIndex, 1)
    
    return bestNode
}

///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function createPortal(row, col) {

    return { "row": row, "col": col, "trips": [ ] }
}

function createNode(portal, distance) { // portal-with-level

    return { "portal": portal, "distance": distance }
}

function createTrip(destiny, distance, levelChange) {

    return { "destiny": destiny, "distance": distance, "levelChange": levelChange }
}

function show() {

    console.log("")
    
    console.log("-".repeat(WIDTH + 2))
    
    for (const line of map) { console.log("|" + line.join("") + "|") }
    
    console.log("-".repeat(WIDTH + 2))
    
    console.log("")
}

main()

