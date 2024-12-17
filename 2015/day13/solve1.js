"use strict"

// solving the puzzle takes (my computer) 0.106s

const people = [ ]
   
const data = { } // person~neighbor: happiness

var best = -999999999
    
function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) {

        const tokens = rawLine.trim().split(" ")
            
        const person = tokens.shift()
        
        tokens.shift() // would

        const verb = tokens.shift() // gain or lose
        const signal = verb == "gain" ? "+1" : "-1"
        const value = signal * parseInt(tokens.shift())

        tokens.shift() // happiness 
        tokens.shift() // units 
        tokens.shift() // by 
        tokens.shift() // sitting
        tokens.shift() // next
        tokens.shift() // to
        
        const neighbor = tokens.shift().replace(".", "")
        
        if (! people.includes(person))   { people.push(person) }
        
        data[person + "~" + neighbor] = value
    }
    
    for (const person of people) { fillTable([person]) }
   
    console.log("total change in happiness is", best)
}

function fillTable(table) { // recursive function (calls it self)

    if (table.length == people.length) { tryThisTable(table); return } // table was complete
    
    for (const person of people) {
    
        if (table.includes(person)) { continue }
        
        const newTable = table.slice() // we must create an exclusive node for storing data of the new branch
        
        newTable.push(person)
        
        fillTable(newTable)
    }
}

function tryThisTable(table) {

    let happiness = 0
    
    const off = table.length
    
    for (var i = 0; i < off; i++) { happiness += calcHisHappiness(table, i) }
    
    if (happiness > best) { best = happiness }
}

function calcHisHappiness(table, i) {

    const person = table[i]
    
    const maxIndex = table.length - 1

    let previousIndex = i - 1
    if (previousIndex < 0) { previousIndex = maxIndex }
    
    let nextIndex = i + 1
    if (nextIndex > maxIndex) { nextIndex = 0 }
    
    const previousNeighbor = table[previousIndex]
    const nextNeighbor = table[nextIndex]
    
    const previousHappiness = data[person + "~" + previousNeighbor]
    const nextHappiness = data[person + "~" + nextNeighbor]
    
    return previousHappiness + nextHappiness
}

main()

