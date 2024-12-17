"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

let DATA = ""

var VERSIONS = 0


function main() {

    processInput() 
    
    extractPacket()
    
    console.log("the answer is", VERSIONS)
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

    const version = parseInt(eatData(3), 2)
    
    VERSIONS += version

    const typeId = parseInt(eatData(3), 2)
    
    if (typeId == 4) { extractLiteralNumber(); return }

    extractOperatorSection()
}

function extractLiteralNumber() {
    
    let binary = ""
    
    while (true) {
    
        const shallEnd = eatData(1) == "0"
        
        binary += eatData(4)        
    
        if (shallEnd) { break }
    }
}  

function extractOperatorSection() {

    const lengthTypeId = eatData(1)
    
    if (lengthTypeId == 0) {
    
        const length = parseInt(eatData(15), 2) 
 
        const dataLengthAfterExtracting = DATA.length - length
        
        while (DATA.length != dataLengthAfterExtracting) {  extractPacket() }
        
        return
    }
    
    // lengthTypeId == 1
    
    let amount = parseInt(eatData(11), 2)  
    
    while (amount > 0) { amount -= 1; extractPacket() }
}

main()

