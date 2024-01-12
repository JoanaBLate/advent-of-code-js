"use strict"

// solving the puzzle takes (my computer) 3.5s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ] // no slope inside

var WIDTH = 0

var HEIGHT = 0

const NODES = [ ]


function main() {

    processInput()

    createAllNodes()

 // showMap()

    walkBetweenNodes()
      
    console.log("the answer is", findLengthOfLongestTravel())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim().split("")) }
    
    HEIGHT = MAP.length
    
    WIDTH = MAP[0].length
    
    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) { 
        
            if (MAP[row][col] != "#") { MAP[row][col] = "." }
        }
    }
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function createAllNodes() {   
 
    createAndRegisterNode(0, 1) // home
    
    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) { tryCreateNode(row, col) }
    }
    
    createAndRegisterNode(HEIGHT - 1, WIDTH - 2) // exit
}

function tryCreateNode(row, col) {

    if (MAP[row][col] == "#") { return }
    
    const a = isFree(row - 1, col)
    const b = isFree(row + 1, col)
    const c = isFree(row, col - 1)
    const d = isFree(row, col + 1)
    
    if (a + b + c + d < 3) { return }
    
    createAndRegisterNode(row, col)    
}

function isFree(row, col) {

    if (row < 0) { return 0 }
    if (col < 0) { return 0 }
    
    if (row > HEIGHT - 1) { return 0 }
    if (col > WIDTH - 1)  { return 0}
    
    if (MAP[row][col] == "#") { return 0 }

    return 1
}

function createAndRegisterNode(row, col) {

    const node = { "row": row, "col": col, "trips": [ ] }

    NODES.push(node)
    
    MAP[row][col] = "" + NODES.length - 1
}

///////////////////////////////////////////////////////////

function walkBetweenNodes() {

    for (const node of Object.values(NODES)) { walkFromNode(node) }
}

function walkFromNode(node) {

    const row = node.row
    const col = node.col
    
    walkFromNode2(node, row - 1, col)
    walkFromNode2(node, row + 1, col)
    walkFromNode2(node, row, col - 1)
    walkFromNode2(node, row, col + 1)
}

function walkFromNode2(node, row, col) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH - 1)  { return }
    
    if (MAP[row][col] == "#") { return }

    walkFromNode3(node, row, col)
}

function walkFromNode3(beginNode, row1, col1) {

    const walked = new Uint8Array(WIDTH * HEIGHT)
    
    const index = beginNode.row * WIDTH + beginNode.col
    
    walked[index] = 1 // avoid step on begin node
        
    const index2 = row1 * WIDTH + col1
        
    walked[index2] = 1 // avoid step twice on first position
    
    let futurePoints = [ createPoint(row1, col1) ]
    
    let distance = 0
    
    while (true) {

        if (futurePoints.length == 0) { console.log("ERROR: not expecting dead end"); Deno.exit() }
        
        distance += 1
        
        const currentPoint = futurePoints.shift()
    
        const row = currentPoint.row
        const col = currentPoint.col
        
        if (MAP[row][col] != ".") {
                
            const indexOfEndNode = parseInt(MAP[row][col])
        
            beginNode.trips.push(createTrip(indexOfEndNode, distance))
            return 
        }
    
        walkFromNode4(row - 1, col, walked, futurePoints)
        walkFromNode4(row + 1, col, walked, futurePoints)
        walkFromNode4(row, col - 1, walked, futurePoints)
        walkFromNode4(row, col + 1, walked, futurePoints)
    }
}

function walkFromNode4(row, col, walked, futurePoints) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH - 1) { return }
    
    const index = row * WIDTH + col
    
    if (walked[index] != 0) { return }
    
    if (MAP[row][col] == "#") { return }
    
    walked[index] = 1
    
    futurePoints.push(createPoint(row, col))
}

function createTrip(indexOfEndNode, distance) {

    const codedIndexOfEndNode = String.fromCharCode(indexOfEndNode)
        
    return { "indexOfEndNode": indexOfEndNode, "codedIndexOfEndNode": codedIndexOfEndNode, "distance": distance }
}

///////////////////////////////////////////////////////////

function findLengthOfLongestTravel() {

    let best = 0
    
    const home = String.fromCharCode(0)

    const exit = String.fromCharCode(NODES.length - 1)

    const currentTravels = [ createTravel(home, 0) ]

    while (true) {    
    
        const currentTravel = currentTravels.at(-1)
        
        if (currentTravel == undefined) { break }
        
        const currentPath = currentTravel.path
        const currentDistance = currentTravel.distance
        
        const index = currentPath.charCodeAt(currentPath.length - 1)
        
        const lastNode = NODES[index]
        
        let overwritten = false
        
        for (const trip of lastNode.trips) {
        
            if (currentPath.includes(trip.codedIndexOfEndNode)) { continue }
            
            const path = currentPath + trip.codedIndexOfEndNode

            const distance = currentDistance + trip.distance            
            
            if (trip.codedIndexOfEndNode == exit) { 
               
                if (distance > best) { best = distance }
                continue
            }
    
            if (! overwritten) {
            
                overwritten = true
                currentTravel.path = path
                currentTravel.distance = distance
            }
            else {   
                currentTravels.push(createTravel(path, distance))
            }
        }
        if (! overwritten) { currentTravels.pop() }
    }
    return best    
}

function createTravel(path, distance) {

    return { "path": path, "distance": distance }
}
        
///////////////////////////////////////////////////////////

function showMap() {

    console.log("")
    
    for (const line of MAP) { console.log(line.join("")) }
}

main()

