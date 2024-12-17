"use strict"

// solving the puzzle takes (my computer) 0.030s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const distance = parseInt(rawText) 

    const buffer = [ 0 ]

    let currentPosition = 0
    
    const max = 2017 
        
    for (let n = 1; n <= max; n++) {
    
        currentPosition += distance

        while (currentPosition >= buffer.length) { currentPosition -= buffer.length }
                
        buffer.splice(currentPosition + 1, 0, n)

        currentPosition += 1
    }    
        
    let index = buffer.indexOf(2017)
    
    if (index > buffer.length - 1) { index = 0 }

    console.log("the value after 2017 inserts is", buffer[index+1])
}

main()


