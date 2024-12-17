"use strict"

// solving the puzzle takes (my computer) 0.026s

const input = Deno.readTextFileSync("input.txt").trim()

var DATA = ""


function main() {

    processInput()
    
    let start = 0 
    
    while (true) {
                    
        const token = DATA.substr(start, 14)
                
        const index = indexOfRepeated(token)

        if (index == -1) { break }
        
        start += index + 1
    }
    
    console.log("the answer is", start + 14)
}

function processInput() {
        
    DATA = input    
}

function indexOfRepeated(token) {

    for (let n = 0; n < 14; n++) {
    
        const target = token[n]
            
        let count = 0

        for (const c of token) { 
        
            if (c == target) { count += 1 } 
            
            if (count > 1) { return n }
        }
    }
    
    return -1
}

main()

