"use strict"

// solving the puzzle takes (my computer) 0.415s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ] // no slope inside

var WIDTH = 0

var HEIGHT = 0

const NODES = [ ] // expecting the target to be the last node

const PATH = [ ]

var GUARDIAN = null


function main() {

    processInput()

    createAllNodes()

    walkBetweenNodes()
    
    const length = findLengthOfLongestTravel()
      
    console.log("the answer is", length)
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

    const node = { "row": row, "col": col, "trips": [ ], "isInPath": false, "tripIndex": -1, "totalDistance": 0 }

    NODES.push(node)
    
    MAP[row][col] = "" + (NODES.length - 1)
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

    const WALKED = new Uint8Array(WIDTH * HEIGHT)
    
    const index = beginNode.row * WIDTH + beginNode.col
    
    WALKED[index] = 1 // avoid step on begin node
        
    const index2 = row1 * WIDTH + col1
        
    WALKED[index2] = 1 // avoid step twice on first position
    
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
            
            const endNode = NODES[indexOfEndNode]
        
            beginNode.trips.push(createTrip(endNode, distance))
            return 
        }
    
        walkFromNode4(row - 1, col, WALKED, futurePoints)
        walkFromNode4(row + 1, col, WALKED, futurePoints)
        walkFromNode4(row, col - 1, WALKED, futurePoints)
        walkFromNode4(row, col + 1, WALKED, futurePoints)
    }
}

function walkFromNode4(row, col, WALKED, futurePoints) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH - 1) { return }
    
    const index = row * WIDTH + col
    
    if (WALKED[index] != 0) { return }
    
    if (MAP[row][col] == "#") { return }
    
    WALKED[index] = 1
    
    futurePoints.push(createPoint(row, col))
}

function createTrip(endNode, distance) {

    return { "endNode": endNode, "distance": distance }
}

///////////////////////////////////////////////////////////

function findLengthOfLongestTravel() {

    const targetNode = NODES.at(-1)
    
    if (targetNode.trips.length == 1) { GUARDIAN = targetNode.trips[0].endNode }
    
    PATH.push(NODES[0])
    
    PATH[0].isInPath = true
    
    return search()
}

///////////////////////////////////////////////////////////

function search() { // depth first search algorithm

    const targetNode = NODES.at(-1)

    let best = 0
    
    while (true) { 
        
        if (PATH.length == 0) { return best }

        const node = PATH.at(-1)
        
        if (node == targetNode) { 
           
            if (node.totalDistance > best) { best = node.totalDistance }
            
            PATH.pop().isInPath = false
            PATH.pop().isInPath = false
            continue
        }
        
        if (GUARDIAN != null) {
        
            if (node != GUARDIAN  &&  GUARDIAN.isInPath) { PATH.pop(); continue } // not going to target
        }
        
        node.tripIndex += 1
        
        const trip = node.trips[node.tripIndex]
        
        if (trip == undefined) { PATH.pop().isInPath = false; continue }
        
        const nextNode = trip.endNode
        
        if (nextNode.isInPath) { continue }
        
        nextNode.tripIndex = -1
        
        nextNode.isInPath = true
        
        nextNode.totalDistance = node.totalDistance + trip.distance
        
        PATH.push(nextNode)
    }
}

///////////////////////////////////////////////////////////

function showMap() {

    console.log("")
    
    for (const line of MAP) { console.log(line.join("")) }
}

main()

