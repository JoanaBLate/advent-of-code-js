"use strict"

// too slow *DON'T* run this //

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const elves = parseInt(rawText)
        
    console.log("elf number is", findElfNumber(elves))
}

function findElfNumber(elves) { // **TOO SLOW**  for big numbers

    const list = [ ]
    
    for (let n = 1; n <= elves; n++) { list.push(n) }
    
    while (list.length > 1) {
    
        const oppositeIndex = Math.floor(list.length / 2)
    
        list.splice(oppositeIndex, 1)
    
        list.push(list.shift())
    }
    
    return list[0]
}

main()

