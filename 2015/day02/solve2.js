"use strict"

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const lines = rawText.split("\n")
    
    var total = 0 // total necessary ribbon
    
    for (const line of lines) { // each line represents a box
    
        const tokens = line.trim().split("x")
        
        const l = parseInt(tokens.shift()) // length
        const w = parseInt(tokens.shift()) // width
        const h = parseInt(tokens.shift()) // height
        
        // perimeters:
        const a = 2 * (l + w)
        const b = 2 * (l + h)
        const c = 2 * (w + h)

        const perimeter = Math.min(a, b, c)
        
        const volume = l * w * h // for the bow
        
        total += perimeter + volume
    }
        
    console.log("total ribbon is", total)
}

main()

