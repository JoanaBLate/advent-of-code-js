"use strict"

// solving the puzzle takes (my computer) 0.140s

const input = Deno.readTextFileSync("input.txt").trim()

const KEY = 811589153 // THIS KEY WILL BE APPLIED ONLY WHEN IT IS REALLY NECESSARY //

var LENGTH = 0

var ORIGINAL = null

var TRANSLATED = null


function main() {

    processInput()
    
    for (let round = 0; round < 10; round++) {
     
        for (let n = 0; n < LENGTH; n++) { moveItem(n) }
    }

    const result = new Int32Array(LENGTH)    

    for (let n = 0; n < LENGTH; n++) { result[n] = ORIGINAL[TRANSLATED[n]] } 
    
    const index = result.indexOf(0)
    
    let a = index + 1000
    
    while (a >= LENGTH) { a -= LENGTH }
    
    let b = index + 2000
    
    while (b >= LENGTH) { b -= LENGTH }
    
    let c = index + 3000
    
    while (c >= LENGTH) { c -= LENGTH }
    
    console.log("the answer is", (KEY * result[a]) + (KEY * result[b]) + (KEY * result[c]))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    LENGTH = lines.length
    
    ORIGINAL = new Int32Array(LENGTH)
    
    let n = 0
    
    for (const line of lines) { ORIGINAL[n] = parseInt(line.trim()); n += 1 }   
    
    //
    
    TRANSLATED = new Int32Array(LENGTH) 
    
    for (let n = 0; n < LENGTH; n++) { TRANSLATED[n] = n }
}

///////////////////////////////////////////////////////////

function moveItem(n) {
    
    const displacement = ORIGINAL[n]
    
    if (displacement == 0) { return }
    
    const oldPosition = TRANSLATED.indexOf(n)
    
    let newPosition = oldPosition + (displacement * KEY)
    
    if (newPosition > LENGTH - 1) { newPosition %= LENGTH - 1 } 
        
    if (newPosition < 0) { newPosition = (newPosition % (LENGTH - 1)) + LENGTH - 1 }    
    
    if (oldPosition < newPosition) {
    
        for (let pos = oldPosition; pos < newPosition; pos++) { TRANSLATED[pos] = TRANSLATED[pos + 1] }        
    }
    else {
    
        for (let pos = oldPosition; pos > newPosition; pos--) { TRANSLATED[pos] = TRANSLATED[pos - 1] }
    } 
    
    TRANSLATED[newPosition] = n
}    

main()

