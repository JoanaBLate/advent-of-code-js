"use strict"

// solving the puzzle takes (my computer) 0.049s

const input = Deno.readTextFileSync("input.txt").trim()

const FLOWS = { }

const NEIGHBORS = { }

const TRIPS = { } // includes valve opening time 

const INDICES = { }

const BOARD = { } // best score for each history


function main() {

    processInput()
    
    fillTrips()
    
    fillIndices()

    visit("!", "!", 26, 0) // filling the board
    
    console.log("the answer is", findBestScore())    
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

function fillIndices() {

    let n = -1
    
    for (const name of Object.keys(TRIPS)) { n += 1; INDICES[name] = Math.pow(2, n) }
}

/////////////////////////////////////////////////////////// 

function visit(room, visited, minutes, score) {

    fillBoard(visited, score)
  
    for (const trip of TRIPS[room]) {
      
        const newMinutes = minutes - trip.time

        if (newMinutes <= 0) { continue }
        
        const newRoom = trip.destiny
        
        if (visited.includes(newRoom)) { continue }
        
        const flow = FLOWS[newRoom]
                
        const newScore = score + flow * newMinutes // reaches the last minute

        const newVisited = visited + newRoom
        
        visit(newRoom, newVisited, newMinutes, newScore)
    }
}   

///////////////////////////////////////////////////////////

function fillBoard(visited, score) {

    let code = 0
    
    for (const c of visited) { 
    
        if (c == "!") { continue }
        
        code += INDICES[c] 
    }
    
    if (BOARD[code] == undefined) { BOARD[code] = score; return }
    
    if (BOARD[code] < score) { BOARD[code] = score }
}

///////////////////////////////////////////////////////////

// the BOARD has the best score for each group of visited rooms
// there are two heroes; their paths must be EXCLUDENT to each other
// this program starts matching the highest scores

function findBestScore() {

    const scores = Object.values(BOARD).sort(function (a, b) { return b - a })
        
    const scoreBoard = { }

    const keys = Object.keys(BOARD)

    for (const key of keys) {
    
        const score = BOARD[key]
        
        if (scoreBoard[score] == undefined) { scoreBoard[score] = [ ] } 
         
        scoreBoard[score].push(parseInt(key))
    }

    return findBestScore2(scores, scoreBoard)
}

function findBestScore2(scores, scoreBoard) {

    for (let a = 0; a < scores.length - 1; a++) {
    
        const scoreA = scores[a]

        const visitedsA = scoreBoard[scoreA]            

        for (let b = a; b < scores.length; b++) {
        
            const scoreB = scores[b]

            const visitedsB = scoreBoard[scoreB]
            
            if (areExcludents(visitedsA, visitedsB)) { return scoreA + scoreB }
        }
    }
}
        
function areExcludents(visitedsA, visitedsB) { 

    for (const visitedA of visitedsA) {
    
        for (const visitedB of visitedsB) {
        
            if ((visitedA & visitedB) == 0) { return true }
        }
    }
    
    return false
}

///////////////////////////////////////////////////////////

main()

