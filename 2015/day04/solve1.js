"use strict"

// solving the puzzle takes (my computer) 0.890s

import md5 from "npm:md5"

function main() {

    const secretKey = Deno.readTextFileSync("input.txt").trim()
    
    let n = -1
    
    while (true) {
        
        n += 1
        
        const hashed = md5(secretKey + n)
        
        if (hashed.startsWith("00000")) { break }
    }
    
    console.log("the lowest positive number is", n)
}

main()

