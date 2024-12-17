// solution for https://adventofcode.com/2024/day/13 part 2

// solving using linear algebra (system of 2 equations and 2 variables)

// adapted from https://github.com/BigBear0812/AdventOfCode/blob/master/2024/Day13.js

"use strict"

const input = Deno.readTextFileSync("day13-input.txt").trim()

var minimumSpentTokens = 0

const OFFSET = 10 * 1000 * 1000 * 1000 * 1000


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
        
        const buttonAx = parseInt(parts1.shift().replace("Button A: X+", ""))
        const buttonAy = parseInt(parts1.shift().replace(" Y+", ""))
        
        const buttonBx = parseInt(parts2.shift().replace("Button B: X+", ""))
        const buttonBy = parseInt(parts2.shift().replace(" Y+", ""))
        
        const prizeX = parseInt(parts3.shift().replace("Prize: X=", ""))
        const prizeY = parseInt(parts3.shift().replace(" Y=", ""))
        
        processMachine(buttonAx, buttonAy, buttonBx, buttonBy, OFFSET + prizeX, OFFSET + prizeY)
    }
}

function processMachine(buttonAx, buttonAy, buttonBx, buttonBy, prizeX, prizeY) {

    const aClicksXMultiplier =   buttonAx * buttonBy
    const aClicksYMultiplier = -(buttonAy * buttonBx)
    const prizeXMultiplied =   prizeX * buttonBy
    const prizeYMultiplied = -(prizeY * buttonBx)

    const aClicksMultiplierCombined = aClicksXMultiplier + aClicksYMultiplier
    const prizeMultipliedCombined = prizeXMultiplied + prizeYMultiplied

    const aClicks = prizeMultipliedCombined / aClicksMultiplierCombined
    
    if (prizeMultipliedCombined % aClicksMultiplierCombined != 0) { return } // has no solution
    
    const bClicks = (prizeX - (buttonAx * aClicks)) / buttonBx
    
    if (bClicks != Math.floor(bClicks)) { return } // has no solution 
      
    minimumSpentTokens += aClicks * 3 + bClicks
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

