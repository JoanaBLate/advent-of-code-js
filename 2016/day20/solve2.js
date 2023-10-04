"use strict"

// solving the puzzle takes (my computer) TODO


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const dict = [ ]
    
    const rawLines = rawText.trim().split("\n")
    
    for (let rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split("-")
    
        const first = parseInt(tokens.shift())
        const last  = parseInt(tokens.shift())
        
        dict["" + first] = { first, last }
    }
     
    const keys = Object.keys(dict)
    
    keys.sort(function (a, b) { return parseInt(a) - parseInt(b) })
   
    const blockeds = [ ]
    
    let previous = null
    
    for (const key of keys) {
    
        const current = dict["" + key]
        
        if (previous == null) { blockeds.push(current); previous = current; continue }
     
        if (current.first > previous.last) { blockeds.push(current); previous = current; continue }
        
        previous.last = Math.max(previous.last, current.last) // forget current
     }
        
    let count = 0 // allowed IPs    

    let lowestValued = 0
    
    for (const blocked of blockeds) {

        if (blocked.first <= lowestValued) { lowestValued = blocked.last + 1; continue }
        
        count += blocked.first - lowestValued
        
        lowestValued = blocked.last + 1
    }       

    console.log("number of allowed IPs is", count)
}

main()


