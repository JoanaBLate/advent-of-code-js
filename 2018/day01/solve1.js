"use strict"

// solving the puzzle takes (my computer) 0.020s


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    let count = 0
        
    for (const line of input.split("\n")) {
    
        count += parseInt(line.trim())
    }

    console.log("the answer is", count)
}

main()
