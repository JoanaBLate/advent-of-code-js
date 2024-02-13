"use strict"

// solving the puzzle takes (my computer) 0.095s

const input = Deno.readTextFileSync("input.txt").trim()

const FLOWS = { }

const NEIGHBORS = { }

const TRIPS = { } // includes valve opening time 

var BEST = 0


function main() {

    processInput()
    
    fillTrips()
    
    // path, time, minutes, score, dailyScore   
    search("!", 0, 30, 0, 0)
    
    console.log("the answer is", BEST)
}

///////////////////////////////////////////////////////////

function processInput() {
    
    const conversion = { "AA": "!" }

    let availableCode = "!".charCodeAt(0) + 1
    
    //

    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        let s = line.replace("Valve ", "")
        
        const id = converted(s.substr(0, 2))
        
        s = s.substr(2).replace(" has flow rate=", "")
        
        const rate = parseInt(s)
        
        s = s.replace(rate.toString(), "")
        
        s = s.replace("; tunnel leads to valve ", "")
        
        s = s.replace("; tunnels lead to valves ", "")
        
        const neighbors = s.split(", ")
        
        for (let n = 0; n < neighbors.length; n++) { neighbors[n] = converted(neighbors[n]) }
        
        //    
    
        FLOWS[id] = rate
        
        NEIGHBORS[id] = neighbors
    } 
    
    function converted(name) { // reducing size of names to 1 character only
    
        if (conversion[name] == undefined) {
        
            conversion[name] = String.fromCharCode(availableCode)
            
            availableCode += 1
        }
    
        return conversion[name]
    }   
}

///////////////////////////////////////////////////////////

function fillTrips() {

    for (const name of Object.keys(FLOWS)) { fillTripsThis(name) }
}

function fillTripsThis(name) {
    
    if (FLOWS[name] == 0  &&  name != "!") { return }
    
    const myTrips = [ ] // [ { name: time } ]
    
    const visiteds = { } // { name: true }
    
    visiteds[name] = true
    
    let futureNeighbors = NEIGHBORS[name]
        
    let time = 0
    
    while (futureNeighbors.length != 0) {
    
        time += 1
        
        const currentNeighbors = futureNeighbors
        
        futureNeighbors = [ ]
        
        for (const neighbor of currentNeighbors) {        
        
            if (visiteds[neighbor]) { continue }
            
            visiteds[neighbor] = true
            
            if (FLOWS[neighbor] != 0) { myTrips.push(createTrip(neighbor, time + 1)) } // includes valve opening time
            
            for (const newNeighbor of NEIGHBORS[neighbor]) {
            
                if (visiteds[newNeighbor]) { continue }

                if (futureNeighbors.includes(newNeighbor)) { continue }

                futureNeighbors.push(newNeighbor)                            
            }        
        }
    }
        
    TRIPS[name] = myTrips
}

function createTrip(destiny, time) {  // includes valve opening time

    return { "destiny": destiny, "time": time }
}

/////////////////////////////////////////////////////////// 

function search(path, time, minutes, score, dailyScore) {

    score += time * dailyScore
    
    minutes -= time
    
    const room = path.at(-1)
    
    dailyScore += FLOWS[room]
    
    //

    let gotATravel = false

    const trips = TRIPS[room]
    
    for (const trip of trips) {
    
        const destiny = trip.destiny
        
        const time = trip.time
    
        if (path.includes(destiny)) { continue }
        
        if (time >= minutes) { continue }
        
        gotATravel = true
        
        search(path + destiny, time, minutes, score, dailyScore) 
    }
    
    if (gotATravel) { return }
    
    score += minutes * dailyScore

    if (score > BEST) { BEST = score }
}

///////////////////////////////////////////////////////////

main()

