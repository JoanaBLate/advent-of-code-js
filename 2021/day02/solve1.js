"use strict"

// solving the puzzle takes (my computer) 0.030s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let depth = 0
    
    let x = 0
    
    for (const data of DATA) {
    
        if (data.kind == "forward") { x += data.amount; continue }
        
        if (data.kind == "up")   { depth -= data.amount; continue }
        
        if (data.kind == "down") { depth += data.amount; continue }    
    }
    
    console.log("the answer is", x * depth)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
    
        const kind = tokens.shift()
        
        const amount = parseInt(tokens.shift())
        
        DATA.push({ "kind": kind, "amount": amount } ) 
    }
}

main()

