"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const CRT = [ ]

const registerValues = [ 1 ]


function main() {

    processInput()
    
    processInstructions()
    
    createCrt()
    
    fillCrt()
    
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

///////////////////////////////////////////////////////////

function createCrt() {
    
    for (let n = 0; n < 6; n++) {
    
        const line = new Array(40)
        
        line.fill(" ")
        
        CRT.push(line)    
    }
}

function fillCrt() {

    for (let cycle = 1; cycle <= 240; cycle++) {
    
        const index = cycle - 1
        
        const spriteStart = registerValues[index]
        
        const row = Math.floor(index / 40)
        const col = Math.floor(index % 40)
        
        if (Math.abs(col - spriteStart) <= 1) { CRT[row][col] = "#" }
    }
}

main()

