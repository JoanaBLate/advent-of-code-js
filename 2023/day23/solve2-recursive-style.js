"use strict"

// solving the puzzle takes (my computer) 0.530s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ] // no slope inside

var WIDTH = 0

var HEIGHT = 0

const NODES = [ ]

var indexOfTargetNode = 0

var WALKED = null


function main() {

    processInput()

    createAllNodes()

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

    return { "indexOfEndNode": indexOfEndNode, "distance": distance }
}

///////////////////////////////////////////////////////////

function findLengthOfLongestTravel() {
    
    indexOfTargetNode = NODES.length - 1
    
    WALKED = new Uint8Array(NODES.length)

    return dfs(0)
}

function dfs(indexOfCurrentNode) { // depth first search algorithm

    if (indexOfCurrentNode == indexOfTargetNode) { return 0 }
    
    if (shallAbortPath()) { return -Infinity }

    let best = -Infinity
    
    WALKED[indexOfCurrentNode] = 1
    
    const node = NODES[indexOfCurrentNode]
    
    for (const trip of node.trips) {
    
        const indexOfNextNode = trip.indexOfEndNode
        
        if (WALKED[indexOfNextNode] == 1) { continue }
        
        const distance = trip.distance + dfs(indexOfNextNode)
        
        best = Math.max(best, distance)
    }

    WALKED[indexOfCurrentNode] = 0

    return best
}

function shallAbortPath() { // not called after target was reached in current path

    const targetNode = NODES[indexOfTargetNode]
        
    for (const trip of targetNode.trips) {
    
        const indexOfNextNode = trip.indexOfEndNode 
        
        if (! WALKED[indexOfNextNode]) { return false }
    }
    
    return true // all neighbors were walked but target was not reached
}

///////////////////////////////////////////////////////////

function showMap() {

    console.log("")
    
    for (const line of MAP) { console.log(line.join("")) }
}

main()

