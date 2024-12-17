"use strict"

// solving the puzzle takes (my computer) 0.024s

function main() {

    const source = Deno.readTextFileSync("input.txt").trim()
    
    const length = source.length
    
    const delta = length / 2
        
    let sum = 0
    
    let indexA = -1
    
    for (const digit of source) {
    
        indexA += 1
        
        let indexB = indexA + delta
        
        if (indexB >= length) { indexB -= length }
        
        if (digit == source[indexB]) { sum += parseInt(digit) }
    }

    console.log("the solution is", sum)
}

main()


