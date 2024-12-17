"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = { } // id: obj


function main() {

    processInput()
    
    let children = DATA["COM"].children
    
    let numberOfAncestors = 0
    
    while (true) {
        
        numberOfAncestors += 1
    
        const parents = children
        
        if (parents.length == 0) { break }

        children = [ ]
        
        for (const parent of parents) {
        
            const obj = DATA[parent]

            obj.numberOfAncestors = numberOfAncestors
            
            for (const child of obj.children) { children.push(child) }
        }    
    }
     
    let total = 0
    
    for (const obj of Object.values(DATA)) { total += obj.numberOfAncestors }     
     
    console.log("the answer is", total)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(")")
        
        const astro = tokens.shift()
        const satellite = tokens.shift()
        
        if (DATA[astro] == undefined) { DATA[astro] = createAstro() }
        
        DATA[astro].children.push(satellite)
        
        if (DATA[satellite] == undefined) { DATA[satellite] = createAstro() }
    }        
}

function createAstro() {

    return { "numberOfAncestors": 0, "children": [ ] }
}

main()

