// solution for https://adventofcode.com/2025/day/10 part 1

"use strict"

// this program assumes that the numbers inside each button are in crescent order //

const input = Deno.readTextFileSync("day10-input.txt").trim()

var MACHINES = [ ]

var BUTTONS = [ ]

const NEUTRAL = 0
const NOT_PRESSED = 1
const PRESSED = 2
const CONFLICT = 3 // NOT_PRESSED + PRESSED

var fewestPresses = 0

function main() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        processInputLine(rawLine.trim())
    
        linkMachinesToButtons()
        
        createValidCombos()
        
        fewestPresses += search()
    }

    console.log("the answer is", fewestPresses)
}

// input ----------------------------------------------------------------------

function processInputLine(line) {

    const tokens = line.split(" ")

    const lights = tokens.shift().replace("[", "").replace("]", "")
    
    MACHINES = [ ]
    
    for (const light of lights) { 
    
        const machine = { "isOn": (light == "#"), "buttonIndexes": [ ], "combos": [ ] }
        
        MACHINES.push(machine)
    }
    
    tokens.pop() // joltage
                
    BUTTONS = [ ]
    
    for (const token of tokens) { BUTTONS.push(createButtonFromInput(token)) }
}

function createButtonFromInput(text) {

    const tokens = text.replace("(", "").replace(")", "").split(",")    

    const machineIndexes = [ ]

    for (const token of tokens) { machineIndexes.push(parseInt(token)) }
    
    return { "machineIndexes": machineIndexes }
}

// improving info -------------------------------------------------------------

function linkMachinesToButtons() {

    for (let buttonIndex = 0; buttonIndex < BUTTONS.length; buttonIndex++) {
    
        const button = BUTTONS[buttonIndex]
        
        for (const machineIndex of button.machineIndexes) { 
        
            MACHINES[machineIndex].buttonIndexes.push(buttonIndex)
        }
    }
}

function createVirginCombo(machine) {

    const combo = new Int32Array(BUTTONS.length)
    
    for (const buttonIndex of machine.buttonIndexes) { combo[buttonIndex] = NOT_PRESSED }
    
    return combo
}

function createValidCombos() {

    for (const machine of MACHINES) { createValidCombosFor(machine) }
}

function createValidCombosFor(machine) {

    const validCombos = [ ]
    
    let oldCombos = [ ]
    
    for (const buttonIndex of machine.buttonIndexes) { 
    
        oldCombos.push([ buttonIndex ])
        
        if (machine.isOn) { validCombos.push([ buttonIndex ]) }
    }
    
    while (true) {
    
        const newCombos = [ ]
    
        for (const oldCombo of oldCombos) {
            
            for (const buttonIndex of machine.buttonIndexes) {
            
                if (oldCombo.at(-1) >= buttonIndex) { continue }
                
                const newCombo = oldCombo.slice()
                
                newCombo.push(buttonIndex)
                
                newCombos.push(newCombo)
                
                const isOdd = (newCombo.length % 2 == 1)
                
                if ((isOdd && machine.isOn)  ||  (! isOdd  &&  ! machine.isOn)) { validCombos.push(newCombo) }
            }
        }
        
        oldCombos = newCombos

        if (oldCombos.length == 0) { break }
     } 
     
     if (! machine.isOn) { machine.combos.push(createVirginCombo(machine)) }
     
     for (const validCombo of validCombos) {
     
        const obj = createVirginCombo(machine)
        
        for (const buttonIndex of validCombo) { obj[buttonIndex] = PRESSED }
                
        machine.combos.push(obj)
     }
}

// search ---------------------------------------------------------------------

function mergeCombos(comboA, comboB) {

    const newCombo = new Int32Array(BUTTONS.length)
    
    for (let buttonIndex = 0; buttonIndex < BUTTONS.length; buttonIndex++) {
    
        const a = comboA[buttonIndex]
        const b = comboB[buttonIndex]
        
        const sum = a + b
        
        if (sum == CONFLICT) { return null }
        
        if (a == b) { newCombo[buttonIndex] = a; continue }
        
        newCombo[buttonIndex] = sum // at least one of them is NEUTRAL
    }
    
    return newCombo
}

function search() {
    
    let oldCombos = MACHINES.shift().combos
    
    for (const machine of MACHINES) { // first machine was excluded
        
        const newCombos = [ ]
        
        for (const oldCombo of oldCombos) {
    
            for (const currentCombo of machine.combos) {
            
                const newCombo = mergeCombos(oldCombo, currentCombo)
                
                if (newCombo != null) { newCombos.push(newCombo) }
            }
        }
        
        if (MACHINES.length != 0) { oldCombos = newCombos }
    }

    let best = 999999
            
    for (const oldCombo of oldCombos) {
    
        let presses = 0
        
        for (const value of oldCombo) { if (value == PRESSED) { presses += 1 } }
    
        if (presses < best) { best = presses }
    }    
       
    return best
}

console.time("execution time")
main()
console.timeEnd("execution time") // 380ms

