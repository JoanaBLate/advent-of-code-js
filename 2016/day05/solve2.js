"use strict"

// solving the puzzle takes (my computer) 1m49s

import md5 from "npm:md5"

function main() {

    const doorId = Deno.readTextFileSync("input.txt").trim()
    
    console.log("the password is", findPassword(doorId))
}

function findPassword(secretKey) {    

    const password = [ null, null, null, null, null, null, null, null ]
    
    let n = -1
    
    while (true) {
    
        n += 1
        
        const hashed = md5(secretKey + n)
        
        if (! hashed.startsWith("00000")) { continue }
        
        const position = hashed[5]
        const character = hashed[6]       
        
        if (position > "7") { continue }
        
        const index = parseInt(position)
        
        if (password[index] != null) { continue } // don't override
        
        password[index] = character
            
        if (! password.includes(null)) { return password.join("") }
    }
}

main()

