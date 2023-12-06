"use strict"

// solving the puzzle takes (my computer) 0.028s

const CARDS = { }


function main() {

    processInput()
    
    for (const card of Object.values(CARDS)) { 
    
        setValueOfCard(card) 

        createCopies(card)    
    }        
     
    let sum = 0 
    
    for (const card of Object.values(CARDS)) { sum += card.amount }
    
    console.log("the answer is", sum)    
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    let n = 0
    
    for (const line of lines) { 
        
        n += 1
    
        const card = { "number": n, "winners": [ ], "myNumbers": [ ], "wins": 0, "amount": 1 }
        
        CARDS[n] = card

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

function setValueOfCard(card) {

    for (const winner of card.winners) {
        
        if (card.myNumbers.includes(winner)) { card.wins += 1 }
    }
}

function createCopies(card) {

    if (card.wins == 0) { return }

    const start = card.number + 1

    const end = card.number + card.wins
    
    const extra = card.amount
    
    for (let index = start; index <= end; index++) {
    
        const target = CARDS[index]
        
        if (target == undefined) { return }
        
        target.amount += extra
    }
}

main()

