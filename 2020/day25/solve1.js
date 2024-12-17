"use strict"

// solving the puzzle takes (my computer) 0.230s

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

 // const subjectNumber = 7

    let x = 1
    
    let loopSize = 0
    
    while (true) {
    
        loopSize += 1
    
    //  x = (x * subjectNumber) % divisor // correct but slow
        
        x = (x * 7) % 20201227 // more than two times faster
        
        if (x == publicKey) { return loopSize }
    }
}

function transform(subjectNumber, loopSize) {

    let x = 1
    
    for (let n = 0; n < loopSize; n++) { 
    
        x = (x * subjectNumber) % divisor    
    }
    
    return x
}

main()

