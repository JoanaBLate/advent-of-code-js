"use strict"

// solving the puzzle takes (my computer) 1.2s

import { createHash } from "https://deno.land/std@0.91.0/hash/mod.ts"

function main() {

    const secretKey = Deno.readTextFileSync("input.txt").trim()
    
    let n = -1
    
    while (true) {
        
        n += 1
        
        const hash = createHash("md5")
    
        const candidate = secretKey + n.toString()
    
        hash.update(candidate)
    
        const hashed = hash.toString()
        
        if (hashed.startsWith("00000")) { break }
    }
    
    console.log("the lowest positive number is", n)
}

main()

