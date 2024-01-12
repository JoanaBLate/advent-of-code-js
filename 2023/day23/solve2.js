"use strict"

// solving the puzzle takes (my computer) 4.5s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ] // no slope inside

var WIDTH = 0

var HEIGHT = 0

const NODES = { }

var availableIds = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

const coordinatesToId = { }


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

    const id = idForNode(row, col)

    NODES[id] = { "row": row, "col": col, "trips": [ ] }
    
    MAP[row][col] = id
    
    coordinatesToId[row + "~" + col] = id
}

function idForNode(row, col) {

    if (row == 0  &&  col == 1) { return "+" }
    
    if (row == HEIGHT - 1  &&  col == WIDTH - 2) { return "-" }
    
    const id = availableIds[0]
    
    if (id == "") { console.log("ERROR: to many nodes to be named"); Deno.exit() }
    
    availableIds = availableIds.substr(1)
    
    return id
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

function walkFromNode3(beginNode, r, c) {

    const walked = new Uint8Array(WIDTH * HEIGHT)
    
    const index = beginNode.row * WIDTH + beginNode.col
    
    walked[index] = 2 // avoid step on begin node; using '2' for the map
        
    const index2 = r * WIDTH + c
        
    walked[index2] = 1 // avoid step twice on first position
    
    let futurePoints = [ createPoint(r, c) ]
    
    let distance = 0
    
    while (true) {

        if (futurePoints.length == 0) { console.log("ERROR: not expecting dead end"); Deno.exit() }
        
        distance += 1
        
        const currentPoint = futurePoints.shift()
    
        const row = currentPoint.row
        const col = currentPoint.col
        
        if (MAP[row][col] != ".") {
                
            const endNodeId = coordinatesToId[row + "~" + col]
        
            beginNode.trips.push({ "endNodeId": endNodeId, "distance": distance })
            return 
        }
    
        walkPoint(row - 1, col, walked, futurePoints)
        walkPoint(row + 1, col, walked, futurePoints)
        walkPoint(row, col - 1, walked, futurePoints)
        walkPoint(row, col + 1, walked, futurePoints)
    }
}

function walkPoint(row, col, walked, futurePoints) {

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

///////////////////////////////////////////////////////////

function findLengthOfLongestTravel() {

    let best = 0

    const exit = "-"

    const currentTravels = [ createTravel("+", 0) ]

    while (true) {    
    
        const currentTravel = currentTravels.pop()
        
        if (currentTravel == undefined) { break }
        
        const lastNode = NODES[currentTravel.path.at(-1)]
        
        for (const trip of lastNode.trips) {
            
            if (currentTravel.path.includes(trip.endNodeId)) { continue }
            
            const path = currentTravel.path + trip.endNodeId

            const distance = currentTravel.distance + trip.distance
    
            const travel = createTravel(path, distance)
                        
            if (trip.endNodeId != exit) { currentTravels.push(travel); continue } 
               
            if (travel.distance > best) { best = travel.distance }
        }
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

