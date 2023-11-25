"use strict"

// solving the puzzle takes (my computer) 0.050s

const allBags = { }


function main() {

    processInput()
     
    const allParents = { }
    
    let futureTargets = [ "shiny gold" ]
    
    while (futureTargets.length > 0) {
    
        const targets = futureTargets
        
        futureTargets = [ ]
        
        for (const target of targets) {
        
            const parents = parentsFor(target)
            
            for (const parent of parents) { allParents[parent] = true; futureTargets.push(parent) }
        }    
    }     
     
    console.log("the answer is", Object.keys(allParents).length)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const segments = line.trim().split(" bags contain ")
        
        const color = segments.shift()
        
        const remaining = segments.shift()
        
        if (remaining == "no other bags.") { allBags[color] = [ ]; continue }
        
        const tokens = remaining.replace(".", "").split(",")
    
        const children = [ ]
        
        for (const token of tokens) {
        
            const subtokens = token.trim().split(" ")
            
            subtokens.shift() // amount 
            
            children.push(subtokens.shift() + " " + subtokens.shift())
        }
        
        allBags[color] = children
    }
}

function parentsFor(target) {

    const parents = [ ]
    
    for (const parent of Object.keys(allBags)) {
    
        const bag = allBags[parent]
        
        if (bag.includes(target)) { parents.push(parent) }    
    }
    return parents
}

main()

