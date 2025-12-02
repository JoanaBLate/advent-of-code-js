// solution for https://adventofcode.com/2025/day/1 part 2

"use strict"

const input = Deno.readTextFileSync("day01-input.txt").trim()

var pointed = 50
var counter = 0

function main() {
    
    const rawTokens = input.split("\n")

    for (const rawToken of rawTokens) { 
    
        const token = rawToken.trim()        
        
        const number = parseInt(token.substr(1))
        
        if (token[0] == "L") { processLeftRotation(number) } else { processRightRotation(number) }  
    }
    
    console.log("the answer is", counter)
}

function processLeftRotation(number) {
        
    while (number >= 100) { number -= 100; counter += 1 }
        
    if (number < pointed) { pointed -= number; return }
    
    if (pointed == 0  &&  number == 0) { return } // number may become zero when it was multiple of 100
    
    if (number == pointed) { pointed = 0; counter += 1; return }
    
    // number > pointed:

    if (pointed != 0) { counter += 1 }

    pointed = pointed - number + 100
}

function processRightRotation(number) {

    while (number >= 100) { number -= 100; counter += 1 }
        
    if (pointed + number < 100) { pointed += number; return }
    
    if (pointed + number == 100) { pointed = 0; counter += 1; return }
    
    // pointed + number > 100:
    
    counter += 1
    
    pointed = pointed + number - 100
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

