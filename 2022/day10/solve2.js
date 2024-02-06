"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const CRT = [ ]

const registerValues = [ 1, 1 ]


function main() {

    processInput()
    
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
    
    createCrt()
    
    for (let cycle = 1; cycle <= 240; cycle++) {
        
        const spriteStart = registerValues[cycle]
        
        const row = Math.floor((cycle - 1) / 40)
        const col = Math.floor((cycle - 1) % 40)
        
        if (Math.abs(col - spriteStart) <= 1) { CRT[row][col] = "#" }
    }
    
    console.log("the answer is:\n")
    
    for (const line of CRT) { console.log(line.join("")) }
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

function createCrt() {
    
    for (let n = 0; n < 6; n++) {
    
        const line = new Array(40)
        
        line.fill(" ")
        
        CRT.push(line)    
    }
}

main()

