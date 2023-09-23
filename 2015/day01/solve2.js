"use strict"

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    let floor = 0
    
    let position = 0
    
    for (const c of data) { 
        
        position += 1
    
        if (c == "(") { floor += 1 } else { floor -= 1 }
        
        if (floor == -1) { break }
    }
    
    console.log("position is", position)
}

main()
