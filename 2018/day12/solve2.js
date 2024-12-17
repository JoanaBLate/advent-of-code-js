"use strict"

// solving the puzzle takes (my computer) 0.030s


// since the first generation, the plants tend to move to the right,
// and their distribution becomes more and more regular, till the 
// point where the difference between parent and child is just 
// a displacement of one step to the right

const rules = { }

const LEFT_PAD = 3
const RIGHT_PAD = 200 // it is enough for this specific current input!!!

var initialState = ""

function main() {

    processInput()
    
    let generationNumber = 0
    
    let generation = initialState
    
    while (true) {
    
        const previous = generation 
        
        generation = generate(generation)
        
        generationNumber += 1
        
        if (previous == generation.substr(1) + ".") { break }
    }
     
    const deltaFutureGenerations = 50000 * 1000 * 1000 - generationNumber    
    
    console.log("the answer is", countPlants(generation, deltaFutureGenerations))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    const core = lines.shift().trim().replace("initial state: ", "")
    
    const leftPad  = (".").repeat(LEFT_PAD)
    
    const rightPad = (".").repeat(RIGHT_PAD)
    
    initialState = leftPad + core + rightPad
    
    lines.shift() // blank
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" => ")
        
        rules[tokens.shift()] = tokens.shift()
    }
}

function generate(parent) {
    
    const child = ".".repeat(parent.length).split("")
    
    for (let index = 2; index < child.length - 2; index++) {
    
        const rule = parent.substr(index - 2, 5)
        
        child[index] = rules[rule]  ||  "."  
    }

    return child.join("")
}

function countPlants(generation, deltaFutureGenerations) {

    let result = 0

    for (let index = 0; index < generation.length; index++) {
        
        if (generation[index] == "#") { result += index - LEFT_PAD + deltaFutureGenerations }
    }
    return result
}

main()

