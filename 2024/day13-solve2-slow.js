// solution for https://adventofcode.com/2024/day/13 part 2

// this solution was adpted from   https://gist.github.com/Phantom784/68cb76e740329475ff933a41140c716e

"use strict"

const input = Deno.readTextFileSync("day13-input.txt").trim()

const OFFSET = 10 * 1000 * 1000 * 1000 * 1000

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
        
        const prizeX = OFFSET + parseInt(parts3.shift().replace("Prize: X=", ""))
        const prizeY = OFFSET + parseInt(parts3.shift().replace(" Y=", ""))
        
        minimumSpentTokens += processMachine(buttonAX, buttonAY, buttonBX, buttonBY, prizeX, prizeY)
    }
}
    
function processMachine(buttonAX, buttonAY, buttonBX, buttonBY, prizeX, prizeY) {

    const minStep = Math.min(Math.min(buttonAX, buttonAY), Math.min(buttonBX, buttonBY))

    let matchingA = 0
    let matchingB = 0    
    let leastMatch = Infinity

    const limit = 10000 // arbitrary: MAY NOT BE ENOUGH FOR YOUR INPUT!!!

    const maxPress = Math.floor(limit / minStep)

    for (let a = 0; a <= maxPress; a++) {
        for (let b = 0; b <= maxPress; b++) {
        
            let x = buttonAX * a + buttonBX * b
            let y = buttonAY * a + buttonBY * b
            
            if (x != 0  &&  x == y) {
            
                if (x < leastMatch) { leastMatch = x; matchingA = a; matchingB = b }
            }
        }
    }

    if (leastMatch == Infinity) { return 0 }
    
    ///////////////////////////////////////////////////////////////////////////

    // extrapolate to 10 trillion (get closest without going over)
    const factor = Math.floor(OFFSET / leastMatch)

    const startA = matchingA * factor
    const startB = matchingB * factor

    const startX = buttonAX * startA + buttonBX * startB

    const maxPrize = Math.max(prizeX, prizeY)

    // maximum possible distance from our (new, extrapolated) x & y
    // to the highest prize value
    const maxDist = maxPrize - startX

    const maxHits = Math.ceil(maxDist / minStep)

    for (let aa = maxHits * -1; aa <= maxHits; aa++) {
        for (let bb = maxHits * -1; bb <= maxHits; bb++) {
        
            const a = startA + aa
            const b = startB + bb

            const x = buttonAX * a + buttonBX * b
            const y = buttonAY * a + buttonBY * b

            if (x === prizeX  &&  y === prizeY) { return a * 3 + b }
        }
    }

    return 0
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1,100ms

