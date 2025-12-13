// solution for https://adventofcode.com/2025/day/10 part 1

"use strict"

// for eficiency reasons:
// this solution converts the input data to binary data in form of
// decimal integers and applies the bitwise operator XOR (^) on it
// (XOR has the toggle effect)

const input = Deno.readTextFileSync("day10-input.txt").trim()

var fewestPresses = 0

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        fewestPresses += processInputLine(rawLine.trim())
    }

    console.log("the answer is", fewestPresses)
}

function processInputLine(line) {

    const tokens = line.split(" ")

    const lightPart = tokens.shift()
    
    const joltagePart = tokens.pop()

    const target = createTargetFromInput(lightPart)
        
    const numberOfLights = lightPart.length - 2
        
    const buttons = [ ]
    
    for (const token of tokens) { buttons.push(createButtonFromInput(token, numberOfLights)) }
    
    return calcFewestPressesFor(target, buttons)
}

function createTargetFromInput(token) {

    const chars = token.replace("[", "").replace("]", "").split("")
    
    let number = 0
    
    let factor = 1
    
    while (chars.length != 0) {
    
        if (chars.pop() == "#") { number += factor }
        
        factor *= 2    
    }
    
    return number
}

function createButtonFromInput(text, numberOfLights) {

    const tokens = text.replace("(", "").replace(")", "").split(",")    

    let number = 0

    for (const token of tokens) { 
    
        const index = parseInt(token)
    
        const n = numberOfLights - 1 - index
        
        number += Math.pow(2, n)
    }
    
    return number
}

// ----------------------------------------------------------------------------

function calcFewestPressesFor(model, buttons) {

    let count = 0
    
    let combinations = new Uint16Array(buttons.length)
    
    for (let index = 0; index < buttons.length; index++) { combinations[index] = buttons[index] }

    while (true) {
    
        count += 1
    
        for (const combination of combinations) { if (combination == model) { return count } }
                 
        let newCombinations = new Uint16Array(combinations.length * buttons.length)
        
        let index = -1
         
        for (const combination of combinations) {
          
            for (const button of buttons) {  index += 1; newCombinations[index] = combination ^ button }          
        }
        
        combinations = newCombinations
    }
}

console.time("execution time")
main()
console.timeEnd("execution time") // 200ms

