// solution for https://adventofcode.com/2024/day/22 part 1

"use strict"

const input = Deno.readTextFileSync("day22-input.txt").trim()

const allNumbers = [ ] // BigInts


function main() {

    processInput()    
    
    let sum = BigInt(0)
    
    for (const secret of allNumbers) { sum += processSecretNumber(secret) }
      
    console.log("the answer is", sum)    
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const number = BigInt(rawLine.trim())
        
        allNumbers.push(number) 
    }
}

///////////////////////////////////////////////////////////////////////////////

function processSecretNumber(secret) {

    for (let n = 0; n < 2000; n++) {
    
        secret = processSecretNumberOnce(secret)        
    }
    return secret
}

function processSecretNumberOnce(secret) { // expecting BigInt

    const a = secret * BigInt(64)    
    const b = a ^ secret
    const step1 = b % BigInt(16777216)
        
    const c = step1 / BigInt(32) // BigInt automatically rounds down     
    const d = c ^ step1    
    const step2 = d % BigInt(16777216)

    const e = step2 * BigInt(2048)    
    const f = e ^ step2
    const step3 = f % BigInt(16777216)

    return step3
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 55ms

