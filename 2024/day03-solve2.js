// solution for https://adventofcode.com/2024/day/3 part 2

"use strict"


const input = Deno.readTextFileSync("day03-input.txt").trim()

const doSegments = input.split("do()")

var total = 0

function main() {

    for (const segment of doSegments) { processDoSegment(segment) }

    console.log("the answer is", total)
}    
    
function processDoSegment(text) {

    const index = text.indexOf("don't()")
    
    if (index != -1) { text = text.substr(0, index) }
    
    while (true) {
    
        const start = text.indexOf("mul(")    
        
        if (start == -1) { break }
    
        text = text.substr(start + 4)
        
        const tokenA = getIntegerToken(text)
        
        if (tokenA == "") { continue }
        
        text = text.substr(tokenA.length)         
        
        if (text[0] != ",") { continue }
        
        text = text.substr(1)
        
        const tokenB = getIntegerToken(text)
        
        if (tokenB == "") { continue }
        
        text = text.substr(tokenB.length)         
        
        if (text[0] != ")") { continue }
        
     // text = text.substr(1) // not necessary
        
        total += parseInt(tokenA) * parseInt(tokenB)
    }
}

function getIntegerToken(text) {

    let token = ""
    
    while (text != "") {
    
        const c = text[0]
        
        if (c < "0"  ||  c > "9") { break }
        
        token += c
        
        text = text.substr(1)
    }
    
    return token
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

