"use strict"

// solving the puzzle takes (my computer) 0.025s

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
    
    const aOk = (password[a - 1] == letter)
    const bOk = (password[b - 1] == letter)
    
    if (aOk  &&  bOk) { return false }
    
    return aOk  ||  bOk
}

main()

