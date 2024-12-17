"use strict"

// solving the puzzle takes (my computer) 0.030s

const instructions = [ ]

const LENGTH = 10007

var deckA = new Uint16Array(LENGTH)
var deckB = new Uint16Array(LENGTH)


function main() {

    processInput()
    
    for (let n = 0; n < LENGTH; n++) { deckA[n] = n }
       
    shuffle()
    
    for (let n = 0; n < LENGTH; n++) { 
    
        if (deckA[n] == 2019) { console.log("the answer is", n); return }
    }
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { instructions.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function shuffle() {

    for (const inst of instructions) {
    
        if (inst == "deal into new stack") { dealIntoNewStack(); continue }
    
        if (inst.startsWith("deal with increment")) { 
        
            const value = parseInt(inst.split(" ").pop())
            
            dealWithIncrement(value)
            continue 
        }
        
        if (inst.startsWith("cut")) { 
        
            const value = parseInt(inst.split(" ").pop())
            
            cut(value)
            continue 
        }
    }
}

function exchangeDecks() {

    const temp = deckA
    
    deckA = deckB
    
    deckB = temp
}

function dealIntoNewStack() { 

    const last = LENGTH - 1
    
    for (let n = 0; n <= last; n++) { deckB[n] = deckA[last - n] }

    exchangeDecks()
}

function cut(amount) {  

    while (amount < 0) { amount += LENGTH }

    const offset = LENGTH - amount
    
    for (let n = 0; n < LENGTH; n++) { 
    
        if (n < amount) { deckB[n + offset] = deckA[n] } else { deckB[n - amount] = deckA[n] }
    }
    
    exchangeDecks()
}

function dealWithIncrement(increment) {

    // virginity must be checked!!! - or else some slot(s) receive(s) more than one card!!
        
    /*  THIS FORMULA IS CRAP:        
        
        newIndex = previousIndex * increment % length  
        
        for example, with length==10 and increment==4,
        
        first item is 5 (but SHOULD BE 0)!!!         
    */ 
    
    const virgin = 65535 // 65535 matches -1 for signed arrays
    
    for (let n = 0; n < LENGTH; n++) { deckB[n] = virgin } 
    
    let previous = -increment
   
    for (let n = 0; n < LENGTH; n++) { 
    
        let index = previous + increment
    
        while (true) {
        
            if (index >= LENGTH) { index -= LENGTH }
            
            if (deckB[index] != virgin) { index += 1; continue }
        
            break
        }
    
        deckB[index] = deckA[n]
        previous = index
    }

    exchangeDecks()
}

main()

