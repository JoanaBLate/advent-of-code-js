"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const registerValues = [ 1 ]


function main() {

    processInput()
    
    processInstructions()
        
    let result = 0
    
    for (const n of [ 20, 60, 100, 140, 180, 220 ]) { result += n * registerValues[n - 1] }
    
    console.log("the answer is", result)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        let kind = "noop"
        let value = 0
    
        if (! line.startsWith("noop")) {
        
            const tokens = line.trim().split(" ")

            kind = tokens.shift()
            
            value = parseInt(tokens.shift())
        }
        
        DATA.push({ "kind": kind, "value": value })
    }
}

///////////////////////////////////////////////////////////

function processInstructions() {

    for (const data of DATA) {
    
        const last = registerValues.at(-1)
    
        if (data.kind == "noop") { registerValues.push(last); continue }
        
        if (data.kind == "addx") { 
        
            registerValues.push(last)
            registerValues.push(last + data.value)            
            continue 
        }
        console.log("ERROR: unknown command")
    }
}

main()

