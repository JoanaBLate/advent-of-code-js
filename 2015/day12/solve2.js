"use strict"

// solving the puzzle takes (my computer) 0.025 s

var total = 0

function main() {

    const source = Deno.readTextFileSync("input.txt").trim()
    
    const json = JSON.parse(source)
    
    processThis(json)

    console.log("total is", total)
}

function processThis(thing) { // recursive function

    if (typeof thing == "number") { total += thing }
    
    if (typeof thing != "object") { return }
    
    if (Array.isArray(thing)) { 
        
        for (const item of thing) { processThis(item) }
        
        return
    }
    
    const values = Object.values(thing)    
    if (values.includes("red")) { return }

    const keys = Object.keys(thing)    
    for (const key of keys) { processThis(thing[key]) }
}

main()

