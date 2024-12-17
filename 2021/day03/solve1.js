"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    const counter = new Uint32Array(DATA[0].length)
    
    for (const data of DATA) {
    
        for (let n = 0; n < data.length; n++) {
        
            if (data[n] == "1") { counter[n] += 1 }
        }    
    }
    
    const half = DATA.length / 2
    
    let gamma = ""
    let epsilon = ""
    
    for (let n = 0; n < counter.length; n++) {
    
        const count = counter[n]
        
        if (count > half) { gamma += "1"; epsilon += "0" } else { gamma += "0"; epsilon += "1" } 
    }
    
    const gammaInt = parseInt(gamma, 2)
    const epsilonInt = parseInt(epsilon, 2)
    
    console.log("the answer is", gammaInt * epsilonInt)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

main()

