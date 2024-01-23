"use strict"

// solving the puzzle takes (my computer) 0.290s

const input = Deno.readTextFileSync("input.txt").trim()

const divisor = 20201227

var publicKeyCard = 0

var publicKeyDoor = 0


function main() {

    processInput()
        
    const loopSizeCard = findLoopSize(publicKeyCard)
        
    const encryptionKeyByCard = transform(publicKeyDoor, loopSizeCard)   
    
    console.log("the answer is", encryptionKeyByCard)
}

function processInput() {
        
    const lines = input.split("\n")
    
    publicKeyCard = parseInt(lines.shift())
    
    publicKeyDoor = parseInt(lines.shift()) 
}

function findLoopSize(publicKey) {

    const subjectNumber = 7

    let loopSize = 0
    
    let value = 1
    
    while (true) {
    
        loopSize += 1
    
        value = value * subjectNumber % divisor
        
        if (value == publicKey) { return loopSize }
    }
}

function transform(subjectNumber, loopSize) {

    let x = 1
    
    for (let n = 0; n < loopSize; n++) { 
    
        x *= subjectNumber
        
        x %= divisor    
    }
    
    return x
}

main()

