"use strict"

// solving the puzzle takes (my computer) 0.330s

import md5 from "npm:md5"

var salt = ""

const hashes = [ ]

function main() {

    salt = Deno.readTextFileSync("input.txt").trim()
  
    let numberOfKeys = 0
    
    let index = -1
        
    while (true) {
        
        index += 1
                
        const baseHash = getHash(index)

        const character = findFirstTriplet(baseHash)
        
        if (character == "") { continue }
        
        const target = character.repeat(5)
        
        for (let i = 1; i <= 1000; i++) { 
        
            const thisIndex = index + i
            
            const hash = getHash(thisIndex)
        
            if (! hash.includes(target)) { continue }
        
            numberOfKeys += 1
            
            console.log(index, numberOfKeys, hash)
            
            if (numberOfKeys == 64) { console.log("the index is", index); return }
            
            break
        }
    }    
}

function getHash(index) {
                
    if (index > hashes.length - 1) { hashes.push(md5(salt + index)) }
    
    return hashes[index]
}       

function findFirstTriplet(hash) {

    const off = hash.length - 2
    
    for (let i = 0; i < off; i++) {
    
        if (hash[i] == hash[i+1]  &&  hash[i] == hash[i+2]) { return hash[i] }
    }
    
    return ""
}

main()

