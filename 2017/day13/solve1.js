"use strict"

// solving the puzzle takes (my computer) 0.030s

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
        
    let severity = 0
    
    for (let picosec = 0; picosec <= maxDepth; picosec++) {
    
        const range = layers[picosec]
        
        if (range == undefined) { continue }
    
        const fullCycleTime = 2 * (range - 1)
        
        if (picosec % fullCycleTime != 0) { continue }
        
        severity += picosec * range
    }        

    console.log("the severity of the whole trip is", severity)
}

main()


