"use strict"

// solving the puzzle takes (my computer) 0.830s


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
    
        // "1".repeat(16) to integer -> 65535
        // we can get directly the decimal value 
        // of the last 16 bits of a number - without using strings
        
        const productA = generatorA * 16807

        generatorA = productA % 2147483647
        
        const value16A = generatorA % 65536
        
        //
        
        const productB = generatorB * 48271

        generatorB = productB % 2147483647 
        
        const value16B = generatorB % 65536 
        
        //     
        
        if (value16A == value16B) { matches += 1 }
        
        counter += 1

        if (counter == max) { break }
    }    
    
    console.log("after 40 million pairs, the count is", matches)
}

main()


