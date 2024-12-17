"use strict"

// solving the puzzle using *recursive functions* takes (my computer) 0.85s

const cities = [ ]

const distances = { }

var shortestDistance = 999999999


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")    
    
    for (const rawLine of rawLines) { fillData(cities, distances, rawLine.trim()) }
    
    for (const city of cities) { travel([city]) }        
    
    console.log("shortest distance is", shortestDistance)
}

function fillData(cities, distances, line) {
    
    const tokens = line.trim().split(" ")
    
    const cityA = tokens.shift()
    
    tokens.shift() // 'to'
    
    const cityB = tokens.shift()
    
    tokens.shift() // '='
    
    const distance = parseInt(tokens.shift())
    
    if (! cities.includes(cityA)) { cities.push(cityA) }
    if (! cities.includes(cityB)) { cities.push(cityB) }
    
    distances[cityA + "~" + cityB] = distance
    distances[cityB + "~" + cityA] = distance
}

function travel(journey) { 

    // this is a recursive function (calls itself)
    // we don't need a struture for storing data of the journeys,
    // because this function (and its many clones) store them as arguments

    if (journey.length == cities.length) { tryAsWinner(journey); return }

    for (const city of cities) {
    
        if (journey.includes(city)) { continue }
        
        const newJourney = journey.slice() // cloning avoids one journey messing with other
        
        newJourney.push(city)
        
        travel(newJourney)
    }
}

function tryAsWinner(journey) {

    let distance = 0 
    
    while (journey.length > 1) {
    
        const trip = journey[0] + "~" + journey[1]
        
        distance += distances[trip]
        
        journey.shift()
    }
    
    if (distance < shortestDistance) { shortestDistance = distance }
}

main()

