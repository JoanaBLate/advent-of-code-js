// solution for https://adventofcode.com/2025/day/11 part 1

"use strict"

const input = Deno.readTextFileSync("day11-input.txt").trim()

const DEVICES = { } // { parentName: childrenNames }

function main() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 

        const segments = rawLine.split(":")
        
        const parentName = segments.shift().trim()
        
        const childrenNames = segments.shift().trim().split(" ")
        
        DEVICES[parentName] = childrenNames
    }
    
    console.log("the answer is ", walk("you"))
}  

function walk(parentName) {

    if (parentName == "out") { return 1 }
    
    let result = 0
    
    const childrenNames = DEVICES[parentName]

    for (const childName of childrenNames) { result += walk(childName) }
    
    return result
}  

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

