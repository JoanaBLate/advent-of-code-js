"use strict"

// solving the puzzle takes (my computer) 0.033s

const TIME = 2503

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    const data = [ ]
    
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

        const obj = { "speed": speed, "flying": flying, "resting": resting, "distance": 0, "points": 0 }

        data.push(obj)
    }
    
    for (var seconds = 1; seconds <= TIME; seconds++) { update(data, seconds) } // we calculate AFTER each second

    let best = 0
    
    for (const item of data) {

        if (item.points > best) { best = item.points }
    }

    console.log("winning reindeer points is", best)
}

function update(data, seconds) {

    var bestDistance = 0

    for (const info of data) {

        const distance = calcDistance(info.speed, info.flying, info.resting, seconds)
        
        info.distance = distance
    
        if (distance > bestDistance) { bestDistance = distance }
    }

    for (const info of data) {

        if (info.distance == bestDistance) { info.points += 1 }
    }
}

function calcDistance(speed, flying, resting, seconds) {  // always calculates from the beginning
    
    const kitTime = flying + resting
    
    const kits = Math.floor(seconds / kitTime)

    let distance = kits * flying * speed
    
    const remainingTime = seconds % kitTime
    
    const lastFlightDuration = Math.min(flying, remainingTime)
    
    distance += lastFlightDuration * speed
    
    return distance
}

main()

