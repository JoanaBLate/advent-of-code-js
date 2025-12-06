// solution for https://adventofcode.com/2025/day/5 part 2

"use strict"

const input = Deno.readTextFileSync("day05-input.txt").trim()

const allRanges = [ ]

function main() {

    const rawParts = input.split("\n\n")
    
    const freshPart = rawParts.shift().trim()
    
    const availablePart = rawParts.shift().trim()
    
    //
    
    const freshPartLines = freshPart.split("\n")
    
    for (const rawLine of freshPartLines) { 
    
        const rangeObj = createRangeFromText(rawLine.trim()) 
        
        allRanges.push(rangeObj)
        
    }
    
    while (consolidateRanges()) { }
    
    let counter = 0
    
    for (const range of allRanges) { counter += range.end - range.begin + 1 }
    
    console.log("the answer is", counter)
}

function createRangeFromText(text) {

    const tokens = text.split("-")
    
    const begin = parseInt(tokens.shift())
    const end = parseInt(tokens.shift())
    
    return { "begin": begin, "end": end }
}

function consolidateRanges() {
    
    let changed = false
    
    let index = -1
    
    while (true) {
    
        index += 1
        
        if (index > allRanges.length - 1) { break }
        
        if (consolidateRange(index)) { changed = true }
    }
    
    return changed
}

function consolidateRange(masterIndex) {

    let changed = false

    const master = allRanges[masterIndex] 

    let candidateIndex = masterIndex // must NOT start before masterIndex!
    
    while (true) {
    
        candidateIndex += 1
        
        if (candidateIndex > allRanges.length - 1) { break }

        const candidate = allRanges[candidateIndex]
        
        // master is to the left without contact
        if (master.end < candidate.begin - 1) { continue } 
         
        // master is to the right without contact 
        if (master.begin > candidate.end + 1) { continue } 
        
        //
        
        allRanges.splice(candidateIndex, 1)
        
        changed = true
        
        // they overlap or are just neighbors:
        
        if (candidate.begin < master.begin) { master.begin = candidate.begin }
        
        if (candidate.end > master.end) { master.end = candidate.end }
    }

    return changed
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

