"use strict"

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const lines = rawText.split("\n")
    
    var total = 0 // total necessary wrapping paper
    
    for (const line of lines) { // each line represents a box
    
        const tokens = line.trim().split("x")
        
        const l = parseInt(tokens.shift()) // length
        const w = parseInt(tokens.shift()) // width
        const h = parseInt(tokens.shift()) // height
        
        // surfaces:
        const front = h * w
        const side  = h * l
        const top   = w * l

        const smallest = Math.min(front, side, top) 
        
        const wrapPaper = 2 * (front + side + top) + smallest  
        
        total += wrapPaper  
    }
        
    console.log("total wrapping paper is", total)
}

main()

