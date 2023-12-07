"use strict"

// solving the puzzle takes (my computer) 0.037s

const seedRanges = [ ]

const MAPS = [ ]


function main() {

    processInput()
    
    const ranges = search()    
    
    let best = ranges[0].start
    
    for (const range of ranges) { if (range.start < best) { best = range.start } }
    
    console.log("the answer is", best)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const parts = input.split("\n\n")
    
    fillSeedRanges(parts.shift().split(":").pop().trim().split(" "))
    
    while (true) {
    
        const part = parts.shift()
        
        if (part == undefined) { break }
        
        const lines = part.split(":").pop().trim().split("\n")
        
        MAPS.push(createMap(lines))
    }
}

function fillSeedRanges(tokens) {

    while (tokens.length != 0) {
    
        const start = parseInt(tokens.shift())
        
        const length = parseInt(tokens.shift())
        
        const end = start + length - 1
    
        seedRanges.push(createRangeObj(start, end))
    }
}

function createMap(lines) {

    const map = [ ]
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const destinyStart = parseInt(tokens.shift())
        
        const sourceStart = parseInt(tokens.shift())
        
        const length = parseInt(tokens.shift())
        
        const destinyEnd = destinyStart + length - 1
        
        const sourceEnd = sourceStart + length - 1
        
        const delta = destinyStart - sourceStart
        
        map.push(createMapObj(sourceStart, sourceEnd, destinyStart, destinyEnd, delta))      
    }
    return map
}

function createRangeObj(start, end) {

    return { "start": start, "end": end }
}

function createMapObj(sourceStart, sourceEnd, destinyStart, destinyEnd, delta) {

    return { 
        "source": createRangeObj(sourceStart, sourceEnd),
        "destiny": createRangeObj(destinyStart, destinyEnd),
        "delta": delta 
    }
}

///////////////////////////////////////////////////////////

function search() {

    let ranges = seedRanges
    
    for (const map of MAPS) { ranges = searchThis(ranges, map) }
    
    return ranges
}

function searchThis(oldRanges, map) {

    const newRanges = [ ]

    for (const oldRange of oldRanges) {
    
        const doneRanges = [ ]
    
        for (const mapObj of map) {
    
            const start = Math.max(oldRange.start, mapObj.source.start)
            
            const end = Math.min(oldRange.end, mapObj.source.end)
            
            if (start > end) { continue }
            
            const newRange = createRangeObj(start + mapObj.delta, end + mapObj.delta)

            newRanges.push(newRange)
            
            doneRanges.push(createRangeObj(start, end))
        }
        
        for (const newRange of fillRangeGaps(oldRange, doneRanges)) { newRanges.push(newRange) }
    }
    return newRanges
}

function fillRangeGaps(oldRange, doneRanges) {

    const newRanges = [ ]
    
    sortRanges(doneRanges)
    
    let start = oldRange.start
    
    while (doneRanges.length > 0) {
       
        const doneRange = doneRanges.shift() 
        
        if (start < doneRange.start) {
        
            newRanges.push(createRangeObj(start, doneRange.start - 1))
        }
            
        start = doneRange.end + 1
    }
    
    if (start < oldRange.end) { // closing the right end
    
        newRanges.push(createRangeObj(start, oldRange.end))
    }
   
    return newRanges
}

///////////////////////////////////////////////////////////

function sortRanges(list) {

    let n = -1
    
    while (true) {
    
        n += 1

        const current = list[n]
        const next = list[n + 1]
        
        if (next == undefined) { return }

        if (current.start <= next.start) { continue }

        list[n] = next
        list[n + 1] = current
        
        n = -1
    }     
}

main()

