"use strict"

// solving the puzzle takes (my computer) 0.250s

// using a virtual buffer because it would be too slow using a real one

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const distance = parseInt(rawText) 

    let currentPosition = 0
    
    let zeroPosition = 0
    
    let afterZero = -1
    
    let bufferLength = 1
    
    const max = 50 * 1000 * 1000
        
    for (let n = 1; n <= max; n++) {
    
        currentPosition += distance

        while (currentPosition >= bufferLength) { currentPosition -= bufferLength }
       
        // inserting value:
        
        if (currentPosition == zeroPosition) {
        
            afterZero = n        
        }
        else if (currentPosition < zeroPosition) {
        
            zeroPosition += 1
        }
                
        bufferLength += 1

        currentPosition += 1
    }    
    console.log("the value after 50 million inserts is", afterZero)       
}

main()


