"use strict"

// solving the puzzle takes (my computer) 0.45s

const DATA = [ ]

const POSITION_MODE = 0

// const IMMEDIATE_MODE = 1

var amplifierA = null
var amplifierB = null
var amplifierC = null
var amplifierD = null
var amplifierE = null

function main() {

    processInput() 
    
    let best = 0
    
    const permutations = makeAllPermutations([ 5,6,7,8,9 ])
        
    for (const list of permutations) {
            
        const result = tryCombination(list)
        
        if (result > best) { best = result }
    }    
    
    console.log("the answer is", best)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}

function createAmplifier() {

    return { 
        "starting": true, 
        "phaseSetting": 0, 
        "output": 0, 
        "data": structuredClone(DATA), 
        "pointer": 0,
        "halted": false 
    }
}

function makeAllPermutations(items) {
 
    let results = []
    permute(items)
    return results
    
    function permute(arr, memo) {
    
        memo = memo || []
        
        let current
        
        for (let n = 0; n < arr.length; n++) {

            current = arr.splice(n, 1)
            
            if (arr.length === 0) { results.push(memo.concat(current)) }

            permute(arr.slice(), memo.concat(current))
            
            arr.splice(n, 0, current[0])
        }
    }
}

///////////////////////////////////////////////////////////

function tryCombination(list) {
    
    amplifierA = createAmplifier()
    amplifierB = createAmplifier()
    amplifierC = createAmplifier()
    amplifierD = createAmplifier()
    amplifierE = createAmplifier()
    
    amplifierA.phaseSetting = list[0]
    amplifierB.phaseSetting = list[1]
    amplifierC.phaseSetting = list[2]
    amplifierD.phaseSetting = list[3]
    amplifierE.phaseSetting = list[4]

    while (true) {
    
        runProgram(amplifierA, amplifierE.output)
        runProgram(amplifierB, amplifierA.output)
        runProgram(amplifierC, amplifierB.output)
        runProgram(amplifierD, amplifierC.output)
        runProgram(amplifierE, amplifierD.output)
        
        if (amplifierE.halted) { return amplifierE.output }
    }
}

function runProgram(amplifier, inputSignal) {

    const data = amplifier.data
    
    while (true) {
    
        const header = data[amplifier.pointer].toString().padStart(5, "0")
        
        amplifier.pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { amplifier.halted = true; break }
        
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
     // const modeC = parseInt(header[0])
              
        const parameterA = data[amplifier.pointer]
        
        amplifier.pointer += 1
        
        const valueA = (modeA == POSITION_MODE) ? data[parameterA] : parameterA
        
        if (opcode == "03") { 
            
            if (amplifier.starting) { amplifier.starting = false; data[parameterA] = amplifier.phaseSetting; continue }
            
            data[parameterA] = inputSignal
                
            continue 
        }
        
        if (opcode == "04") { amplifier.output = valueA; break }
        
        const parameterB = data[amplifier.pointer]
        
        amplifier.pointer += 1
        
        const valueB = (modeB == POSITION_MODE) ? data[parameterB] : parameterB
                
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { amplifier.pointer = valueB }
            continue 
        }
        
        if (opcode == "06") { // jump-if-false
     
            if (valueA == 0) { amplifier.pointer = valueB }
            continue 
        }
        
        const parameterC = data[amplifier.pointer]
        
        amplifier.pointer += 1        
        
        if (opcode == "01") { data[parameterC] = valueA + valueB; continue }
        
        if (opcode == "02") { data[parameterC] = valueA * valueB; continue }
        
        if (opcode == "07") { data[parameterC] = (valueA < valueB) ? 1 : 0; continue }
        
        if (opcode == "08") { data[parameterC] = (valueA == valueB) ? 1 : 0; continue }        
    }    
}

main()

