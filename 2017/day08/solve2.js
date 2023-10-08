"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")

    let largest = 0
    
    const registers = { }
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        const registerA = tokens.shift()
        
        if (registers[registerA] == undefined) { registers[registerA] = 0 }
        
        const operation = tokens.shift() 
        
        const valueA = parseInt(tokens.shift())
        
        tokens.shift() // if
    
        const registerB = tokens.shift()
        
        if (registers[registerB] == undefined) { registers[registerB] = 0 }
                
        const relational = tokens.shift() 
        
        const valueB = parseInt(tokens.shift())
        
        //
        
        if (! conditionOk(registers[registerB], relational, valueB)) { continue }
        
        //
        
        if (operation == "inc") { 
               
            registers[registerA] += valueA
            
        }
        else if (operation == "dec"){
            
            registers[registerA] -= valueA
        }        
        
        if (registers[registerA] > largest) { largest = registers[registerA] }
    }
             
    console.log("the largest value is", largest)
}

function conditionOk(a, relational, b) {

    if (relational == "<")  { return a < b }
    if (relational == ">")  { return a > b }
    if (relational == "<=") { return a <= b }
    if (relational == ">=") { return a >= b }
    if (relational == "==") { return a == b }
    if (relational == "!=") { return a != b }
}

main()

