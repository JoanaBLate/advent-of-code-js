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
    
    const headMaxIndex = bank.length - 1 - 11 // eleven digits must follow the head digit

    const headData = getBestBatteryData(bank, 0, headMaxIndex)
    
    let token = headData.best
    
    let positions = headData.positions
    
    //
    
    while (token.length < 12) {
    
        const maxIndex = bank.length - 1 - (11 - token.length)
        
        const data = getBestBatteryCandidatesData(bank, positions, maxIndex)
        
        token += data.best
        
        positions = data.positions
    }
        
    result += parseInt(token)
} 

function getBestBatteryCandidatesData(bank, oldIndexes, maxIndex) {

    let best = " "
    let positions = [ ]
    
    for (const oldIndex of oldIndexes) {
    
        const data = getBestBatteryData(bank, oldIndex + 1, maxIndex)
        
        if (data.best < best) { continue }
        
        if (data.best > best) { best = data.best; positions = data.positions; continue }
        
        // same as best but from other segment:
        
        for (const position of data.positions) { positions.push(position) }
    }
    
    return { "best": best, "positions": positions }
}

function getBestBatteryData(bank, from, to) {

    let best = " "
    let positions = [ ]

    for (let index = from; index <= to; index++) {
    
        if (bank[index] < best) { continue }
        
        if (bank[index] == best) { positions.push(index); continue }
        
        best = bank[index] 
        positions = [ index ]
    }
    
    return { "best": best, "positions": positions }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 95ms

