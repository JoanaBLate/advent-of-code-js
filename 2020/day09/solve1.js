"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    const off = DATA.length
    
    for (let n = 25; n < off; n++) {
     
        if (! isOk(n)) { console.log("the answer is", DATA[n]); return }
    }
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

function isOk(index) {

    const target = DATA[index]
    
    const base = index - 25
    
    for (let indexA = 0; indexA < 24; indexA++) { // when indexA == 24, indexB == 25
    
        const a = DATA[base + indexA]
        
        for (let indexB = indexA + 1; indexB < 25; indexB++) {
        
            const b = DATA[base + indexB]
        
            if (a + b == target) { return true }
        }
    }
    return false
}

main()

