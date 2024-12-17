"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    const threesomes = [ ]
    
    for (let n = 0; n < DATA.length - 2; n++) {
    
        const threesome = DATA[n] + DATA[n + 1] + DATA[n + 2]
        
        threesomes.push(threesome)
    }
    
    let count = 0    
    
    for (let n = 0; n < threesomes.length; n++) {
    
        if (threesomes[n] > threesomes[n - 1]) { count += 1 }    
    }
    
    console.log("the answer is", count)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

main()

