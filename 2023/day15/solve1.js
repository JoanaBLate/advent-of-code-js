"use strict"

// solving the puzzle takes (my computer) 0.027s

var DATA = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) { sum += decode(data) }
    
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    DATA = input.split(",")
}

function decode(data) {

    let value = 0
    
    for (const c of data) {
        
        value += c.charCodeAt(0)
        value *= 17
        value %= 256    
    }

    return value
}

main()

