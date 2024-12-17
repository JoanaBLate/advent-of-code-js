"use strict"

// solving the puzzle takes (my computer) 0.950s


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
    
        // "1".repeat(16) to integer -> 65535
        // we can get directly the decimal value 
        // of the last 16 bits of a number - without using strings
        
        
        generatorA = generateNewA(generatorA)
        
        const value16A = generatorA % 65536
        
        generatorB = generateNewB(generatorB) 
        
        const value16B = generatorB % 65536
        
        if (value16A == value16B) { matches += 1 }
        
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


