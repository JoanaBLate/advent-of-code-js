"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    if (! DATA.includes(0)) { DATA.push(0) }
    
    DATA.sort(function (a, b) { return a - b })
    
    const last = DATA.at(-1)
    
    DATA.push(last + 3)
        
    let delta1 = 0
    let delta2 = 0
    let delta3 = 0
    
    const off = DATA.length
    
    for (let n = 1; n < off; n++) {
    
        const delta = DATA[n] - DATA[n-1]
        
        if (delta == 1) { delta1 += 1; continue }
        if (delta == 2) { delta2 += 1; continue }
        if (delta == 3) { delta3 += 1; continue }
    
        console.log("delta is too big:", delta)
    }
     
    console.log("the answer is", delta1 * delta3)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
           
    const lines = input.trim().split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}


main()

