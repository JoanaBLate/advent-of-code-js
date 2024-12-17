"use strict"

// solving the puzzle takes (my computer) 0.730s

const input = Deno.readTextFileSync("input.txt").trim()

const DECK_A = [ ]

const DECK_B = [ ]


function main() {

    processInput()
    
    const winner = playGame(DECK_A, DECK_B)
 
    console.log("the answer is", countScore(winner.deck))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")
    
    processInput2(parts.shift(), DECK_A)
    processInput2(parts.shift(), DECK_B)
}

function processInput2(text, deck) {
        
    const lines = text.split("\n")
    
    lines.shift()
    
    for (const line of lines) { deck.push(parseInt(line)) }
}

///////////////////////////////////////////////////////////

function countScore(deck) {

    let score = 0
    
    let factor = deck.length
    
    for (const card of deck) {
    
        score += card * factor
        
        factor -= 1     
    }
    
    return score
}

///////////////////////////////////////////////////////////

function playGame(deckA, deckB) {

    const memoryA = { }
    const memoryB = { }

    while (true) {
        
        const strA = deckA.join(",")
        const strB = deckB.join(",")
        
        if (memoryA[strA]  &&  memoryB[strB]) { return createResult("A", deckA) }
        
        memoryA[strA] = true
        memoryB[strB] = true
        
        const a = deckA.shift()
        const b = deckB.shift()
    
        let winner = "A"
        
        if (a > deckA.length  ||  b > deckB.length) { // regular combat
        
            if (b > a) { winner = "B" }
        }
        else { // recursive combat
           
            const recursiveDeckA = deckA.slice(0, a)
            const recursiveDeckB = deckB.slice(0, b)
            
            winner = playGame(recursiveDeckA, recursiveDeckB).name        
        }
            
        if (winner == "A") { deckA.push(a); deckA.push(b) } else { deckB.push(b); deckB.push(a) }    
    
        if (deckA.length == 0) { return createResult("B", deckB) }
        if (deckB.length == 0) { return createResult("A", deckA) }
    }
}

function createResult(name, deck) {

    return { "name": name, "deck": deck }
}

main()

