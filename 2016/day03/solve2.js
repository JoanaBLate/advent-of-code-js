"use strict"

// solving the puzzle takes (my computer) 0.028s

var amount = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    if (rawLines.length % 3 != 0) { console.log("Aborting due to input error: total lines is not multiple of 3"); Deno.exit() }
    
    const data = [ ]
    
    for (const rawLine of rawLines) {
    
        const tokens = rawLine.trim().split(" ")
        
        const a = parseInt(tokens.shift())

        while (tokens[0] == "") { tokens.shift() }
        
        const b = parseInt(tokens.shift())
        
        while (tokens[0] == "") { tokens.shift() }
        
        const c = parseInt(tokens.shift())
        
        data.push(a)
        data.push(b)
        data.push(c)
    }
    
    while (data.length != 0) {
    
        const a = data.shift()
        const b = data.shift()
        const c = data.shift()
        
        const d = data.shift()
        const e = data.shift()
        const f = data.shift()
        
        const g = data.shift()
        const h = data.shift()
        const i = data.shift()
        
        tryTriangle(a, d, g)
        tryTriangle(b, e, h)
        tryTriangle(c, f, i)
    }
    
    console.log("amount of triangles is", amount)
}

function tryTriangle(a, b, c) {

    if (a >= b + c) { return }

    if (b >= a + c) { return }

    if (c >= a + b) { return }
        
    amount += 1
}

main()

