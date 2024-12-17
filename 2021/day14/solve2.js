"use strict"

// solving the puzzle takes (my computer) 0.027s

/*
    instead of making successive transformations to the real text, 
    this program simply calculates the evolution of virtual pairs
    
    the letters in the virtual pairs are twice the letters in the
    real text (except both ends)    
*/

const input = Deno.readTextFileSync("input.txt").trim()

const RULES = { }


function main() {

    const template = processInput()
       
    let data = pairsFromString(template)
    
    for (let n = 0; n < 40; n++) { data = playRound(data) }
    
    const elements = countElements(data)
    
    elements[template[0]] += 1 // fixing the start
    elements[template.at(-1)] += 1 // fixing the end
    
    const amounts = Object.values(elements)
    
    let min = amounts[0]
    let max = amounts[0]
    
    for (const amount of amounts) {
    
        if (amount < min) { min = amount }
        if (amount > max) { max = amount }
    }
    
    console.log("the answer is", (max - min) / 2) // '/ 2' because virtual pairs count letters twice
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    const template = lines.shift().trim()
    
    lines.shift() // blank
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" -> ")
        
        const pair = tokens.shift()
        const insert = tokens.shift()
        
        const pairA = pair[0] + insert
        const pairB = insert + pair[1]
        
        RULES[pair] = { "pairA": pairA, "pairB": pairB }
    }
    
    return template
}

///////////////////////////////////////////////////////////

function pairsFromString(source) {

    const data = { }
    
    let last = source[0]
    
    source = source.substr(1)
    
    while (source != "") {
    
        const current = source[0]
        
        source = source.substr(1)
        
        const pair = last + current
        
        if (data[pair] == undefined) { data[pair] = 0 }
            
        data[pair] += 1
        
        last = current
    }
    return data
}

///////////////////////////////////////////////////////////

function playRound(data) {

    const newData = { }

    for (const oldPair of Object.keys(data)) {
    
        const amount = data[oldPair]
        
        const newPairs = RULES[oldPair]
    
        const pairA = newPairs.pairA
        const pairB = newPairs.pairB
        
        if (newData[pairA] == undefined) { newData[pairA] = 0 }
        if (newData[pairB] == undefined) { newData[pairB] = 0 }
        
        newData[pairA] += amount
        newData[pairB] += amount    
    }

    return newData
}

///////////////////////////////////////////////////////////

function countElements(data) {
    
    const elements = { }

    for (const key of Object.keys(data)) {
    
        const amount = data[key]
    
        const a = key[0]
        const b = key[1]
    
        if (elements[a] == undefined) { elements[a] = 0 }
        if (elements[b] == undefined) { elements[b] = 0 }
        
        elements[a] += amount
        elements[b] += amount    
    }

    return elements
}

main()

