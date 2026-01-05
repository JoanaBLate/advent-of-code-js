// solution for https://adventofcode.com/2025/day/10 part 1

"use strict"

// we don't need to consider multiple pressings of any button of a combo
// because any even number of presses has the same effect of zero presses
// and any odd number of presses has the same effect of one press

const input = Deno.readTextFileSync("day10-input.txt").trim()

var LIGHTS = ""

var BUTTONS = [ ]

var COMBOS = { } // { lights: combo } // inside each combo, no button has repeated presses


function main() {

    let result = 0
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 

        parseInputLine(rawLine.trim())

        fillCombos()    

        result += COMBOS[LIGHTS]
    }
    
    console.log("the answer is ", result)
}    

// parsing input line /////////////////////////////////////////////////////////

function parseInputLine(line) {
    
    const tokens = line.split(" ")
    
    setLights(tokens.shift())

    tokens.pop() // joltage
    
    BUTTONS = [ ]
    
    for (const token of tokens) { BUTTONS.push(createButton(token)) }
}

function setLights(token) {
    
    LIGHTS = token.substr(0, token.length - 1).substr(1)
}

function createButton(text) {

    const button = new Uint16Array(LIGHTS.length)
    
    const tokens = text.substr(0, text.length - 1).substr(1).split(",")    

    for (const token of tokens) { button[parseInt(token)] = 1 }
    
    return button
}

// combos /////////////////////////////////////////////////////////////////////

function fillCombos() { 

    COMBOS = { }
    
    const table = new Uint8Array(LIGHTS.length) // reusable table, makes the program much faster
        
    const off = Math.pow(2, BUTTONS.length)

    // skips 0 (no button pressed)
    for (let n = 1; n < off; n++) { fillCombosWith(n, table) }
}

function fillCombosWith(bitwiseCombo, table) {
    
    table.fill(0)

    let presses = 0
    
    for (let buttonIndex = 0; buttonIndex < BUTTONS.length; buttonIndex++) {
    
        const adjustedButtonIndex = BUTTONS.length - 1 - buttonIndex
        
        const buttonValueInBitwiseCombo = bitwiseCombo >> adjustedButtonIndex

        if ((buttonValueInBitwiseCombo & 1) != 1) { continue }

        presses += 1
                
        const button = BUTTONS[buttonIndex] 
        
        for (let lightIndex = 0; lightIndex < LIGHTS.length; lightIndex++) {
        
            table[lightIndex] += button[lightIndex]
        }
    }

    let lights = ""
    
    for (const value of table) { lights += (value % 2 == 0) ? "." : "#" }
    
    if (COMBOS[lights] == undefined) { COMBOS[lights] = presses; return }
    
    if (presses < COMBOS[lights]) { COMBOS[lights] = presses }
}   

console.time("execution time")
main()
console.timeEnd("execution time") // 55ms

