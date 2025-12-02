// solution for https://adventofcode.com/2025/day/2 part 1

"use strict"

const input = Deno.readTextFileSync("day02-input.txt").trim()

var result = 0

function main() {

    const idPairs = input.split(",")

    for (const idPair of idPairs) { 
    
        const tokens = idPair.split("-")
        
        const begin = parseInt(tokens[0])
        const end = parseInt(tokens[1])
        
        for (let number = begin; number <= end; number++) { checkNumber(number) }
    }        
    
    console.log("the answer is", result)
}

function checkNumber(number) {

    const token = "" + number
    
    const halfLength = Math.floor(token.length / 2)
    
    if (token.length != 2 * halfLength) { return }

    const a = token.substr(0, halfLength)
    const b = token.substr(halfLength)
    
    if (a == b) { result += number }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 130ms

