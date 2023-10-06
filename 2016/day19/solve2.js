"use strict"

// solving the puzzle takes (my computer) 0.075s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const elves = parseInt(rawText)
        
    console.log("elf number is", findWinner(elves))
}

function findWinner(numberOfElves) {

    let array = new Uint32Array(numberOfElves) 

    for (let index = 0; index < numberOfElves; index++) { array[index] = index + 1 } // first elf is '1'
    
    while (true) {
    
        numberOfElves = processArray(array)
       
        if (numberOfElves == 1) { break }       
        
        array = cloneArrayWithoutBlanks(numberOfElves, array)
    }

    for (const elf of array) { if (elf != 0) { return elf } }
}

function cloneArrayWithoutBlanks(amount, arrayA) {
    // non-blank-cloning is *EXTREMELY* faster than filtering blanks in the source

    const arrayB = new Uint32Array(amount)
    
    let indexB = -1
    
    for (let indexA = 0; indexA < arrayA.length; indexA++) {
    
        if (arrayA[indexA] == 0) { continue }
            
        indexB += 1
            
        arrayB[indexB] = arrayA[indexA]
    }
    
    return arrayB
}

function processArray(array) { // array of elves

    let excludedTargets = 0
    
    let excludedThiefs = 0
    
    for (let thiefIndex = 0; thiefIndex < array.length; thiefIndex++) {
    
        const thief = array[thiefIndex]

        if (thief == 0) { excludedThiefs += 1; continue }

        const activeElves = array.length - excludedTargets
        
        const distance = Math.floor(activeElves / 2)

        let targetIndex = thiefIndex + distance + excludedTargets - excludedThiefs
        
        if (targetIndex >= array.length) { targetIndex -= array.length }
        
        array[targetIndex] = 0

        excludedTargets += 1        
    }
    
    return array.length - excludedTargets
}

main()

