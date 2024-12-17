"use strict"

// solving the puzzle takes (my computer) 3m30s

import md5 from "npm:md5"


const strecheds = new Array(50 * 1000)

function main() {

    const salt = Deno.readTextFileSync("input.txt").trim()
      
    strecheds.fill(null)
      
    let numberOfKeys = 0
    
    let index = -1
        
    while (true) {
        
        index += 1
                
        const hashKey = getStreched(salt, index)       

        const char = findFirstTriplet(hashKey)
        
        if (char == "") { continue }
        
        const target = char.repeat(5)
        
        for (let i = 1; i <= 1000; i++) { 
        
            const thisIndex = index + i
            
            const streched = getStreched(salt, thisIndex)
        
            if (! streched.includes(target)) { continue }
            
            numberOfKeys += 1
            
            console.log(numberOfKeys, hashKey, index)
            
            if (numberOfKeys == 64) { console.log("the index is", index); return }
            
            break
        }
    }    
}

function getStreched(salt, index) {

    if (strecheds[index] == null) { strecheds[index] = createStreched(salt + index) }
    
    return strecheds[index]
}

function createStreched(source) {
    
    let hash = md5(source) // 1 turn
    
    for (let n = 0; n < 2016; n++) { hash = md5(hash) } // 2015 turns
    
    return hash
}

function findFirstTriplet(string) {

    const off = string.length - 2
    
    for (let i = 0; i < off; i++) {
    
        const c = string[i]
        
        if (c != string[i+1]) { continue }
        if (c != string[i+2]) { continue }
        
        return c
    }
    
    return ""
}

main()

