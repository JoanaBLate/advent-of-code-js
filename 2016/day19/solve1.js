"use strict"

// solving the puzzle takes (my computer) 0.023s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    let length = parseInt(rawText)
    
    let idOfFirstElf = 1
    
    let spaceBetweenElves = 1
      
    while (length > 1) {
        
        spaceBetweenElves *= 2
      
        const odd = (length % 2 == 1)
        
        length = Math.floor(length / 2)
        
        if (odd)  { idOfFirstElf += spaceBetweenElves } // assumes the id of the next elf in the row
        
    }    
        
    console.log("elf number is", idOfFirstElf)
}

main()

