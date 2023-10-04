"use strict"

// solving the puzzle takes (my computer) 0.20s

/*
// function findWinner is good but is too much expensive/slow
// for a big number of elves

function findWinner(thisAmount) {
    const list = [ ]
    for (let n = 1; n <= thisAmount; n++) { list.push(n) }
    while (list.length > 1) {
        const oppositeIndex = Math.floor(list.length / 2)
        list.splice(oppositeIndex, 1)
        list.push(list.shift())
    }
    return list[0]
}
// running function study we discover a mathematical pattern
// that can be exploited, it involves powers of 3

function study() {
    const amount = 3000
    for (let n = 1; n <= 3000; n++) { 
        console.log("when amount is", n, "  winner is", findWinner(n))
    }
}
*/

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

