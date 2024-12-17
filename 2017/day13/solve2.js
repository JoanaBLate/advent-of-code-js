"use strict"

// solving the puzzle takes (my computer) 0.170s

const layers = { } // depth: range

var maxDepth = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const depth = parseInt(tokens.shift()).toString()
        
        if (depth > maxDepth) { maxDepth = depth }
        
        const range = parseInt(tokens.shift())
        
        layers[depth] = range
    }
        
    let delay = -1
    
    while (true) {
        
        delay += 1
        
        if (isSafeTravel(delay)) { break }
    }        

    console.log("fewest number of picoseconds to delay is", delay)
}

function isSafeTravel(delay) {

    for (let picosec = 0; picosec <= maxDepth; picosec++) {
        
        const range = layers[picosec]
        
        if (range == undefined) { continue }

        const fullCycleTime = 2 * (range - 1)
    
        const time = delay + picosec
        
        if (time % fullCycleTime == 0) { return false }
    }
    
    return true
}

main()

