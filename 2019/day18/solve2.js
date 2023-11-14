"use strict"

// solving the puzzle takes (my computer) 0.260s

const map = [ ]

var WIDTH = 0
var HEIGHT = 0

const droidsHomes = [ ]

var numberOfKeys = 0

const NODES = new Array(128) // 'z' is 122 // has blanks!

const GROUPS = { } // for performance

var bestDistance = 999999


function main() {

    processInput()

    adjustMapToFourDroids()
    
    fillNodes() // also gets numberOfKeys and fills GROUPS
                
    findBestDistance()
       
    console.log("the answer is", bestDistance)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    for (const line of lines) { map.push(line.trim().split("")) }
    
    WIDTH = map[0].length
    HEIGHT = map.length
}

function adjustMapToFourDroids() {

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            if (map[row][col] != "@") { continue }
    
            map[row-1][col-1] = "1"
            map[row-1][col]   = "#"
            map[row-1][col+1] = "2"

            map[row][col-1] = "#"
            map[row][col]   = "#"
            map[row][col+1] = "#"    
            
            map[row+1][col-1] = "3"
            map[row+1][col]   = "#"
            map[row+1][col+1] = "4"
            
            droidsHomes.push(createPoint(row-1, col-1))
            droidsHomes.push(createPoint(row-1, col+1))
            droidsHomes.push(createPoint(row+1, col-1))
            droidsHomes.push(createPoint(row+1, col+1))   
            
            return
        }
    } 
}

///////////////////////////////////////////////////////////

function fillNodes() { // also gets numberOfKeys and fills GROUPS

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            const item = map[row][col]
            
            if (item == ".") { continue }
            if (item == "#") { continue }            
            
            if (item >= "a"  &&  item <= "z") { numberOfKeys += 1; GROUPS[item] = [ ] }
            
            NODES[item.charCodeAt(0)] = explore(row, col) // accepts 1,2,3 and 4
        }
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
        
        if (symbol == "#") { return }
        
        const point = createPoint(row, col)
        
        if (symbol == ".") { futurePoints.push(point); return }
        
        if (symbol == "@") { futurePoints.push(point); return }
        
        myTrips.push(createNode(symbol, distance + 1))
        
        if (symbol >= "A"  &&  symbol <= "Z") { return }
        
        futurePoints.push(point)        
    }
}

///////////////////////////////////////////////////////////

function findBestDistance() {

    const allKeys = Object.keys(GROUPS)
    
    let futurePaths = [ ]

    initDroid("1", futurePaths)
    initDroid("2", futurePaths)
    initDroid("3", futurePaths)
    initDroid("4", futurePaths)
    //
    
    while (futurePaths.length > 0) {

        const currentPaths = futurePaths

        for (const key of allKeys) { GROUPS[key] = [ ] }

        for (const path of currentPaths) {
        
            if (path.trek.length == numberOfKeys) { 
            
                if (path.distance < bestDistance) { bestDistance = path.distance }
                continue
            }
            
            walkDroid("1", path)
            walkDroid("2", path)
            walkDroid("3", path)
            walkDroid("4", path)
        }
        
        futurePaths = [ ]
        
        for (const key of allKeys) {
        
            const group = GROUPS[key]
            
            for (const node of group) { futurePaths.push(node) }
        }        
    }
}

///////////////////////////////////////////////////////////

function initDroid(droidId, futurePaths) {

    const home = droidsHomes.shift()
    
    const startingTrips = explore(home.row, home.col)
    
    for (const trip of startingTrips) {
    
        if (trip.destiny < "a"  ||  trip.destiny > "z") { continue }
        
        const n = trip.destiny.charCodeAt(0) - "a".charCodeAt(0)
        
        const trekCode = Math.pow(2, n)
        
        const path = createPath(droidId, trip.destiny, trip.distance, trekCode)
        
        futurePaths.push(path) 
    }
}
            
function walkDroid(droidId, path) {        

    const index = path.droids.lastIndexOf(droidId)

    const location = index == -1 ? droidId : path.trek[index]

    const trips = walkNodes(path.trek, location)       
    
    for (const trip of trips) {

        const droids = path.droids + droidId
        
        const trek = path.trek + trip.destiny
        
        const distance = path.distance + trip.distance
        
        const n = trip.destiny.charCodeAt(0) - "a".charCodeAt(0)
        
        const trekCode = path.trekCode + Math.pow(2, n)
        
        includeInGroupOrNot(droids, trek, distance, trekCode, GROUPS[trip.destiny])
    }
}

///////////////////////////////////////////////////////////

function includeInGroupOrNot(droids, trek, distance, trekCode, group) {

    // checking through small groups is far more efficient than
    // checking each candidate path against all future paths!
    
    for (const path of group) {
        
        if (path.trekCode != trekCode) { continue }
        
        if (path.distance <= distance) { return } // the candidate is not better
        
        // replacing old data with candidate's data
        path.droids = droids
        path.trek = trek
        path.distance = distance
        return
    }

    const newPath = createPath(droids, trek, distance, trekCode)
    
    group.push(newPath)   
}  

///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function createNode(destiny, distance) {

    return { "destiny": destiny, "distance": distance }
}

function createPath(droids, trek, distance, trekCode) {

    return { "droids": droids, "trek": trek, "distance": distance, "trekCode": trekCode }
}

///////////////////////////////////////////////////////////

function walkNodes(trek, home) { 

    const NOT_VISITED = 999999

    const distances = new Uint32Array(128) // z is 122
    
    for (let n = 0; n < 128; n++) { distances[n] = NOT_VISITED } 
        
    distances[home.charCodeAt(0)] = 0 
    
    let newKeys = ""

    let futureNodes = [ createNode(home, 0) ]

    while (true) {

        const currentNodes = futureNodes
        
        futureNodes = [ ]
        
        if (currentNodes.length == 0) {

            const result = [ ]
            
            for (const key of newKeys) { 
            
                const distance = distances[key.charCodeAt(0)]
                 
                result.push(createNode(key, distance))
            }
            return result
        }
        
        for (const node of currentNodes) {
                        
            const trips = NODES[node.destiny.charCodeAt(0)]
            
            for (const trip of trips) {
            
                const destiny = trip.destiny
                
                if (destiny == "1") { continue }
                if (destiny == "2") { continue }
                if (destiny == "3") { continue }
                if (destiny == "4") { continue }
                
                const index = destiny.charCodeAt(0)
            
                const distance = node.distance + trip.distance
                
                if (distances[index] == NOT_VISITED) { 
                
                    distances[index] = distance 
                }
                else if (distance < distances[index]) {
                    
                     distances[index] = distance
                }
                else {
                
                     continue
                }
            
                if (destiny >= "a"  &&  destiny <= "z") {
                
                    if (trek.includes(destiny)) { continue }
                    
                    if (newKeys.includes(destiny)) { continue }
                    
                    newKeys += destiny; continue // not going forward
                }
                
                // it is a door
                
                const neededKey = destiny.toLowerCase()
                
                if (! trek.includes(neededKey)) { continue } // locked door
                
                futureNodes.push(createNode(destiny, distance))
            }
        }
    }       
}

main()

