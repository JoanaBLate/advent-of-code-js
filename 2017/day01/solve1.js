"use strict"

// solving the puzzle takes (my computer) 0.024s

function main() {

    const source = Deno.readTextFileSync("input.txt").trim()
        
    let sum = 0
    
    let index = -1
    
    for (const digit of source) {
    
        index += 1
        
        if (digit == source[index + 1]) { sum += parseInt(digit) }
    }
    
    if (source[0] == source[source.length - 1]) { sum += parseInt(source[0]) }

    console.log("the solution is", sum)
}

main()


