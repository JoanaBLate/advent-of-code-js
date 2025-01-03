// solution for https://adventofcode.com/2024/day/13 part 1

"use strict"

const input = Deno.readTextFileSync("day13-input.txt").trim()

var minimumSpentTokens = 0

function main() {

    processInput()
    
    console.log("the answer is", minimumSpentTokens)
}

function processInput() {
        
    const paragraphs = input.split("\n\n")
    
    for (const paragraph of paragraphs) { 
    
        const lines = paragraph.split("\n")
        
        const parts1 = lines.shift().trim().split(",")
        const parts2 = lines.shift().trim().split(",")
        const parts3 = lines.shift().trim().split(",")
        
        const buttonAX = parseInt(parts1.shift().replace("Button A: X+", ""))
        const buttonAY = parseInt(parts1.shift().replace(" Y+", ""))
        
        const buttonBX = parseInt(parts2.shift().replace("Button B: X+", ""))
        const buttonBY = parseInt(parts2.shift().replace(" Y+", ""))
        
        const prizeX = parseInt(parts3.shift().replace("Prize: X=", ""))
        const prizeY = parseInt(parts3.shift().replace(" Y=", ""))
        
        processMachine(buttonAX, buttonAY, buttonBX, buttonBY, prizeX, prizeY)
    }
}

function processMachine(buttonAX, buttonAY, buttonBX, buttonBY, prizeX, prizeY) {

    const maxButtonAForX = Math.floor(prizeX / buttonAX)
    const maxButtonAForY = Math.floor(prizeY / buttonAY)
    
    const maxButtonA = Math.max(maxButtonAForX, maxButtonAForY)
    
    let best = Infinity
    
    for (let a = 0; a <= maxButtonA; a++) {
    
        const missingX = prizeX - (a * buttonAX) // zero or positive
    
        const b = Math.floor(missingX / buttonBX)
        
        if (b * buttonBX != missingX) { continue }
        
        const missingY = prizeY - (a * buttonAY) // zero or positive
        
        if (b * buttonBY != missingY) { continue }
        
        const spent = 3 * a + b
        
        if (spent < best) { best = spent }    
    }
    
    if (best < Infinity) { minimumSpentTokens += best }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

