"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    const target = findUnmatched()
    
    let start = -1
    
    let range = null
    
    while (true) {
    
        start += 1
        
        const end = trySequence(target, start)

        if (end == null) { continue }
        
        range = DATA.slice(start, end)
        
        break
    }
    
    let min = range[0]
    let max = range[0]
    
    for (const number of range) {
    
        if (number < min) { min = number }
        if (number > max) { max = number }
    }
        
    console.log("the answer is", min + max)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(parseInt(line)) }
}

function findUnmatched() {

    const off = DATA.length
    
    for (let n = 25; n < off; n++) {
     
        if (! isOk(n)) { return DATA[n] }
    }
}

function isOk(index) {

    const target = DATA[index]
    
    const base = index - 25
    
    for (let indexA = 0; indexA < 24; indexA++) { // when indexA == 24, indexB == 25
    
        const a = DATA[base + indexA]
        
        for (let indexB = indexA + 1; indexB < 25; indexB++) {
        
            const b = DATA[base + indexB]
        
            if (a + b == target) { return true }
        }
    }
    return false
}

function trySequence(target, start) {
   
    let sum = 0

    let end = start - 1
    
    while(true) {
    
        end += 1
        
        sum += DATA[end]
        
        if (sum == target) { return end }
        if (sum > target)  { return null }
    }
}

main()

