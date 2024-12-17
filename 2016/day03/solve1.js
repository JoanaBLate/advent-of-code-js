"use strict"

// solving the puzzle takes (my computer) 0.025s

var amount = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) {
    
        const tokens = rawLine.trim().split(" ")
        
        const a = parseInt(tokens.shift())

        while (tokens[0] == "") { tokens.shift() }
        
        const b = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
        
        const c = parseInt(tokens.shift())
        
    
        if (a >= b + c) { continue }
    
        if (b >= a + c) { continue }
    
        if (c >= a + b) { continue }
        
        amount += 1
    }
    
    console.log("amount of triangles is", amount)
}

main()

