"use strict"

// solving the puzzle takes (my computer) 0.550s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const totalPresents = parseInt(rawText)

    // We need an array to represent the houses. It cannot be infinite. 
    // Each house receives, at least, 10 presents:
    
    const _maxHouses = Math.ceil(totalPresents / 10) // granted to have enough houses
    
    // Santa counts the houses starting from one (not zero). In order to easy the code we 
    // will do the same, despising the zero position, and adding one more item as compensation:

    const maxHouses = _maxHouses + 1

    const houses = new Array(maxHouses)

    houses.fill(0) 
    
    
    const maxElves = maxHouses // granted: no elf will be missing,
                               // the first elf alone is enough to deliver all the presents

    for (let elf = 1; elf <= maxElves; elf++) { // taking elf by elf
        
        for (let house = elf; house <= maxHouses; house += elf) { // taking only the houses that match the elf step
        
            houses[house] += 10 * elf
        }
    }

    for (let house = 1; house <= maxHouses; house++) { // from the lowest house to the highest house

        if (houses[house] >= totalPresents) { console.log("lowest house number is", house); break }
    }
}

main()

