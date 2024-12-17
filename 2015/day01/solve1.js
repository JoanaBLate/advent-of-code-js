"use strict"

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    let floor = 0
    
    for (const c of data) { 
    
        if (c == "(") { floor += 1 } else { floor -= 1 }
    }
    
    console.log("floor is", floor)
}

main()
