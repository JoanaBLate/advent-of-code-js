"use strict"

// solving the puzzle takes (my computer) 0.930s


const input = Deno.readTextFileSync("input.txt").trim()

const SCANNERS = [ ]

const ALIGNEDS = [ ]


function main() {

    processInput()

    alignScanners() 
        
    console.log("the answer is", countBeacons())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const groups = input.split("\n\n")
        
    for (const group of groups) {
    
        const lines = group.trim().split("\n")
        
        lines.shift() // --- scanner x ---
        
        const scanner = createScanner(SCANNERS.length)
        
        for (const line of lines) { 
        
            const tokens = line.trim().split(",")
            
            const x = parseInt(tokens.shift())
            const y = parseInt(tokens.shift())
            const z = parseInt(tokens.shift())

            const beacon = createBeacon(x, y, z)
            
            scanner.beacons.push(beacon)
        }
        
        SCANNERS.push(scanner)
    }
}

function createScanner(id) {

    return { "id": id, "beacons": [ ] }
}

function createBeacon(x, y, z) {

    return { "x": x || 0, "y": y || 0, "z": z || 0 }
}

///////////////////////////////////////////////////////////


function alignScanners() {
    
    ALIGNEDS.push(SCANNERS.shift())
    
    for (const reference of ALIGNEDS) { // grows during the loop and DOESN'T repeat old seacrhes
    
        alignScannersWith(reference)
    }
}

function alignScannersWith(reference) {

    const newAligneds = [ ]

    for (const scanner of SCANNERS) {
        
        const success = tryAlignScanner(reference, scanner)
        
        if (success) { newAligneds.push(scanner) }            
    }
    
    while (true) {
    
        const scanner = newAligneds.shift()
        
        if (scanner == undefined) { return }
    
        ALIGNEDS.push(scanner)  
    
        const index = SCANNERS.indexOf(scanner)
        
        SCANNERS.splice(index, 1)
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function tryAlignScanner(reference, scanner) {

    const beaconsA = reference.beacons
    
    const beaconsB = scanner.beacons

    let forbidden = ""

    const adjustX = findAdjust(beaconsA, "x", forbidden, beaconsB) 

    if (adjustX == null) { return false }
    
    forbidden += adjustX.axis
    
    //

    const adjustY = findAdjust(beaconsA, "y", forbidden, beaconsB) 

    if (adjustY == null) { return false }
        
    forbidden += adjustY.axis
    
    //

    const adjustZ = findAdjust(beaconsA, "z", forbidden, beaconsB) 

    if (adjustY == null) { return false }
        
    //
    
    alignScanner(scanner, adjustX, adjustY, adjustZ)    
    
    return true
}
   
///////////////////////////////////////////////////////////  

function findAdjust(beaconsA, axisA, forbidden, beaconsB) {

    for (const axisB of "xyz") {
    
        if (forbidden.includes(axisB)) { continue }
    
        for (const signal of [ +1, -1 ]) {
    
            const offset = tryThisAdjust(beaconsA, axisA, beaconsB, axisB, signal)
            
            if (offset == null) { continue }
                        
            return { "offset": offset, "axis": axisB, "signal": signal }
        }
    }
    
    return null
}

///////////////////////////////////////////////////////////

function tryThisAdjust(beaconsA, axisA, beaconsB, axisB, signal) {

    const deltas = { }
    
    for (const beaconA of beaconsA) {

        for (const beaconB of beaconsB) {
        
            const delta = beaconA[axisA] - (signal * beaconB[axisB])
            
            if (deltas[delta] == undefined) { deltas[delta] = 0 }
            
            deltas[delta] += 1
        }
    }
    
    const keys = Object.keys(deltas).map(function (x) { return parseInt(x) })
    
    let bestKey = keys[0]
    
    let bestCount = deltas[bestKey]
    
    for (const key of keys) {
    
        const count = deltas[key]
        
        if (count <= bestCount) { continue }
        
        bestKey = key
        bestCount = count
    }
    
    if (bestCount < 12) { return null }
    
    return bestKey
} 

///////////////////////////////////////////////////////////

function alignScanner(scanner, adjustX, adjustY, adjustZ) {
    
    for (const beacon of scanner.beacons) {        
        
        const x = adjustX.signal * beacon[adjustX.axis] + adjustX.offset

        const y = adjustY.signal * beacon[adjustY.axis] + adjustY.offset

        const z = adjustZ.signal * beacon[adjustZ.axis] + adjustZ.offset
        
        beacon.x = x
        beacon.y = y
        beacon.z = z        
    }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function countBeacons() {

    const allBeacons = { }
    
    for (const scanner of ALIGNEDS) {
    
        for (const beacon of scanner.beacons) {
        
            const id = beacon.x + "~" + beacon.y + "~" + beacon.z
            
            allBeacons[id] = true
        }
    }

    return Object.keys(allBeacons).length
}

main()

