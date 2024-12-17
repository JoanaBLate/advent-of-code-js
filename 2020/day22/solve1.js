"use strict"

// solving the puzzle takes (my computer) 0.024s

const input = Deno.readTextFileSync("input.txt").trim()

const deckA = [ ]

const deckB = [ ]


function main() {

    processInput()
        
    let winnerDeck = null
 
    while (true) {
    
        playRound()
        
        if (deckA.length == 0) { winnerDeck = deckB; break }
        if (deckB.length == 0) { winnerDeck = deckA; break }    
    }
 
    console.log("the answer is", countScore(winnerDeck))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")
    
    processInput2(parts.shift(), deckA)
    processInput2(parts.shift(), deckB)
}

function processInput2(text, deck) {
        
    const lines = text.split("\n")
    
    lines.shift()
    
    for (const line of lines) { deck.push(parseInt(line)) }
}

///////////////////////////////////////////////////////////

function playRound() {

    const a = deckA.shift()
    const b = deckB.shift()
    
    if (a > b) { deckA.push(a); deckA.push(b) } else { deckB.push(b); deckB.push(a) }
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

main()

