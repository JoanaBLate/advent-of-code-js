"use strict"

// solving the puzzle takes (my computer) 0.060s

const fabric = [ ] // 2000 x 2000 grid


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    for (let n = 0; n < 2000; n++) { fabric.push(new Uint8Array(2000)) }
    
    for (const line of input.split("\n")) { processThisInput(line.trim()) }
         
    console.log("the answer is", countOfConflictPoints())
}

function processThisInput(line) {
   
    const tokens = line.split(" ")
 
    tokens.shift() // id
    tokens.shift() // @
    
    const segmentA = tokens.shift()
    const segmentB = tokens.shift()
 
    const partsA = segmentA.split(",")
    const partsB = segmentB.split("x")
    
    const left = parseInt(partsA.shift())
    const top  = parseInt(partsA.shift())
 
    const width  = parseInt(partsB.shift())
    const height = parseInt(partsB.shift())
 
    for (let row = top; row < top + height; row++) {

        for (let col = left; col < left + width; col++) {
 
            const data = fabric[row][col]

            fabric[row][col] = (data == 0) ? 1 : 2
        }
    }
}

function countOfConflictPoints() {

    let count = 0
    
    for (let row = 0; row < 2000; row++) {

        for (let col = 0; col < 2000; col++) {
 
            if (fabric[row][col] == 2) { count += 1 }
        }
    }
    return count
}
    
main()

