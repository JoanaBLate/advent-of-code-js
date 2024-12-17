"use strict"

// solving the puzzle takes (my computer) 0.030s


const DATA = { } // name: info

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const name = tokens.shift()
        
        const rawWeight = tokens.shift()
        
        const weight = parseInt(rawWeight.replace("(", ""))
        
        tokens.shift() // nothing or ->
        
        const children = [ ]
        
        while (tokens.length > 0) { 
        
            const child = tokens.shift().replace(",", "")
            
            children.push(child)
        }
        
        DATA[name] = { "weight": weight, "children": children, "parent": "", "totalWeight": 0 }        
    }
    
    const names = Object.keys(DATA)
    
    for (const name of names) {
    
        const data = DATA[name]
        
        for (const child of data.children) {

            DATA[child].parent = name        
        }    
    } 
    
    for (const name of names) { 
    
        if (DATA[name].parent == "") { solvePart2(names, name); break }
    }
}

///////////////////////////////////////////////////////////////////////////////

function solvePart2(names, root) {
    
    fillTotalWeight(names)

    const bad = findUnbalanced(root)
    
    const gtw = findGoodTotalWeight(bad)
    
    const delta = gtw - DATA[bad].totalWeight
    
    console.log("weight of the broken program should be", DATA[bad].weight + delta)
}

function findUnbalanced(parent) { // recursive

    const tweights = [ ] // totalWeights

    for (const child of DATA[parent].children) {
    
        tweights.push(DATA[child].totalWeight)    
    }

    tweights.sort(function (a, b) { return a - b })
    
    const a = tweights[0]
    const b = tweights[1] 
    const c = tweights[tweights.length - 1]
    
    if (a == b  &&  a == c) { return parent } // the problem is here

    const unbalanced = a != b ? a : c
    
    let badChild = null
    
    for (const child of DATA[parent].children) {

        if (unbalanced == DATA[child].totalWeight) { badChild = child; break }
    }
    
    return findUnbalanced(badChild)
}
    
function fillTotalWeight(names) { 

    let changed = false

    for (const name of names) {
    
        const data = DATA[name]
        
        if (data.totalWeight != 0) { continue }
            
        if (data.children.length == 0) {
        
            data.totalWeight = data.weight
            
            changed = true
            
            continue
        } 
        
        let sum = 0
        
        for (const child of data.children) {
            
            const tw = DATA[child].totalWeight
            
            if (tw == 0) { sum = 0; break }
            
            sum += tw
        }
        
        if (sum == 0) { continue }
        
        data.totalWeight = data.weight + sum
        
        changed = true 
    }
    
    if (changed) { fillTotalWeight(names) }
}

function findGoodTotalWeight(name) {

    const parent = DATA[name].parent
    
    const siblings = DATA[parent].children
    
    for (const sibling of siblings) {
    
        if (sibling != name) { return DATA[sibling].totalWeight }
    }
}

main()

