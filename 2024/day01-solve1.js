// solution for https://adventofcode.com/2024/day/1 part 1

"use strict"

const input = Deno.readTextFileSync("day01-input.txt").trim()

const listA = [ ]
const listB = [ ]

function main() {

    processInput()

    let totalDistance = 0
    
    const off = listA.length
    
    for (let n = 0; n < off; n++) { totalDistance += Math.abs(listB[n] - listA[n]) }
    
    console.log("the answer is", totalDistance)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const valueA = parseInt(line.substr(0, 5))
        const valueB = parseInt(line.substr(8, 5))
        
        listA.push(valueA)
        listB.push(valueB)
    }
        
    listA.sort(function (a, b) { return a - b })
    listB.sort(function (a, b) { return a - b })
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

