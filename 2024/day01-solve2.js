// solution for https://adventofcode.com/2024/day/1 part 2

"use strict"

const input = Deno.readTextFileSync("day01-input.txt").trim()

const listA = [ ]
const dictB = [ ]

function main() {

    processInput()

    let similarity = 0
    
    for (const number of listA) { 
    
        const count = dictB["" + number]
        
        if (count != undefined) { similarity += number * count }
    }
    
    console.log("the answer is", similarity)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const valueA = parseInt(line.substr(0, 5))
        const stringB = line.substr(8, 5)
        
        listA.push(valueA)
        
        if (dictB[stringB] == undefined) { dictB[stringB] = 0 }
        dictB[stringB] += 1
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

