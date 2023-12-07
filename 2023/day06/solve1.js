"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]

const mapSeedToSoil = [ ]

const mapSoilToFertil = [ ]

const mapFertilToWater = [ ]

const mapWaterToLight = [ ]

const mapLightToTemper = [ ]

const mapTemperToHumidity = [ ]

const mapHumidityToLocation = [ ]


function main() {

    processInput()
    
    for (const data of DATA) { matchSeedToSoil(data) }
    for (const data of DATA) { matchSoilToFertil(data) }
    for (const data of DATA) { matchFertilToWater(data) }
    for (const data of DATA) { matchWaterToLight(data) }
    for (const data of DATA) { matchLightToTemper(data) }
    for (const data of DATA) { matchTemperToHumidity(data) }
    for (const data of DATA) { matchHumidityToLocation(data) }
    
    let best = DATA[0].location
    
    for (const data of DATA) { if (data.location < best) { best = data.location } }
    
    console.log("the answer is", best)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")
    
    const stringSeeds = parts.shift().split(":").pop().trim().split(" ")
    
    const stringSeedToSoil = parts.shift().split(":").pop().trim().split("\n")
    
    const stringSoilToFertil = parts.shift().split(":").pop().trim().split("\n")
    
    const stringFertilToWater = parts.shift().split(":").pop().trim().split("\n")
    
    const stringWaterToLight = parts.shift().split(":").pop().trim().split("\n")
    
    const stringLightToTemper = parts.shift().split(":").pop().trim().split("\n")
    
    const stringTemperToHumidity = parts.shift().split(":").pop().trim().split("\n")
    
    const stringUmidityToLocation = parts.shift().split(":").pop().trim().split("\n")
    
    for (const token of stringSeeds) { DATA.push(createSeed(token)) }
        
    fillMap(mapSeedToSoil, stringSeedToSoil)

    fillMap(mapSoilToFertil, stringSoilToFertil)

    fillMap(mapFertilToWater, stringFertilToWater)

    fillMap(mapWaterToLight, stringWaterToLight)

    fillMap(mapLightToTemper, stringLightToTemper)

    fillMap(mapTemperToHumidity, stringTemperToHumidity)

    fillMap(mapHumidityToLocation, stringUmidityToLocation)
}

function createSeed(token) {

    return { "seed": parseInt(token), "soil": 0, "fertil": 0, "water": 0, "light": 0, "temper": 0, "humidity": 0, "location": 0 }
}

function fillMap(map, lines) {

    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const register = [ ]
        
        for (const token of tokens) { register.push(parseInt(token)) }
        
        map.push(register)        
    }
}

///////////////////////////////////////////////////////////
    
function findMatch(target, map) {
    
    for (const line of map) {
    
        const firstDestiny = line[0]
        const firstSource = line[1]
        const range = line[2]
        
        const lastSource = firstSource + range - 1
        
        if (target < firstSource) { continue }
        
        if (target > lastSource) { continue }
        
        const delta = firstDestiny - firstSource

        return target + delta
    }
     
    return target // lack of data means to match itself
}

function matchSeedToSoil(data) {

    data["soil"] = findMatch(data.seed,  mapSeedToSoil)
}

function matchSoilToFertil(data) {

    data["fertil"] = findMatch(data.soil,  mapSoilToFertil)
}

function matchFertilToWater(data) {

    data["water"] = findMatch(data.fertil, mapFertilToWater)
}

function matchWaterToLight(data) {

    data["light"] = findMatch(data.water, mapWaterToLight)
}

function matchLightToTemper(data) {

    data["temper"] = findMatch(data.light, mapLightToTemper)
}

function matchTemperToHumidity(data) {

    data["humidity"] = findMatch(data.temper, mapTemperToHumidity)
}

function matchHumidityToLocation(data) {

    data["location"] = findMatch(data.humidity, mapHumidityToLocation)
}

main()

