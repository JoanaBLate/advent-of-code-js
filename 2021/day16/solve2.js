"use strict"

// solving the puzzle takes (my computer) 0.026s

const input = Deno.readTextFileSync("input.txt").trim()

let DATA = ""


function main() {

    processInput() 
    
    console.log("the answer is", extractPacket())
}

///////////////////////////////////////////////////////////

function processInput() {
            
    for (const c of input) { 
    
        const n = parseInt(c, 16)
        
        const s = n.toString(2)
        
        DATA += s.padStart(4, "0")
    }
}

function eatData(n) {

    const s = DATA.substr(0, n)
    
    DATA = DATA.substr(n)
    
    return s
}

///////////////////////////////////////////////////////////

function extractPacket() {

    const version = parseInt(eatData(3), 2) // unused
    
    const typeId = parseInt(eatData(3), 2)
    
    if (typeId == 4) { return extractLiteralNumber() }
    
    //

    const values = extractPackets()
    
    if (typeId == 0) { return sum(values) }
    
    if (typeId == 1) { return multiply(values) }
    
    if (typeId == 2) { return min(values) }
    
    if (typeId == 3) { return max(values) }
    
    if (typeId == 5) { return values[0] > values[1] ? 1 : 0 }
    
    if (typeId == 6) { return values[0] < values[1] ? 1 : 0 }
    
    if (typeId == 7) { return values[0] == values[1] ? 1 : 0 }
}

///////////////////////////////////////////////////////////

function extractLiteralNumber() {
    
    let binary = ""
    
    while (true) {
    
        const shallEnd = eatData(1) == "0"
        
        binary += eatData(4)        
    
        if (shallEnd) { break }
    }
    
    return parseInt(binary, 2)
}  

function extractPackets() {

    const values = [ ]

    const lengthTypeId = eatData(1)
    
    if (lengthTypeId == 0) {
    
        const length = parseInt(eatData(15), 2) 
 
        const dataLengthAfterExtracting = DATA.length - length
        
        while (DATA.length != dataLengthAfterExtracting) { values.push(extractPacket()) }
        
        return values
    }
    
    // lengthTypeId == 1
    
    let amount = parseInt(eatData(11), 2)  
    
    while (amount > 0) { amount -= 1; values.push(extractPacket()) }
    
    return values
}

///////////////////////////////////////////////////////////

function sum(values) {

    let result = 0
    
    for (const value of values) { result += value }
    
    return result
}

function multiply(values) {

    let result = 1
    
    for (const value of values) { result *= value }
    
    return result
}

function min(values) {

    let result = values[0]
    
    for (const value of values) { if (value < result) { result = value } }
    
    return result
}

function max(values) {

    let result = values[0]
    
    for (const value of values) { if (value > result) { result = value } }
    
    return result
}

main()

