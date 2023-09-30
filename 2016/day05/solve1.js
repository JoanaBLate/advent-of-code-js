"use strict"

// solving the puzzle takes (my computer) 35s

import md5 from "npm:md5"


function main() {

    const doorId = Deno.readTextFileSync("input.txt").trim()
    
    console.log("the password is", findPassword(doorId))
}

function findPassword(secretKey) {    

    let password = ""

    let n = -1
    
    while (true) {
    
        n += 1
        
        const hashed = md5(secretKey + n)
        
        if (hashed.startsWith("00000")) { 
        
            password += hashed[5]
            
            if (password.length == 8) { return password }
        }
    }
}

main()

