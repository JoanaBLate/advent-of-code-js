"use strict"

// solving the puzzle takes (my computer) 1.4s


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const deltas = [ ]
        
    for (const line of input.split("\n")) {
    
        const delta = parseInt(line.trim())
        deltas.push(delta)
    }
    
    let frequency = 0
    
    const frequencies = [ 0 ]

    let index = -1 
    
    while (true) {
        
        index += 1
        if (index >= deltas.length) { index = 0 }
        
        const delta = deltas[index]
        
        frequency += delta
        
        if (frequencies.includes(frequency)) { break }
        
        frequencies.push(frequency)
    }

    console.log("the answer is", frequency)
}

main()
