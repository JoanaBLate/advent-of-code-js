"use strict"

// solving the puzzle takes (my computer) 0.028s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const target = parseInt(rawText)
    
    let x = 1
    let y = 0
    let n = 2
    
    // absolute values
    let maxNorth = 0
    let maxSouth = 0
    let maxWest  = 0
    let maxEast  = 1
    
    let status = "going-north"
        
    while (true) {

        n += 1        
        
        if (n == target + 1) { break } // because n increases before walk

        if (status == "going-north") {
        
            y -= 1
        
            if (Math.abs(y) > maxNorth) { maxNorth += 1; status = "going-west" }
            
            continue
        }
        
        if (status == "going-west") {
        
            x -= 1
        
            if (Math.abs(x) > maxWest) { maxWest += 1; status = "going-south" }
            
            continue
        }
        
        if (status == "going-south") {
        
            y += 1
        
            if (Math.abs(y) > maxSouth) { maxSouth += 1; status = "going-east" }
            
            continue
        }
        
        if (status == "going-east") {
        
             x += 1
        
            if (Math.abs(x) > maxEast) { maxEast += 1; status = "going-north" }
            
            continue
        }
    }    

    console.log("number of required steps is", Math.abs(x) + Math.abs(y))
}

main()

