"use strict"

// solving the puzzle takes (my computer) 0.040s

const DATA = [ ]

const POSITION_MODE = 0

// const IMMEDIATE_MODE = 1


function main() {

    processInput() 
    
    let best = 0
    
    const permutations = makeAllPermutations([ 0,1,2,3,4 ])
    
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

    const a = runProgram(structuredClone(DATA), list[0], 0)
    
    const b = runProgram(structuredClone(DATA), list[1], a)
    
    const c = runProgram(structuredClone(DATA), list[2], b)
    
    const d = runProgram(structuredClone(DATA), list[3], c)
    
    const e = runProgram(structuredClone(DATA), list[4], d)
    
    return e
}

function runProgram(data, phaseSetting, inputSignal) {

    let input = phaseSetting

    let output = 0
    
    let pointer = 0 
    
    while (true) {
    
        const header = data[pointer].toString().padStart(5, "0")
        
        pointer += 1
        
        const opcode = header.substr(3, 2)        
        
        if (opcode == "99") { break }
        
        const modeA = parseInt(header[2])
        const modeB = parseInt(header[1])
     // const modeC = parseInt(header[0])
              
        const parameterA = data[pointer]
        
        pointer += 1
        
        const valueA = (modeA == POSITION_MODE) ? data[parameterA] : parameterA
        
        if (opcode == "03") { data[parameterA] = input; input = inputSignal; continue }
        
        if (opcode == "04") { output = valueA; continue }
        
        const parameterB = data[pointer]
        
        pointer += 1
        
        const valueB = (modeB == POSITION_MODE) ? data[parameterB] : parameterB
                
        if (opcode == "05") { // jump-if-true
        
            if (valueA != 0) { pointer = valueB }
            continue 
        }
        
        if (opcode == "06") { // jump-if-false
     
            if (valueA == 0) { pointer = valueB }
            continue 
        }
        
        const parameterC = data[pointer]
        
        pointer += 1        
        
        if (opcode == "01") { data[parameterC] = valueA + valueB; continue }
        
        if (opcode == "02") { data[parameterC] = valueA * valueB; continue }
        
        if (opcode == "07") { data[parameterC] = (valueA < valueB) ? 1 : 0; continue }
        
        if (opcode == "08") { data[parameterC] = (valueA == valueB) ? 1 : 0; continue }        
    }
    
    return output
}

main()

