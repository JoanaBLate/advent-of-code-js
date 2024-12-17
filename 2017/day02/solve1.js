"use strict"

// solving the puzzle takes (my computer) 0.025s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    let sum = 0
    
    for (const rawLine of rawLines) { sum += processRawLine(rawLine) }

    console.log("the checksum is", sum)
}

function processRawLine(rawLine) {
    
    let min = 999999999
    let max = 0
    
    const tokens = rawLine.trim().split("\t") // TAB
    
    for (const token of tokens) {
    
        if (token == "") { continue }
    
        const number = parseInt(token)
        
        if (number < min) { min = number }
        if (number > max) { max = number }
    }
    
    return max - min
}       

main()


