"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

const FISH = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] // by age


function main() {

    processInput()

    for (let n = 0; n < 256; n++) { finishDay() }  
    
    let sum = 0
    
    for (const fish of FISH) { sum += fish }  
    
    console.log("the answer is", sum)
}

function processInput() {
        
    const strNumbers = input.split(",")
    
    for (const strNumber of strNumbers) { 
    
        const age = parseInt(strNumber)
        
        FISH[age] += 1
    }
}

function finishDay() {

    const babies = FISH[0]
    
    FISH[0] = FISH[1]
    FISH[1] = FISH[2]
    FISH[2] = FISH[3]
    FISH[3] = FISH[4]
    FISH[4] = FISH[5]
    FISH[5] = FISH[6]
    FISH[6] = FISH[7] + babies
    FISH[7] = FISH[8]
    FISH[8] = babies
}

main()

