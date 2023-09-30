"use strict"

// solving the puzzle takes (my computer) 38.2s

import md5 from "npm:md5"

function main() {

    const secretKey = Deno.readTextFileSync("input.txt").trim()
    
    let n = -1
    
    while (true) {
        
        n += 1
        
        const hashed = md5(secretKey + n)
        
        if (hashed.startsWith("000000")) { break }
    }
    
    console.log("the lowest positive number is", n)
}

main()

