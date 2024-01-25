"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let count = 0
    
    for (const data of DATA) {
    
        for (const output of data.outputs) {
        
            if ([2, 3, 4, 7].includes(output.length)) { count += 1 }
        }  
    }
    
    console.log("the answer is", count)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" | ")
        
        const inputs = parts.shift().split(" ")
        
        const outputs = parts.shift().split(" ")
        
        DATA.push({ "inputs": inputs, "outputs": outputs })
    }
}

main()

