"use strict"

// solving the puzzle takes (my computer) 0.080s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const elves = parseInt(rawText)
        
    console.log("elf number is", findWinner(elves))
}

function findWinner(numberOfElves) {

    let array = new Uint32Array(numberOfElves) 

    for (let index = 0; index < numberOfElves; index++) { array[index] = index + 1 } // first elf is '1'

    let startAfter = 0
    
    while (true) {
    
        const obj = processArray(array, startAfter)
       
        numberOfElves = obj.remain
        
        startAfter = obj.lastThief
        
        if (numberOfElves == 1) { break }       
        
        array = cloneArrayWithoutBlanks(numberOfElves, array)
    }

    for (const elf of array) { if (elf != 0) { return elf } }
}

function cloneArrayWithoutBlanks(amount, arrayA) { // non-blank-cloning is *EXTREMELY* faster
                                                   // than filtering blanks in the source

    const arrayB = new Uint32Array(amount)
    
    let indexB = -1
    
    for (let indexA = 0; indexA < arrayA.length; indexA++) {
    
        if (arrayA[indexA] == 0) { continue }
            
        indexB += 1
            
        arrayB[indexB] = arrayA[indexA]
    }
    
    return arrayB
}

function processArray(array, startAfter) { // array of elves

    let excludedElves = 0
    
    let lastThief = 0 // not the index

    for (let thiefIndex = 0; thiefIndex < array.length; thiefIndex++) {
    
        const thief = array[thiefIndex]

        if (thief == 0) { // excluded elf
        
            // if function doesn't return now, the easy and fast formula for
            // finding targetIndex fails (because the current *excluded elf*
            // is not between the next valid thief and its target, but
            // counts in excludedElves)
        
            return { "remain": array.length - excludedElves, "lastThief": lastThief }
        } 
        
        if (thief <= startAfter) { continue } // MUST COME AFTER THE thief==0 TEST

        //
        
        lastThief = thief

        const activeElves = array.length - excludedElves
        
        const distance = Math.floor(activeElves / 2)

        let targetIndex = thiefIndex + distance + excludedElves
        
        if (targetIndex > array.length - 1) { targetIndex -= array.length }
        
        array[targetIndex] = 0

        excludedElves += 1        
    }
    
    return { "remain": array.length - excludedElves, "lastThief": 0 }
}

main()

