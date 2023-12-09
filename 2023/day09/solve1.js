"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()

    let sum = 0
    
    for (const sequence of DATA) { 
    
        const list = goToZeros([ sequence ])
        
        const prediction = predict(list)
        
        sum += prediction
    }
     
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
    
        const sequence = [ ]
        
        for (const token of tokens) { sequence.push(parseInt(token)) }
        
        DATA.push(sequence) 
    }
}

function goToZeros(list) {

    while (true) {
    
        const obj = goToZerosThis(list.at(-1))
        
        list.push(obj.sequence)
        
        if (obj.isFinal) { return list }
    }
}

function goToZerosThis(sequence) {

    let isFinal = true
    
    const newSequence = [ ]
    
    for (let n = 1; n < sequence.length; n++) {
    
        const current = sequence[n]
        const previous = sequence[n - 1]
        
        const delta = current - previous
        
        newSequence.push(delta)
        
        if (delta != 0) { isFinal = false }
    }

    return { "sequence": newSequence, "isFinal": isFinal }
}

function predict(list) {

    list.at(-1).push(0)

    for (let n = list.length - 1; n > 0; n--) {
    
        const currentSequence = list[n - 1]
        
        const nextSequence = list[n]
        
        // b - a = c
        
        const a = currentSequence.at(-1)
        const c = nextSequence.at(-1)
        
        currentSequence.push(c + a)
    }
    
    return list[0].at(-1)
}

main()

