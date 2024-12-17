"use strict"

// solving the puzzle takes (my computer) 0.030s

const TIME = 2503

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    let bestDistance = 0
    
    for (const rawLine of rawLines) {
    
        const s = rawLine.trim().
              replace("can fly ", "").
              replace("km/s for ", "").
              replace("seconds, but then must rest for ", "").
              replace(" seconds.", "")
              
        const tokens = s.split(" ")

        const reindeer = tokens.shift()
        const speed = parseInt(tokens.shift())
        const flying = parseInt(tokens.shift())
        const resting = parseInt(tokens.shift())

        const distance = calcDistance(speed, flying, resting, TIME)

        if (distance > bestDistance) { bestDistance = distance }
    }
    
    console.log("best distance is", bestDistance)
}

function calcDistance(speed, flying, resting, seconds) { 
    
    const kitTime = flying + resting
    
    const kits = Math.floor(seconds / kitTime)

    let distance = kits * flying * speed
    
    const remainingTime = seconds % kitTime
    
    const lastFlightDuration = Math.min(flying, remainingTime)
    
    distance += lastFlightDuration * speed
    
    return distance
}

main()

