"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]


function main() {

    processInput()
    
    let count = 0
    
    for (const line of DATA) { 
        
        if (passwordIsOk(line)) { count += 1 }
    }
     
    console.log("the answer is", count)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

function passwordIsOk(line) {

    const tokens = line.split(" ")
    
    const numbers = tokens.shift().split("-")
    
    const a = parseInt(numbers.shift())    
    const b = parseInt(numbers.shift())

    const letter = tokens.shift().replace(":", "")

    const password = tokens.shift()
    
    let count = 0
    
    for (const char of password) {
    
        if (char == letter) { count += 1 }
    }
    
    if (count < a) { return false }
    if (count > b) { return false }

    return true
}

main()

