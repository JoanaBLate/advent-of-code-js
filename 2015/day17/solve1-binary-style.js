"use strict"

// solving the puzzle in binary style takes (my computer) 0.380s

const LIQUID = 150
    
const bottles = [ ] // "bottle" is shorter than "container"

var total = 0

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { bottles.push(parseInt(rawLine)) }
    
    // The puzzles says that two bottles of the same capacity are considered different.
    // So, we are going to use the POSITION of the bottle in the list for its id.
    
    // We can think the list of bottles as an array of booleans (filled bottle vs not filled bottle).
    // For example: [ true, false, false, true, true... ] or [ 1, 0, 0, 1, 1...]
    // We can associate a binary number to each sequence (10011...).
    // And we can work with the decimalrepresentatoin of this number.
    
    const off = Math.pow(2, bottles.length)
    
    for (let n = 0; n < off; n++) { trySequence(n) }
    
    console.log("total different ways is", total)
}

function trySequence(decimal) {

    const len = bottles.length

    const binary = decimal.toString(2)
    
    const code = binary.padStart(len, "0")
    
    let liquid = 0
    
    for (let i = 0; i < len; i++) {
    
        if (code[i] == "1") { liquid += bottles[i] }
    }    

    if (liquid == LIQUID) { total += 1 }
}

main()

