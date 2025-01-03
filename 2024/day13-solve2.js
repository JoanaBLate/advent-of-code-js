// solution for https://adventofcode.com/2024/day/13 part 2

// solving using linear algebra (system of 2 equations and 2 variables)

"use strict"

const input = Deno.readTextFileSync("day13-input.txt").trim()

var minimumSpentTokens = 0

const OFFSET = BigInt(10 * 1000 * 1000 * 1000 * 1000)


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
        
        const buttonAx = BigInt(parts1.shift().replace("Button A: X+", ""))
        const buttonAy = BigInt(parts1.shift().replace(" Y+", ""))
        
        const buttonBx = BigInt(parts2.shift().replace("Button B: X+", ""))
        const buttonBy = BigInt(parts2.shift().replace(" Y+", ""))
        
        const prizeX = BigInt(parts3.shift().replace("Prize: X=", ""))
        const prizeY = BigInt(parts3.shift().replace(" Y=", ""))
        
        processMachine(buttonAx, buttonAy, buttonBx, buttonBy, OFFSET + prizeX, OFFSET + prizeY)
    }
}

function processMachine(buttonAx, buttonAy, buttonBx, buttonBy, prizeX, prizeY) {

/*

EXPLAINING THE FORMULAS THAT WILL BE USED:

there are two basic equations {

    aClicks*buttonAx + bClicks*buttonBx = prizeX
    aClicks*buttonAy + bClicks*buttonBy = prizeY
}

isolating aClicks in both equations {

    aClicks*buttonAx = prizeX - bClicks*buttonBx
    aClicks*buttonAy = prizeY - bClicks*buttonBy

    aClicks = (prizeX - bClicks*buttonBx) / buttonAx // both formulas are good but we 
    aClicks = (prizeY - bClicks*buttonBy) / buttonAy // need to find the value of bClicks first
}

creating a third equation by joining the other two {

    (prizeX - bClicks*buttonBx) / buttonAx = (prizeY - bClicks*buttonBy) / buttonAy
}

isolating bClicks in the third equation {

    buttonAy * (prizeX - bClicks*buttonBx) = buttonAx * (prizeY - bClicks*buttonBy) 
    
    buttonAy*prizeX - buttonAy*bClicks*buttonBx = buttonAx*prizeY - buttonAx*bClicks*buttonBy 
    
    buttonAx*bClicks*buttonBy - buttonAy*bClicks*buttonBx = buttonAx*prizeY - buttonAy*prizeX
    
    bClicks * (buttonAx*buttonBy - buttonAy*buttonBx) = buttonAx*prizeY - buttonAy*prizeX
    
    bClicks = (buttonAx*prizeY - buttonAy*prizeX) / (buttonAx*buttonBy - buttonAy*buttonBx)
}

*/

    let aClicks = BigInt(0)
    let bClicks = BigInt(0)

    bClicks = (buttonAx*prizeY - buttonAy*prizeX) / (buttonAx*buttonBy - buttonAy*buttonBx)
    
    aClicks = (prizeX - bClicks*buttonBx) / buttonAx
    
    
    if (aClicks*buttonAx + bClicks*buttonBx != prizeX) { return } // has no solution
    if (aClicks*buttonAy + bClicks*buttonBy != prizeY) { return } // has no solution
          
    minimumSpentTokens += 3 * parseInt(aClicks) + parseInt(bClicks)
}

console.time("execution time")
main()
console.timeEnd("execution time") // 2ms

