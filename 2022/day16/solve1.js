"use strict"

// solving the puzzle takes (my computer) 0.205s

const input = Deno.readTextFileSync("input.txt").trim()

const VALVES = [ ]

const TRIPS = { } // ignores rate zero rooms (but includes AA) <--

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

    for (const id of Object.keys(VALVES)) { fillAllTripsOf(id) }
}

function fillAllTripsOf(id) {

    const valve = VALVES[id]
    
    if (valve.rate == 0  &&  id != "AA") { return }
    
    TRIPS[id] = { }
    
    const path = { }
    
    let futureRooms = valve.neighbors.slice()
        
    let distance = 0
    
    while (futureRooms.length != 0) {
    
        distance += 1
        
        const currentRooms = futureRooms
        
        futureRooms = [ ]
        
        for (const room of currentRooms) {        
        
            if (path[room]) { continue }
            
            path[room] = true
            
            const newValve = VALVES[room]
            
            if (newValve.rate != 0) { TRIPS[id][room] = distance }
            
            for (const newRoom of newValve.neighbors) {
            
                if (path[newRoom]) { continue }

                if (futureRooms.includes(newRoom)) { continue }

                futureRooms.push(newRoom)                            
            }        
        }
    }
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
    
    const result = score + minutes * dailyScore

    if (result > BEST) { BEST = result }
}

///////////////////////////////////////////////////////////

main()

