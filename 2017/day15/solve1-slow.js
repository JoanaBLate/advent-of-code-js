"use strict"

// solving the puzzle takes (my computer) 33s

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
    
    const max = 40 * 1000 * 1000
        
    while (true) {
        
        const productA = generatorA * 16807

        generatorA = productA % 2147483647
        
        const binaryA = generatorA.toString(2).padStart(16, 0)
        
        const bin16A = binaryA.substr(binaryA.length - 16)
        
        //
        
        const productB = generatorB * 48271

        generatorB = productB % 2147483647  

        const binaryB = generatorB.toString(2).padStart(16, 0)
        
        const bin16B = binaryB.substr(binaryB.length - 16) 
        
        //     
        
        if (bin16A == bin16B) { matches += 1 }
        
        counter += 1

        if (counter == max) { break }
    }    
    
    console.log("after 40 million pairs, the count is", matches)
}

main()


