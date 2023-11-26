"use strict"

// solving the puzzle takes (my computer) 0.025s

var timestamp = 0

const busses = [ ]


function main() {

    processInput()
    
    let bestBus = busses[0]
    
    let bestDeparture = calcDeparture(busses[0])
    
    for (const bus of busses) {
    
        const departure = calcDeparture(bus)
        
        if (departure < bestDeparture) { bestDeparture = departure; bestBus = bus }    
    }
    
    const waiting = bestDeparture - timestamp
     
    console.log("the answer is", bestBus * waiting)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    timestamp = parseInt(lines.shift())
    
    const tokens = lines.shift().trim().split(",")
    
    for (const token of tokens) { 
    
        if (token != "x") { busses.push(parseInt(token)) }
    }
}

function calcDeparture(bus) {

    return bus * Math.ceil(timestamp / bus)
}

main()

