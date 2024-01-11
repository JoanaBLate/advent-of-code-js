"use strict"

// solving the puzzle takes (my computer) 0.040s

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

var WIDTH = 0

var HEIGHT = 0

const NODES = { }

const PATHS = { } // { id-by-begin: list }


function main() {

    processInput()

    createAllNodes()

    walkPathsBetweenNodes()
        
    console.log("the answer is", findLengthOfLongestTravel())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { MAP.push(line.trim()) }
    
    HEIGHT = MAP.length
    
    WIDTH = MAP[0].length
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
    
    const a = isFreeOrValve(row - 1, col)
    const b = isFreeOrValve(row + 1, col)
    const c = isFreeOrValve(row, col - 1)
    const d = isFreeOrValve(row, col + 1)
    
    if (a + b + c + d < 3) { return }
    
    createAndRegisterNode(row, col)    
}

function isFreeOrValve(row, col) {

    if (row < 0) { return 0 }
    if (col < 0) { return 0 }
    
    if (row > HEIGHT - 1) { return 0 }
    if (col > WIDTH - 1)  { return 0}
    
    if (MAP[row][col] == "#") { return 0 }

    return 1
}

function createAndRegisterNode(row, col) {

    NODES[row + "~" + col] = { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function walkPathsBetweenNodes() {

    for (const node of Object.values(NODES)) { walkPathsFromNode(node) }
}

function walkPathsFromNode(node) {

    const row = node.row
    const col = node.col
    
    walkPathFromNode(node, row - 1, col, "n")
    walkPathFromNode(node, row + 1, col, "s")
    walkPathFromNode(node, row, col - 1, "w")
    walkPathFromNode(node, row, col + 1, "e")
}

function walkPathFromNode(node, row, col, direction) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH - 1)  { return }
    
    const symbol = MAP[row][col]
    
    if (symbol == "#") { return }
    
    if (symbol == "v"  &&  direction == "n") { return }
    if (symbol == ">"  &&  direction == "w") { return }
    if (symbol == "<"  &&  direction == "e") { return }

    walkPathFromNode2(node, row, col)
}

function walkPathFromNode2(beginNode, r, c) {

    const walked = new Uint8Array(WIDTH * HEIGHT)
    
    const idx = beginNode.row * WIDTH + beginNode.col
    
    walked[idx] = 2
    
    let futurePoints = [ createPoint(r, c) ]
    
    let length = 0
    
    while (true) {

        if (futurePoints.length == 0) { createAndRegisterPath(beginNode, null, length); return }
        
        length += 1
        
        const currentPoint = futurePoints.shift()
    
        const row = currentPoint.row
        const col = currentPoint.col
        
        const index = row * WIDTH + col
        
        walked[index] = 1
        
        const endNode = NODES[row + "~" + col]
        
        if (endNode != undefined) { createAndRegisterPath(beginNode, endNode, length); return }
    
        walkPoint(row - 1, col, "n", walked, futurePoints)
        walkPoint(row + 1, col, "s", walked, futurePoints)
        walkPoint(row, col - 1, "w", walked, futurePoints)
        walkPoint(row, col + 1, "e", walked, futurePoints)
    }
}

function walkPoint(row, col, direction, walked, futurePoints) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH - 1) { return }
    
    const index = row * WIDTH + col
    
    if (walked[index] != 0) { return }
    
    const symbol = MAP[row][col]
    
    if (symbol == "#") { return }
    
    if (symbol == "v"  &&  direction == "n") { return }
    if (symbol == ">"  &&  direction == "w") { return }
    if (symbol == "<"  &&  direction == "e") { return }
    
    walked[index] = 1
    
    futurePoints.push(createPoint(row, col))
}

function createAndRegisterPath(beginNode, endNode, length) {

    const path = { "beginNode": beginNode, "endNode": endNode, "length": length }

    const id = beginNode.row + "~" + beginNode.col
    
    if (PATHS[id] == undefined) { PATHS[id] = [ ] }
    
    PATHS[id].push(path)
}

///////////////////////////////////////////////////////////

function findLengthOfLongestTravel() {

    let best = 0

    const exit = (HEIGHT - 1) + "~" + (WIDTH - 2)

    const currentTravels = [ createTravel([ "0~1" ], 0) ]

    while (true) {
    
        const currentTravel = currentTravels.pop()
        
        if (currentTravel == undefined) { break }
        
        const lastVisited = currentTravel.visiteds.at(-1)
        
        const paths = PATHS[lastVisited]
        
        for (const path of paths) {
        
            if (path.endNode == null) { continue }
            
            const endId = path.endNode.row + "~" + path.endNode.col
            
            const distance = currentTravel.distance + path.length
            
            const visiteds = currentTravel.visiteds.slice() // cloning is necessary
            
            if (visiteds.includes(endId)) { continue }
            
            visiteds.push(endId)
    
            const travel = createTravel(visiteds, distance)
                        
            if (endId != exit) { currentTravels.push(travel); continue } 
               
            if (travel.distance > best) { best = travel.distance }
        }
    }
    
    return best    
}

function createTravel(visiteds, distance) {

    return { "visiteds": visiteds, "distance": distance }
}

///////////////////////////////////////////////////////////

function showMap(walked) {

    console.log("")
    
    for (let row = 0; row < HEIGHT; row++) {
    
        let line = ""
        
        for (let col = 0; col < WIDTH; col++) {
        
            let s = MAP[row][col]                
        
            if (NODES[row + "~" + col] != undefined) { s = "@" }
            
            if (walked != undefined) {
            
                const index = row * WIDTH + col
            
                if (walked[index] == 1) { s = "?" }
            }

            line += s
        }
        console.log(line)
    }
}
        
///////////////////////////////////////////////////////////

main()

