// solution for https://adventofcode.com/2025/day/1 part 1

"use strict"

const input = Deno.readTextFileSync("day01-input.txt").trim()


function main() {

    let pointed = 50
    
    let counter = 0

    const rawTokens = input.split("\n")

    for (const rawToken of rawTokens) { 
    
        const token = rawToken.trim()
        
        const sign = (token[0] == "L") ? -1 : +1
        
        const originalNumber = parseInt(token.substr(1))
        
        const number = originalNumber % 100 // because some numbers are greater than 100
        
        pointed += (sign * number)
        
        if (pointed < 0) { pointed += 100 } else if (pointed > 99) { pointed -= 100 }
        
        if (pointed == 0) { counter += 1 }
    }
    
    console.log("the answer is", counter)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

