"use strict"

// solving the puzzle takes (my computer) 0.030s

const myTicket = [ ]

const otherTickets = [ ]
    
const fields = [ ]

const invalids = [ ]

const rules = { }


function main() {

    processInput()
    
    for (const ticket of otherTickets) { checkTicket(ticket) }
    
    let sum = 0
    
    for (const invalid of invalids) { sum += invalid }
     
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")
    
    const _rules = parts.shift().trim()
    
    const _myTicket = parts.shift().trim()
    
    const _otherTickets = parts.shift().trim()
    
    //   
        
    for (const line of _rules.split("\n")) {
    
        const segments = line.split(":")
        
        const key = segments.shift()
        
        fields.push(key)
        
        const ranges = segments.shift().trim().split(" or ")
        
        const head = ranges.shift()
        const tail = ranges.shift()
        
        const hParts = head.split("-")
        const tParts = tail.split("-")
        
        const obj = { "a": 0, "b": 0, "c": 0, "d": 0 }

        obj.a = parseInt(hParts.shift())
        obj.b = parseInt(hParts.shift())

        obj.c = parseInt(tParts.shift())
        obj.d = parseInt(tParts.shift())        
        
        rules[key] = obj
    }
    
    //
    
    const mtLines = _myTicket.split("\n")
    
    mtLines.shift()
    
    const mtTokens = mtLines.shift().trim().split(",")
    
    for (const mtToken of mtTokens) { myTicket.push(parseInt(mtToken)) }
    
    //
    
    const otLines = _otherTickets.split("\n")
    
    otLines.shift()
    
    for (const line of otLines) { 
        
        const ticket = [ ] 
    
        const otTokens = line.trim().split(",")
        
        for (const otToken of otTokens) { ticket.push(parseInt(otToken)) }
        
        otherTickets.push(ticket)
    }
}

function checkTicket(ticket) {

    for (const number of ticket) {
    
        let good = false
        
        for (const field of fields) {
    
            const data = rules[field]
            
            if (number >= data.a  &&  number <= data.b) { good = true; break }
            if (number >= data.c  &&  number <= data.d) { good = true; break }
        }

        if (good == true) { continue }
        
        invalids.push(number)
    }
}

main()

