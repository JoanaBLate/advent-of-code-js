"use strict"

// solving the puzzle through recursive style takes (my computer) 0.063s

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
    // For example: [ true, false, false, true, true... ] 
    
    fillBottles([ true ])
    fillBottles([ false ])
    
    console.log("total different ways is", total)
}

function fillBottles(sequence) { // recursive function (calls itself)

    const liquid = calcLiquid(sequence)
    
    if (liquid > 150) { return }
    
    if (sequence.length == bottles.length) {
    
        if (liquid == 150) { total += 1 }
        return    
    }

    const newSequenceA = sequence.slice() // we must create a new sequence for the new branch
    
    newSequenceA.push(true)
    
    fillBottles(newSequenceA)
    
    const newSequenceB = sequence.slice() // we must create a new sequence for the new branch
    
    newSequenceB.push(false)
    
    fillBottles(newSequenceB)
}

function calcLiquid(sequence) {
    
    let liquid = 0
    
    let index = -1
    
    for (const bool of sequence) {
    
        index += 1
        
        if (sequence[index]) { liquid += bottles[index] }
    }    

    return liquid
}

main()

