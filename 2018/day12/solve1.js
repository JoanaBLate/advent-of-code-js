"use strict"

// solving the puzzle takes (my computer) 0.030s

const rules = { }

const EXTRA = 20

var generation = ""


function main() {

    processInput()
    
    for (let n = 0; n < 20; n++) { generate() }
     
    console.log("the answer is", countPlants())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    const core = lines.shift().trim().replace("initial state: ", "")
    
    const extra = ".".repeat(EXTRA)
    
    generation = extra + core + extra
    
    lines.shift() // blank
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" => ")
        
        rules[tokens.shift()] = tokens.shift()
    }
}

function generate() {

    const parent = generation
    
    const child = ".".repeat(parent.length).split("")
    
    for (let index = 2; index < child.length - 2; index++) {
    
        const left2  = parent[index-2]
        const left1  = parent[index-1]
        const center = parent[index] 
        const right1 = parent[index+1]
        const right2 = parent[index+2]
    
        const rule = left2 + left1 + center + right1 + right2
        
        const plant = rules[rule] == "#"
    
        if (plant) { child[index] = "#" }   
    }

    generation = child.join("")
}

function countPlants() {

    let result = 0

    for (let index = 0; index < generation.length; index++) {
        
        if (generation[index] == "#") { result += index - EXTRA }
    }
    return result
}

main()

