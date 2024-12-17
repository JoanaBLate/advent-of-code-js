"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    const instructions = [ ]
    
    for (const rawLine of rawLines) {
    
        const number = parseInt(rawLine.trim())

        instructions.push(number) 
    }

    let steps = 0    
     
    let pointer = 0

    while (true) {
    
        if (pointer < 0 || pointer >= instructions.length) { break }
        
        steps += 1
        
        const jumps = instructions[pointer]
        
        instructions[pointer] += 1
        
        pointer += jumps
    }    

    console.log("the number of steps is", steps)
}

main()


