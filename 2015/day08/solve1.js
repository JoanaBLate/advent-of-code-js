"use strict"

// solving the puzzle takes (my computer) 0.026s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    let originalLength = 0
    let inMemoryLength = 0

    for (const rawLine of rawLines) {
        
        const string = rawLine.trim()
        
        const len = string.length
        
        originalLength += len
        
        const core = string.substr(0, len - 1).substr(1) // removing starting and ending quotes
        
        inMemoryLength += getMemoryLength(core)
    }    

    console.log("literals length minus in memory length is", originalLength - inMemoryLength)
}

function getMemoryLength(source) { 

    let len = 0
        
    while (source != "") {
            
        const c = source[0]
        
        source = source.substr(1)
                
        len += 1
        
        if (c != "\\") { continue }
        
        if (source.startsWith("x")) { source = source.substr(3); continue }
        
        source = source.substr(1) 
    }
     
    return len
}

main()

