"use strict"

// solving the puzzle takes (my computer) 1m35s

import { createHash } from "https://deno.land/std@0.91.0/hash/mod.ts"


function main() {

    const doorId = Deno.readTextFileSync("input.txt").trim()
    
    console.log("the password is", findPassword(doorId))
}

function findPassword(secretKey) {    

    let password = ""

    let n = -1
    
    while (true) {
    
        n += 1
        
        const hashed = makeHashString(secretKey + n)
        
        if (hashed.startsWith("00000")) { 
        
            password += hashed[5]
            
            if (password.length == 8) { return password }
        }
    }
}

function makeHashString(secretKey) {

    const hash = createHash("md5")

    hash.update(secretKey)

    return hash.toString()
}

main()

