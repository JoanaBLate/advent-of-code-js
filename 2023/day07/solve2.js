"use strict"

// solving the puzzle takes (my computer) 0.033s

const DATA = [ ]

const STRENGTHS = "AKQT98765432J"
const strengths = "abcdefghijklm".split("").reverse().join("")

const highcards = [ ]
const onepairs = [ ]
const twopairs = [ ]
const threesomes = [ ]
const fullhouses = [ ]
const foursomes = [ ]
const fivesomes = [ ]

const allLists =  [ highcards, onepairs, twopairs, threesomes, fullhouses, foursomes, fivesomes ]


function main() {

    processInput()
        
    for (const list of allLists) { 
    
        for (let n = 0; n < STRENGTHS.length; n++) { list.push([ ]) } // one sublist for each label
    }
    
    for (const data of DATA) { 
    
        const kind = getKind(data) 
    
        if (kind == "highcard")  { placeData(data, highcards);  continue }    
        if (kind == "onepair")   { placeData(data, onepairs);   continue }      
        if (kind == "twopairs")  { placeData(data, twopairs);   continue }            
        if (kind == "threesome") { placeData(data, threesomes); continue }    
        if (kind == "fullhouse") { placeData(data, fullhouses); continue }          
        if (kind == "foursome")  { placeData(data, foursomes);  continue }          
        if (kind == "fivesome")  { placeData(data, fivesomes);  continue } 
    }
    
    for (const list of allLists) { 
    
        for (const sublist of list) { sort(sublist) }
    }

    let totalWinnings = 0
    
    let rank = 0 // base one
    
    for (const list of allLists) { 
    
        for (const sublist of list) {
        
            for (const data of sublist) {
            
                rank += 1
                
                totalWinnings += rank * data.bid               
            }
        } 
    }
    
    console.log("the answer is", totalWinnings)   
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const original = tokens.shift()
        
        const hand = convertHand(original)
        
        const bid = parseInt(tokens.shift())
        
        DATA.push({ "hand": hand, "bid": bid })
    }
}

function convertHand(original) { // for a faster sorting

    let converted = ""
    
    for (const char of original) {
    
        const index = STRENGTHS.indexOf(char)
        
        converted += strengths[index]
    }
    return converted
}

///////////////////////////////////////////////////////////

function getKind(data) {

    let jokers = 0
    
    const cards = { }
    
    for (const char of data.hand) {
    
        if (char == "a") { jokers += 1; continue } // hand is already converted
        
        if (cards[char] == undefined) { cards[char] = 0 }
        
        cards[char] += 1
    }
    
    const labels = Object.keys(cards)

    if (jokers == 0) { return getKindNoJoker(cards, labels) }
    
    let greatest = 0
    
    for (const value of Object.values(cards)) { if (value > greatest) { greatest = value } }
    
    for (const label of labels) { if (cards[label] == greatest) { cards[label] += jokers; break } }
    
    return getKindNoJoker(cards, labels)
}
    
function getKindNoJoker(cards, labels) {
    
    if (labels.length == 5) { return "highcard" }

    if (labels.length == 4) { return "onepair" }
    
    if (labels.length == 3) { 
    
        if (cards[labels[0]] == 3) { return "threesome" }
        if (cards[labels[1]] == 3) { return "threesome" }
        if (cards[labels[2]] == 3) { return "threesome" }

        return "twopairs" 
    }
    
    if (labels.length == 2) { 
    
        if (cards[labels[0]] == 4) { return "foursome" }
        if (cards[labels[1]] == 4) { return "foursome" }
        if (cards[labels[2]] == 4) { return "foursome" }
        if (cards[labels[3]] == 4) { return "foursome" }

        return "fullhouse" 
    }
    
    return "fivesome"  // also works for 5 jokers (empty cards, empty labels)
}

///////////////////////////////////////////////////////////

function placeData(data, list) {

    const index = STRENGTHS.length - 1 - strengths.indexOf(data.hand[0])
    
    list[index].push(data)
}

function sort(list) {

    let n = -1
    
    while (true) {

        n += 1
        
        const current = list[n]
                
        const next = list[n + 1]
        
        if (next == undefined) { return }
        
        if (current.hand > next.hand) {

            list[n] = next
            
            list[n + 1] = current
            
            n = -1
        }
    }
}

main()

