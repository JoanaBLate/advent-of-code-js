"use strict"

// solving the puzzle takes (my computer) 0.025s

const allBags = { }


function main() {

    processInput()
    
    let count = 0
    
    let futureNodes = [ { "amount": 1, "color": "shiny gold" } ]
    
    while (futureNodes.length > 0) {
    
        const currentNodes = futureNodes
        
        futureNodes = [ ]
        
        for (const node of currentNodes) {
        
            const factor = node.amount
                       
            const children = allBags[node.color]
            
            for (const child of children) { 
            
                const amount = factor * child.amount
                
                count += amount
                
                const futureNode = { "amount": amount, "color": child.color }
            
                futureNodes.push(futureNode)
            }
        } 
    }     

    console.log("the answer is", count)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const segments = line.trim().split(" bags contain ")
        
        const color = segments.shift()
        
        const remaining = segments.shift().trim()
        
        if (remaining == "no other bags.") { allBags[color] = [ ]; continue }
        
        const tokens = remaining.replace(".", "").split(",")
    
        const children = [ ]
        
        for (const token of tokens) {
        
            const subtokens = token.trim().split(" ")
            
            const amount = parseInt(subtokens.shift())
            
            const childColor = subtokens.shift() + " " + subtokens.shift()
            
            const child = { "amount": amount, "color": childColor }
            
            children.push(child)
        }

        allBags[color] = children
    }
}

main()

