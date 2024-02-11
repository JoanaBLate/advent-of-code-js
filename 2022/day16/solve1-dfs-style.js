"use strict"

// solving the puzzle takes (my computer) 0.180s

const input = Deno.readTextFileSync("input.txt").trim()

const VALVES = [ ]

const TRIPS = { } // ignores rate zero valves (but includes AA) <--

var BEST = 0


function main() {

    processInput()
        
    fillAllTrips()

    search()
    
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
    
    visiteds[id] = true
    
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

function createNode(id, path, minutes, score, dailyScore) {

    return { "id": id, "path": path, "minutes": minutes, "score": score, "dailyScore": dailyScore }
}

///////////////////////////////////////////////////////////  

function search() { 

    const todo = [ createNode("AA", "AA", 30, 0, 0) ]
    
    while (todo.length != 0) {
            
        const node = todo.pop()
    
        const destinies = Object.keys(TRIPS[node.id])

        let gotATravel = false
        
        for (const destiny of destinies) {
        
            if (node.path.includes(destiny)) { continue }

            const time = TRIPS[node.id][destiny] + 1 // +1 for the opening
            
            if (time >= node.minutes) { continue }
            
            gotATravel = true
            
            //
            
            const newId = destiny
            
            const newPath = node.path + destiny
            
            const newMinutes = node.minutes - time
            
            const newScore = node.score + time * node.dailyScore

            const newDailyScore = node.dailyScore + VALVES[destiny].rate
            
            const newNode = createNode(newId, newPath, newMinutes, newScore, newDailyScore)  
            
            todo.push(newNode)              
        }
        
        if (gotATravel) { continue }
        
        const result = node.score + node.minutes * node.dailyScore

        if (result > BEST) { BEST = result }
    }
}                

///////////////////////////////////////////////////////////

main()

