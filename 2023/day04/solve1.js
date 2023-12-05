"use strict"

// solving the puzzle takes (my computer) 0.028s

const CARDS = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const card of CARDS) { sum += valueOfCard(card) }        
     
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    for (const c of input) {
    
        if (c == "\n") { continue }
        
        if (c < " ") { l(c.charCodeAt(0),"<<<<<<<<");Deno.exit()}
    
    
    }
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const card = { "winners": [ ], "myNumbers": [ ], "value": 0 }
        
        CARDS.push(card)

        const parts = line.split("|")
        
        const myNumbers = parts.pop().trim().split(" ")
        
        const winners = parts.pop().split(":").pop().trim().split(" ")
        
        for (const s of winners) {
        
            const n = parseInt(s)
            
            if (! isNaN(n)) { card.winners.push(n) }        
        }
        
        for (const s of myNumbers) {
        
            const n = parseInt(s)
            
            if (! isNaN(n)) { card.myNumbers.push(n) }        
        }
    }
}

function valueOfCard(card) {

    let wins = 0
        
    for (const winner of card.winners) {
        
        if (card.myNumbers.includes(winner)) { wins += 1 }
    }
    
    if (wins == 0) { return 0 }
    
    card.value = Math.pow(2, wins - 1)

    return card.value
}

main()

