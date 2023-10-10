"use strict"

// solving the puzzle takes (my computer) 5s

// the current algorithm is slow because it relies on strings
// the fast way is working only with decimals

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    const tokensA = rawLines.shift().trim().split(" ")
    
    let generatorA = parseInt(tokensA.pop())
    
    const tokensB = rawLines.shift().trim().split(" ")
    
    let generatorB = parseInt(tokensB.pop())
     
    let counter = 0
    
    let matches = 0
    
    const max = 5 * 1000 * 1000
        
    while (true) {
        
        generatorA = generateNewA(generatorA)
        
        const binaryA = generatorA.toString(2).padStart(16, 0)
        
        const bin16A = binaryA.substr(binaryA.length - 16)
        
        //
        
        generatorB = generateNewB(generatorB)  

        const binaryB = generatorB.toString(2).padStart(16, 0)
        
        const bin16B = binaryB.substr(binaryB.length - 16) 
        
        //     
        
        if (bin16A == bin16B) { matches += 1 }
        
        counter += 1

        if (counter == max) { break }
    }    
    
    console.log("after 5 million pairs, the count is", matches)
}

function generateNewA(previous) {

    while (true) {
    
        const product = previous * 16807

        const result = product % 2147483647
        
        if (result % 4 == 0) { return result }
        
        previous = result
    }
}

function generateNewB(previous) {

    while (true) {
    
        const product = previous * 48271

        const result = product % 2147483647
        
        if (result % 8 == 0) { return result }
        
        previous = result
    }
}

main()


