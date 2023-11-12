"use strict"

// solving the puzzle takes (my computer) 5s (NOT optimized)

/*   
    you can easily get trapped forever in this maze!
    
    you must be very objective:
    
        1. forget the doors: all you want are the KEYS;
           doors are just temporary obstacles;
           DON'T make nodes from them
           
        2. any location with a key is a node ONLY WHILE
           you don't have that key
           
        3. sometimes the fastest way for a short distance
           isn't the best way for a long distance
           
*/

const map = [ ]

var WIDTH = 0
var HEIGHT = 0

const LOCATIONS = { }

var numberOfKeys = 0

var distanceTable = null 

var bestDistance = 999999


function main() {

    processInput()

    blockDeadEnds()

 // showMap()
     
    noteSpecialLocations()
    
    distanceTable = new Int16Array(WIDTH * HEIGHT)
    
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

function noteSpecialLocations() {

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
        
            const item = map[row][col]
            
            if (item == ".") { continue }
            if (item == "#") { continue }

            LOCATIONS[item] = createPoint(row, col)
            
            if (item >= "a"  &&  item <= "z") { numberOfKeys += 1 }
        }
    }
}

function resetDistanceTable() {

    const off = WIDTH * HEIGHT
    
    for (let index = 0; index < off; index++) { distanceTable[index] = -1 }
}

function getLocationDistance(symbol) {

    const point = LOCATIONS[symbol]
    
    const index = point.row * WIDTH + point.col
    
    return distanceTable[index]
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

function createPath(trek, distance) {

        const end = trek.at(-1)
        
        const sorted = trek.split("").sort().join("")

        return { "trek": trek, "distance": distance, "trekEnd": end, "sortedTrek": sorted }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function findBestDistance() {

    const homePath = createPath("@", 0)
    
    let futurePaths = [ homePath ]
    
    while (futurePaths.length > 0) {

        const currentPaths = futurePaths

        futurePaths = [ ]
    
        for (const path of currentPaths) {
        
            if (path.trek.length == numberOfKeys + 1) {  // '+ 1' because of '@'
            
                if (path.distance < bestDistance) { bestDistance = path.distance }
                
                continue
            }
            
            const foundKeys = explore(path.trek)
            
            for (const key of foundKeys) {
            
                const distance = path.distance + getLocationDistance(key)
                
                const trek = path.trek + key
                
                includeInFuturePathsOrNot(trek, distance, futurePaths)
            }        
        }    
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function explore(trek) {

    resetDistanceTable()
    
    let foundKeys = ""

    const home = trek.at(-1)

    const homePoint = LOCATIONS[home]
    
    let futurePoints = [ homePoint ]
    
    let distance = 0

    while (true) {

        const currentPoints = futurePoints
        
        futurePoints = [ ]
        
        for (const point of currentPoints) {
            
            const row = point.row
            const col = point.col
            
            const index = row * WIDTH + col
            
            distanceTable[index] = distance
            
            const symbol = map[row][col]
            
            if (isNewKey(symbol)) { foundKeys += symbol }
                        
            grabNeighbor(row-1, col)
            grabNeighbor(row+1, col)
            grabNeighbor(row, col-1)
            grabNeighbor(row, col+1)            
        }
        
        if (futurePoints.length == 0) { return foundKeys }
        
        distance += 1
    }
    
    function isNewKey(symbol) {
    
        if (symbol < "a") { return false }
        if (symbol > "z") { return false }
        
        if (trek.includes(symbol)) { return false }
        
        if (foundKeys.includes(symbol)) { return false }
        
        return true
    }
    
    function grabNeighbor(row, col) {

        if (row < 0) { return }
        if (col < 0) { return }

        if (row >= HEIGHT) { return }
        if (col >= WIDTH)  { return }
        
        if (! isAccessible(row, col)) { return }

        const index = row * WIDTH + col
        
        if (distanceTable[index] != -1) { return }
        
        distanceTable[index] = -2 // reserved
              
        const point = createPoint(row, col)
        
        futurePoints.push(point)
    }

    function isAccessible(row, col) {
        
        const symbol = map[row][col] 
        
        if (symbol == ".") { return true }
        if (symbol == "#") { return false }
        if (symbol  < "A") { return true }
        if (symbol  > "Z") { return true }
        
        return trek.includes(symbol.toLowerCase())
    }    
}

///////////////////////////////////////////////////////////

function includeInFuturePathsOrNot(trek, distance, futurePaths) {

    const end = trek.at(-1)
    
    const sorted = trek.split("").sort().join("")
    
    for (const path of futurePaths) {

        if (path.trekEnd != end) { continue }
        
        if (path.sortedTrek != sorted) { continue }
        
        if (path.distance <= distance) { return } // the candidate is not better
        
        // replacing old data with candidate's data
        path.trek = trek
        path.distance = distance
        return
    }

    futurePaths.push(createPath(trek, distance))           
}

///////////////////////////////////////////////////////////

function blockDeadEnds() {
    
    while (true) {

        let changed = false
        
        for (let row = 1; row < HEIGHT - 1; row++) { // granted to be inside the map

            for (let col = 1; col < WIDTH - 1; col++) { // granted to be inside the map
            
                const item = map[row][col] 
                
                if (item == "#") { continue }
                if (item == "@") { continue }            
                if (item >= "a"  &&  item <= "z") { continue }
            
                let count = 0
                
                if (map[row-1][col] == "#") { count += 1 }
                if (map[row+1][col] == "#") { count += 1 }
                if (map[row][col-1] == "#") { count += 1 }
                if (map[row][col+1] == "#") { count += 1 }
            
                if (count > 2) { map[row][col] = "#"; changed = true }
            }
        }
        if (! changed) { return }
    }
}

///////////////////////////////////////////////////////////

function showMap() {

    console.log("")
    
    for (const line of map) { console.log(line.join("")) }
    
    console.log("")
}
            
        
main()

