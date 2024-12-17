// solution for https://adventofcode.com/2024/day/3 part 1

"use strict"

var text = Deno.readTextFileSync("day03-input.txt").trim()


function main() {

    let total = 0

    while (true) {
    
        const start = text.indexOf("mul(")
        
        if (start == -1) { break }
    
        text = text.substr(start + 4)
        
        const numberA = extractInteger()
        
        if (numberA === null) { continue }
        
        if (text[0] != ",") { continue }
        
        text = text.substr(1)
        
        const numberB = extractInteger()
        
        if (numberB === null) { continue }
        
        if (text[0] != ")") { continue }
        
        total += numberA * numberB        
    }

    console.log("the answer is", total)
}

function extractInteger() {

    let token = ""
    
    while (text != "") {
    
        const c = text[0]
        
        if (c < "0"  ||  c > "9") { break }
        
        token += c
        
        text = text.substr(1)
    }
    
    if (token == "") { return null }
    
    return parseInt(token)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms


