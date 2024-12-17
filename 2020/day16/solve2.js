"use strict"

// solving the puzzle takes (my computer) 0.035s

const myTicket = [ ]

const otherTickets = [ ]

const rules = { }
    
const fields = [ ]


function main() {

    processInput()
    
    excludeBadTickets()
    
    grabMatches()
    
    purgeMatches()
        
    console.log("the answer is", calcResult())
}

///////////////////////////////////////////////////////////

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
        
        const obj = { "a": 0, "b": 0, "c": 0, "d": 0, "matches": [ ], "done": false }

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

///////////////////////////////////////////////////////////

function excludeBadTickets() {

    for (let n = otherTickets.length - 1; n > -1; n--) { maybeExcludeBadTicket(n) }
}

function maybeExcludeBadTicket(index) {

    const ticket = otherTickets[index]

    for (const number of ticket) {
    
        let good = false
        
        for (const field of fields) {
    
            const data = rules[field]
            
            if (number >= data.a  &&  number <= data.b) { good = true; break }
            if (number >= data.c  &&  number <= data.d) { good = true; break }
        }

        if (good == true) { continue }
        
        otherTickets.splice(index, 1); return
    }
}

///////////////////////////////////////////////////////////

function grabMatches() {

    for (const field of fields) { grabMatchesFor(field) }
}

function grabMatchesFor(field) {
    
    const possibles = { }
    
    const impossibles = { }

    const data = rules[field]
    
    for (const ticket of otherTickets) {
    
        for (let index = 0; index < ticket.length; index++) {
        
            const number = ticket[index]
            
            let good = false
            
            if (number >= data.a  &&  number <= data.b) { good = true }
            if (number >= data.c  &&  number <= data.d) { good = true }
            
            if (good) { possibles[""+index] = true } else { impossibles[""+index] = true }
        }            
    }
    
    for (const slot of Object.keys(possibles)) {
    
        if (impossibles[slot]) { continue }
        
        data.matches.push(parseInt(slot))
    }
}

///////////////////////////////////////////////////////////

function purgeMatches() {

    while (true) {
    
        const match = findUniqueMatch()
        
        if (match == null) { return }
        
        purgeMatch(match)    
    }
}

function findUniqueMatch() {

    for (const field of fields) { 
    
        const data = rules[field]
        
        if (data.done) { continue }
        
        if (data.matches.length == 1) { data.done = true; return data.matches[0] }    
    }
    
    return null
}

function purgeMatch(match) {

    for (const field of fields) { 
    
        const data = rules[field]
        
        if (data.done) { continue }
        
        const index = data.matches.indexOf(match)
        
        if (index != -1) { data.matches.splice(index, 1) }    
    }
}

///////////////////////////////////////////////////////////

function calcResult() {

    let result = 1
    
    for (const field of fields) {

        if (! field.startsWith("departure")) { continue }
    
        const data = rules[field]
        
        const slot = data.matches[0]
        
        result *= myTicket[slot]
    }
    return result
}

main()

