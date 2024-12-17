"use strict"

// solving the puzzle takes (my computer) 0.042s

const input = Deno.readTextFileSync("input.txt").trim()

const RULES = { }

const ELEMENTS = { }


function main() {

    const template = processInput()
    
    let data = template
    
    for (let n = 0; n < 10; n++) { data = insert(data) }
    
    for (const c of data) { ELEMENTS[c] += 1 }
    
    const amounts = Object.values(ELEMENTS)
    
    let min = amounts[0]
    let max = amounts[0]
    
    for (const amount of amounts) {
    
        if (amount < min) { min = amount }
        if (amount > max) { max = amount }
    }
    
    console.log("the answer is", max- min)
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
        
        RULES[pair] = insert 
        
        ELEMENTS[pair[0]] = 0
        ELEMENTS[pair[1]] = 0

        ELEMENTS[insert] = 0
    }
    
    return template
}

///////////////////////////////////////////////////////////

function insert(source) {

    let result = source[0]
    
    source = source.substr(1)
    
    while (source != "") {
    
        const next = source[0]
        
        source = source.substr(1)
        
        const between = RULES[result.at(-1) + next]  ||  ""
            
        result += between + next
    }

    return result
}

main()

