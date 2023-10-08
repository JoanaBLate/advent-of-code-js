"use strict"

// solving the puzzle takes (my computer) 0.092s

var map = ""
var numberOfRows = 0
var numberOfCols = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")

    numberOfRows = rawLines.length
    
    for (const rawLine of rawLines) { map += rawLine.trim() }
    
    numberOfCols = map.length / numberOfRows
    
    const spots = findSpots(map)
    
    const allPaths = createAllPaths(spots)
    
    const allTravels = makeAllTravels(spots)
    
    let fewest = 9999999

    for (const path of allPaths) {
    
        const steps = stepsFor(path, allTravels)

        if (steps < fewest) { fewest = steps }
    }

    console.log("fewest number of steps is", fewest)
}

function findSpots(map) {

    const spots = [ ]

    for (const c of map) {
    
        if (c == ".") { continue }
        if (c == "#") { continue }

        spots.push(parseInt(c))
    }
    
    spots.sort(function (a,b) { return a - b })
    
    return spots.join("")
}

///////////////////////////////////////////////////////////

function createAllPaths(spots) { 
    
    const stops = spots.replace("0", "")

    let paths = [ ]

    for (const c of stops) { paths.push("0") } // c is just a counter
    
    for (const c of stops) { paths = increasedPaths(paths, stops) } // c is just a counter
    
    return paths
}

function increasedPaths(paths, stops) {

    const newPaths = [ ]
    
    for (const path of paths) { 

        for (const c of stops) {
        
            if (path.includes(c)) { continue }

            newPaths.push(path + c) 
        }        
    }
    
    return newPaths
}

///////////////////////////////////////////////////////////

function stepsFor(path, travels) {

    let steps = 0
    
    for (let i = 0; i < path.length - 1; i++) {

        const key = path[i] + "~" + path[i + 1]        
        
        steps += travels[key]
    }
    
    const last = path[path.length - 1] // including return to home
    
    const key = last + "~0"
    
    return steps + travels[key]
}

///////////////////////////////////////////////////////////

function makeAllTravels(spots) {

    const dict = { }
    
    for (const c of spots) {
    
        const travel = makeFullTravel(c)
        
        for (const d of spots) {
        
            if (! travel[d]) { continue }
            
            dict[c + "~" + d] = travel[d]
        }        
    }

    return dict
}

function makeFullTravel(c) {

    const travel = { }

    const homeIndex = map.indexOf(c)
    
    const homeY = Math.floor(homeIndex / numberOfCols)
    const homeX = homeIndex % numberOfCols
    
    const grid = map.split("")
    
    for (let i = 0; i < grid.length; i++) {
    
        if (grid[i] == ".") { continue }
        if (grid[i] == "#") { continue }
        
        grid[i] = "@" + grid[i]    
    }
    
    //

    let futurePoints = [ createPoint(homeX, homeY) ]

    let step = 0
    
    while (true) {
    
        const pointsToWalk = futurePoints

        futurePoints = [ ]
        
        if (pointsToWalk.length == 0) { return travel }
        
        for (const point of pointsToWalk) { walk(point) }
        
        step += 1
    }
    
    function walk(point) {
    
        const x = point.x
        const y = point.y
        
        const index = (y * numberOfCols) + x
        
        const info = grid[index]

        if (info == "#") { return }
        
        if (info[0] == "@") { 
            travel[info[1]] = step 
        }
        else if (info == ".") {
            // pass
        }
        else { // step number, already walked
            return 
        }
        
        grid[index] = step
        
        tryWalk(x, y-1) // north
        tryWalk(x, y+1) // south
        tryWalk(x-1, y) // west
        tryWalk(x+1, y) // east
    }
    
    function tryWalk(x, y) {
    
        if (x < 0) { return }
        if (y < 0) { return }
        
        if (x >= numberOfCols) { return }
        if (y >= numberOfRows) { return }
        
        futurePoints.push(createPoint(x,y))
    }
}

function createPoint(x, y) {

    return { "x": x, "y": y }
}

main()

