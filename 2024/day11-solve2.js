// solution for https://adventofcode.com/2024/day/11 part 1

// the order of the stones is NOT important!

"use strict"

const input = Deno.readTextFileSync("day11-input.txt").trim()

var initialStones = { }

const afterFiveBlinks = { }


function main() {

    processInput()
    
    for (const stone of Object.keys(initialStones)) { memorizeAfterFiveBlinks(stone) } // recursive
    
    console.log("the answer is", search())
}

function processInput() {
        
    const tokens = input.split(" ")
    
    for (const token of tokens) { 
    
        if (initialStones[token] == undefined) { initialStones[token] = 0 }

        initialStones[token] += 1
    }
}

function primitiveBlink(srcStones) {

    const newStones =  [ ]
    
    while (true) {

        const stone = srcStones.shift()
        
        if (stone == undefined) { break }
        
        if (stone == "0") { newStones.push("1"); continue }
        
        if (stone.length % 2 == 0) {
        
            const len = stone.length / 2
            
            const a = parseInt(stone.substr(0, len))
            const b = parseInt(stone.substr(len))

            newStones.push("" + a)
            newStones.push("" + b)
            continue        
        }

        const value = 2024 * parseInt(stone)
        
        newStones.push("" + value)
    }
    
    return newStones
}

function memorizeAfterFiveBlinks(stone) { // recursive

    if (afterFiveBlinks[stone] != undefined) { return }

    let stones = [stone]
    
    for (let n = 0; n < 5; n++) { stones = primitiveBlink(stones) }
    
    afterFiveBlinks[stone] = stones
    
    for (const newStone of stones) { memorizeAfterFiveBlinks(newStone) }
}

///////////////////////////////////////////////////////////////////////////////

function search() {

    let dict = initialStones
    
    for (let n = 0; n < 15; n++) { dict = smartBlink(dict) }
    
    let count = 0
    
    for (const value of Object.values(dict)) { count += value }
    
    return count
}
    
function smartBlink(srcDict) { // the same as 5 primitive blinks

    const newDict = { }

    for (const stone of Object.keys(srcDict)) {
    
        const count = srcDict[stone]

        const children = afterFiveBlinks[stone]
        
        for (const child of children) { 
        
            if (newDict[child] == undefined) { newDict[child] = 0 }
            
            newDict[child] += count
        }
    }

    return newDict
}


console.time("execution time")
main()
console.timeEnd("execution time") // 60ms

