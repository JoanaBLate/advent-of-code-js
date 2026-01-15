// solution for https://adventofcode.com/2025/day/12 part 1

"use strict"

const input = Deno.readTextFileSync("day12-input.txt").trim()

const DENSITIES = [ ]

function main() {
    
    const rawLines = input.split("\n")
    
    for (let index = 0; index < 6; index++) {
    
        rawLines.shift() // header
        
        let density = 0
        
        for (const char of rawLines.shift()) { if (char == "#") { density += 1 } }
        for (const char of rawLines.shift()) { if (char == "#") { density += 1 } }
        for (const char of rawLines.shift()) { if (char == "#") { density += 1 } }
        
        DENSITIES.push(density)
    
        rawLines.shift() // blank line
    }  
    
    let goodTrees = 0
       
    for (const rawLine of rawLines) { if (treeIsGood(rawLine)) { goodTrees += 1 } } 
    
    console.log("the answer is ", goodTrees)
}  

// trees //////////////////////////////////////////////////////////////////////

function treeIsGood(rawLine) {

    const segments = rawLine.split(":")
    
    const rawDimensions = segments.shift().split("x")
    
    const width  = parseInt(rawDimensions.shift())
    const height = parseInt(rawDimensions.shift())
    
    const slots = [ ]
    
    const tokens = segments.shift().trim().split(" ")
    
    for (const token of tokens) { slots.push(parseInt(token)) }
    
    return treeIsGood2(width, height, slots)
}

function treeIsGood2(width, height, slots) {
    
    const availableArea = width * height
    
    let tightPlacing = 0
    
    let loosePlacing = 0
    
    for (let index = 0; index < DENSITIES.length; index++) {
    
        tightPlacing += slots[index] * DENSITIES[index] 
        
        loosePlacing += slots[index] * 9
    } 
    
    if (availableArea < tightPlacing) { return 0 }
    
    if (availableArea >= loosePlacing) { return 1 }

    console.log("ERROR: not expecting a complicated input"); Deno.exit()
}

console.time("execution time")
main()
console.timeEnd("execution time") // 3ms


