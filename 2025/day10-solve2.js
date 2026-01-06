// solution for https://adventofcode.com/2025/day/10 part 2

"use strict"

// this program does NOT use advanced math NOR any library

// this program was inspired by the brilliant post by tenthmascot at
// https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/

// this algorithm works using optimized brute force; using
// brute force would be impossible without optimization

// the program organizes all possible button combinations (without
// pressing any button twice) according to a pattern of even/odd joltage

// when it is time to apply the combo (pressing some buttons), only
// the combos with the same even/odd pattern as the current joltage
// are tried, which has 2 advantages:
// 1. MUCH more efficient (testing only a couple of combos out of
// hundreds)
// 2. since the new current joltage has only even numbers, we can
// divide it by two and skip a lot of processing


const input = Deno.readTextFileSync("day10-input.txt").trim()

var JOLTAGES = [ ] // just the input parsed into numbers

var BUTTONS = [ ]  // just the input parsed into lists of numbers

var combosByPattern = { } // pattern_string: [ comboObj ] }

var cache = { }  // { target_joltage_string: number_of_presses }


function main() {

    let result = 0
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 

        parseInputLine(rawLine.trim())
        
        fillPatternsAndCombos() 

        result += search()
    }
        
    console.log("the answer is ", result)
}    

// parsing input line /////////////////////////////////////////////////////////

function parseInputLine(line) {
    
    const tokens = line.split(" ")
    
    tokens.shift() // lights

    setJoltages(tokens.pop())
    
    BUTTONS = [ ]
    
    for (const token of tokens) { BUTTONS.push(createButton(token)) }
}

function setJoltages(text) {

    JOLTAGES = [ ]
    
    const tokens = text.substr(0, text.length - 1).substr(1).split(",")    

    for (const token of tokens) { JOLTAGES.push(parseInt(token)) }
}

function createButton(text) {

    const button = [ ]
    
    const tokens = text.substr(0, text.length - 1).substr(1).split(",")    

    for (const token of tokens) { button.push(parseInt(token)) }
    
    return button
}

// patterns & combos //////////////////////////////////////////////////////////

function patternFromJoltage(joltage) {

    let pattern = ""
    
    for (const jolt of joltage) { pattern += (jolt % 2) }
    
    return pattern
}

function fillPatternsAndCombos() {

    combosByPattern = { }
    
    const off = Math.pow(2, BUTTONS.length)

    for (let n = 0; n < off; n++) { fillPatternsAndCombosWith(n) }
}

function fillPatternsAndCombosWith(bitwiseCombo) {
    
    let presses = 0
        
    const joltage = Array(JOLTAGES.length).fill(0) 

 // const guide = bitwiseCombo.toString(2).padStart(BUTTONS.length, 0)    
    
    for (let buttonIndex = 0; buttonIndex < BUTTONS.length; buttonIndex++) {
    
    //  if (guide[buttonIndex] != "1") { continue }
    
        const adjustedButtonIndex = BUTTONS.length - 1 - buttonIndex
        
        const buttonValueInBitwiseCombo = bitwiseCombo >> adjustedButtonIndex

        if ((buttonValueInBitwiseCombo & 1) != 1) { continue }
        
        presses += 1
        
        const button = BUTTONS[buttonIndex]
        
        for (const machineIndex of button) { joltage[machineIndex] += 1 }    
    }   
        
    const pattern = patternFromJoltage(joltage)
    
    if (combosByPattern[pattern] == undefined) { combosByPattern[pattern] = [ ] }
    
    combosByPattern[pattern].push({ "presses": presses, "joltage": joltage })
}

// search /////////////////////////////////////////////////////////////////////

function search() {

    cache = { }

    return countPresses(JOLTAGES)
}

function countPresses(target) {
    
    const key = target.join(",")

    if (cache[key] != undefined) { return cache[key] }

    let onlyZeros = true
    
    for (const jolt of target) {
    
        if (jolt < 0) { return Infinity }
        if (jolt > 0) { onlyZeros = false }    
    }
    
    if (onlyZeros) { return 0 }
    
    const pattern = patternFromJoltage(target)

    let total = Infinity
    
    if (combosByPattern[pattern] == undefined) { cache[key] = total; return total }
    
    for (const comboObj of combosByPattern[pattern]) {    

        const halfTarget = new Array(JOLTAGES.length)
                
        for (let joltageIndex = 0; joltageIndex < JOLTAGES.length; joltageIndex++) {
        
            const newJolt = (target[joltageIndex] - comboObj.joltage[joltageIndex]) / 2 // granted to be integer
            
            halfTarget[joltageIndex] = newJolt
        }
                   
        const presses = comboObj.presses + 2 * countPresses(halfTarget)

        if (presses < total) { total = presses }
    }

    cache[key] = total

    return total
}

console.time("execution time")
main()
console.timeEnd("execution time") // 100ms

