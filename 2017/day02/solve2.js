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
    
    const numbers = [ ]
    
    const tokens = rawLine.trim().split("\t") // TAB
    
    for (const token of tokens) {
    
        if (token == "") { continue }
    
        const number = parseInt(token)
        numbers.push(number)
    }
    
    for (const a of numbers) {
    
        for (const b of numbers) {
        
            if (a <= b) { continue }
            
            if (a % b != 0) { continue }
            
            return a / b
        }
    }
}       

main()


