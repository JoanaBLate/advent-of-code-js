// solution for https://adventofcode.com/2025/day/3 part 1

"use strict"

const input = Deno.readTextFileSync("day03-input.txt").trim()

var result = 0

function main() {

    const rawBanks = input.split("\n")

    for (const rawBank of rawBanks) { 
    
        const bank = rawBank.trim()
        
        processBank(bank)
    }        
    
    console.log("the answer is", result)
}

function processBank(bank) {

    const offA = bank.length - 1
    const offB = bank.length
    
    let bestA = " "
    
    for (let indexA = 0; indexA < offA; indexA++) {
    
        if (bank[indexA] > bestA) { bestA = bank[indexA] }
    }
    
    let bestB = " "
    
    for (let indexA = 0; indexA < offA; indexA++) {
    
        if (bank[indexA] != bestA) { continue }
        
        for (let indexB = indexA + 1; indexB < offB; indexB++) {
        
            if (bank[indexB] > bestB) { bestB = bank[indexB] }
        }
    }
    
    const token = bestA + bestB
    
    result += parseInt(token)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

