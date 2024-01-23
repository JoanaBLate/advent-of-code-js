"use strict"

// solving the puzzle takes (my computer) 0.030s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let x = 0
    
    let aim = 0
    
    let depth = 0
    
    for (const data of DATA) {
        
        if (data.kind == "up")   { aim -= data.amount; continue }
        
        if (data.kind == "down") { aim += data.amount; continue }    
    
        if (data.kind == "forward") { 
        
            x += data.amount
            
            depth += aim * data.amount
        }
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

