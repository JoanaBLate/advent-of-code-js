"use strict"

// solving the puzzle takes (my computer) 0.20s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const elves = parseInt(rawText)
        
    console.log("elf number is", findElfNumber(elves))
}

function findElfNumber(elves) {

    let powOf3 = 1 

    while (powOf3 * 3 <= elves) { powOf3 *= 3 }

    if (powOf3 == elves) { return powOf3 }
    
    if (elves <= 2 * powOf3) { return elves - powOf3 }

    return (2 * elves) - (3 * powOf3)
}

main()

