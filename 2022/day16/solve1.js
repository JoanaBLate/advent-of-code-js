"use strict"

// solving the puzzle takes (my computer) 0.180s

const input = Deno.readTextFileSync("input.txt").trim()

const VALVES = [ ]

const TRIPS = { } // ignores rate zero valves (but includes AA) <--

var BEST = 0


function main() {

    processInput()
        
    fillAllTrips()

    search("AA", "AA", 30, 0, 0)
    
    console.log("the answer is", BEST)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        let s = line.replace("Valve ", "")
        
        const id = s.substr(0, 2)
        
        s = s.substr(2).replace(" has flow rate=", "")
        
        const rate = parseInt(s)
        
        s = s.replace(rate.toString(), "")
        
        s = s.replace("; tunnel leads to valve ", "")
        
        s = s.replace("; tunnels lead to valves ", "")
        
        const neighbors = s.split(", ")
        
        VALVES[id] = { "rate": rate, "neighbors": neighbors }
    }
}

///////////////////////////////////////////////////////////

function fillAllTrips() {

    for (const id of Object.keys(VALVES)) { TRIPS[id] = fillAllTripsOf(id) }
}

function fillAllTripsOf(id) {

    const valve = VALVES[id]
    
    if (valve.rate == 0  &&  id != "AA") { return }
    
    const myTrips = { }
    
    const visiteds = { }
    
    let futureNeighbors = valve.neighbors.slice()
        
    let distance = 0
    
    while (futureNeighbors.length != 0) {
    
        distance += 1
        
        const currentNeighbors = futureNeighbors
        
        futureNeighbors = [ ]
        
        for (const neighbor of currentNeighbors) {        
        
            if (visiteds[neighbor]) { continue }
            
            visiteds[neighbor] = true
            
            const newValve = VALVES[neighbor]
            
            if (newValve.rate != 0) { myTrips[neighbor] = distance }
            
            for (const newNeighbor of newValve.neighbors) {
            
                if (visiteds[newNeighbor]) { continue }

                if (futureNeighbors.includes(newNeighbor)) { continue }

                futureNeighbors.push(newNeighbor)                            
            }        
        }
    }
        
    return myTrips
}

/////////////////////////////////////////////////////////// 

function search(id, path, minutes, score, dailyScore) { // recursive

    const destinies = Object.keys(TRIPS[id])

    let gotATravel = false
    
    for (const destiny of destinies) {
    
        if (path.includes(destiny)) { continue }

        const time = TRIPS[id][destiny] + 1 // +1 for the opening
        
        if (time >= minutes) { continue }
        
        gotATravel = true
        
        //
        
        const newId = destiny
        
        const newPath = path + destiny
        
        const newMinutes = minutes - time
        
        const newScore = score + time * dailyScore

        const newDailyScore = dailyScore + VALVES[destiny].rate
        
        search(newId, newPath, newMinutes, newScore, newDailyScore) 
    }
    
    if (gotATravel) { return }
    
    score += minutes * dailyScore

    if (score > BEST) { BEST = score }
}

///////////////////////////////////////////////////////////

main()

