// solution for https://adventofcode.com/2024/day/14 part 1

"use strict"

const input = Deno.readTextFileSync("day14-input.txt").trim()

const width = 101
const height = 103

const verticalDivision = 50   // for width
const horizontalDivision = 51 // for height

var quadrantA = 0
var quadrantB = 0
var quadrantC = 0
var quadrantD = 0


function main() {

    processInput()
    
    console.log("the answer is", quadrantA * quadrantB * quadrantC * quadrantD)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const tokensP = parts.shift().substr(2).split(",")
        const tokensV = parts.shift().substr(2).split(",")
        
        const posX = parseInt(tokensP.shift())
        const posY = parseInt(tokensP.shift())
        const velX = parseInt(tokensV.shift())
        const velY = parseInt(tokensV.shift())
        
                
        const bruteX = posX + (100 * velX)
        const bruteY = posY + (100 * velY)
        
        let finalX = bruteX % width
        if (finalX < 0) { finalX += width }
        
        let finalY = bruteY % height
        if (finalY < 0) { finalY += height }
        
        if (finalX == verticalDivision) { continue }
        if (finalY == horizontalDivision) { continue }
        
        if (finalX < verticalDivision) { // A or C
        
            if (finalY < horizontalDivision) { quadrantA += 1 } else { quadrantC += 1 }
        }
        else { // B or D
        
            if (finalY < horizontalDivision) { quadrantB += 1 } else { quadrantD += 1 }
        }
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

