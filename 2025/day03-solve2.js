// solution for https://adventofcode.com/2025/day/3 part 2

"use strict"

const input = Deno.readTextFileSync("day03-input.txt").trim()

var result = 0

function main() {

    const rawBanks = input.split("\n")

    for (const rawBank of rawBanks) { processBank(rawBank.trim()) }
    
    console.log("the answer is", result)
}

function processBank(bank) {
    
    let token = ""
    
    let position = -1
    
    while (token.length < 12) {
    
        const maxIndex = bank.length - 1 - (11 - token.length)
        
        const data = getBestBatteryData(bank, position + 1, maxIndex)
        
        token += data.best
        
        position = data.position
    }
        
    result += parseInt(token)
}

function getBestBatteryData(bank, from, to) {

    let best = " "
    let position = 0

    for (let index = from; index <= to; index++) {
    
        if (bank[index] > best) { best = bank[index]; position = index }
    }
    
    return { "best": best, "position": position }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

