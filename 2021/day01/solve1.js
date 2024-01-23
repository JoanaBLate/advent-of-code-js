"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let count = 0
    
    for (let n = 1; n < DATA.length; n++) {
    
        if (DATA[n] > DATA[n - 1]) { count += 1 }    
    }
    
    console.log("the answer is", count)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

main()

