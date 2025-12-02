// solution for https://adventofcode.com/2025/day/2 part 2

"use strict"

const input = Deno.readTextFileSync("day02-input.txt").trim()

function main() {
    
    let result = 0

    const idPairs = input.split(",")

    for (const idPair of idPairs) { 
    
        const tokens = idPair.split("-")
        
        const begin = parseInt(tokens[0])
        const end = parseInt(tokens[1])
        
        for (let number = begin; number <= end; number++) { 
        
            const token = "" + number
            
            const tokenLength = token.length
            
            if (checkNumber(token, tokenLength, 1)) { result += number; continue }
            if (checkNumber(token, tokenLength, 2)) { result += number; continue }
            if (checkNumber(token, tokenLength, 3)) { result += number; continue }
            if (checkNumber(token, tokenLength, 4)) { result += number; continue }
            if (checkNumber(token, tokenLength, 5)) { result += number; continue }
            if (checkNumber(token, tokenLength, 6)) { result += number; continue }
            if (checkNumber(token, tokenLength, 7)) { result += number; continue }
        }
    }        
    
    console.log("the answer is", result)
}

function checkNumber(token, tokenLength, len) {

    if (tokenLength == len) { return false }

    if (tokenLength % len != 0) { return false }
    
    const pattern = token.substr(0, len)
    
    let cursor = 0
    
    while (true) {
    
        cursor += len
        
        if (cursor >= tokenLength) { return true }
        
        const target = token.substr(cursor, len)
        
        if (pattern != target) { break }
    }
       
    return false
}
            
console.time("execution time")
main()
console.timeEnd("execution time") // 235ms

