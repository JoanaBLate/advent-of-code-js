// solution for https://adventofcode.com/2024/day/25 part 1

"use strict"

const input = Deno.readTextFileSync("day25-input.txt").trim()

const allLocks = [ ]

const allKeys = [ ]


function main() {

    processInput()     
              
    console.log("the answer is", countMatches())
}

///////////////////////////////////////////////////////////////////////////////

function processInput() {
    
    const rawDevices = input.split("\n\n")
    
    for (const rawDevice of rawDevices) {
    
        const rawLines = rawDevice.trim().split("\n")
        
        const isLock = rawLines[0].startsWith("#####")
        
        if (isLock) {
            processInputLock(rawLines)
        }
        else {
            processInputKey(rawLines)
        }
    }
}

function processInputLock(rawLines) {

    const freeHeights = [ 0, 0, 0, 0, 0 ]

    for (let row = 5; row > 0; row--) { // despises the top row and the bottom row

        for (let col = 0; col < 5; col++) {
        
            if (rawLines[row][col] == ".") { freeHeights[col] = 5 - row  + 1 }
        }
    }
    
    allLocks.push(freeHeights)            

 // for (const line of rawLines) { console.log(line) }
 // console.log(freeHeights, "  (free heights)\n\n")
}

function processInputKey(rawLines) {

    const usedHeights = [ 0, 0, 0, 0, 0 ]

    for (let row = 5; row > 0; row--) { // despises the top row and the bottom row

        for (let col = 0; col < 5; col++) {
        
            if (rawLines[row][col] == "#") { usedHeights[col] = 5 - row  + 1 }
        }
    }
    
    allKeys.push(usedHeights) 
    
 // for (const line of rawLines) { console.log(line) }
 // console.log(usedHeights, "  (used heights)\n\n")           
}

///////////////////////////////////////////////////////////////////////////////

function countMatches() {

    let matches = 0
    
    for (const freeHeights of allLocks) {
    
        for (const usedHeights of allKeys) {
        
            let match = true
        
            for (let col = 0; col < 5; col++) { 
            
                if (usedHeights[col] > freeHeights[col]) { match = false; break }
            }
            
            if (match) { matches += 1 }
        }
    }

    return matches
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 6ms

