"use strict"

// solving the puzzle takes (my computer) 0.030s

const map = [ ]

var height = 0
var width = 0

const allNumbers = [ ] //  objects 

const candidates = { }


function main() {

    processInput()
    
    fillAllNumbers()
    
    fillCandidates()
    
    let sum = 0
    
    for (const key of Object.keys(candidates)) {
    
        const neighbors = candidates[key]
        
        if (neighbors.length != 2) { continue }
    
        const ratio = neighbors[0] * neighbors[1]
    
        sum += ratio
    }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
   
    for (const line of lines) { map.push(line.trim()) }
    
    height = map.length
    width = map[0].length
}

///////////////////////////////////////////////////////////

function fillAllNumbers() {

    for (let row = 0; row < height; row++) { fillAllNumbersByRow(row) }
}

function fillAllNumbersByRow(row) {

    const line = map[row]

    let number = ""
    
    let start = -1
    
    let col = -1
    
    while (true) {

        if (col == width - 1) { // line has ended
        
            if (number != "") { allNumbers.push(createNumberObj(row, start, number)) }
            
            return
        }
        
        col += 1
        
        const c = line[col]
        
        if (c >= "0"  &&  c <= "9") { 
        
            if (number == "") { start = col }
            
            number += c
            
            continue 
        }
        
        if (number == "") { continue }
        
        allNumbers.push(createNumberObj(row, start, number))
        
        number = ""
    }
}

function createNumberObj(row, start, number) {

    const end = start + number.length - 1
    
    return { "row": row, "colA": start, "colB": end, "number": parseInt(number) }
}

///////////////////////////////////////////////////////////

function fillCandidates() {

    for (const numberObj of allNumbers) { findCandidate(numberObj) }
}

function findCandidate(obj) {

    for (let row = obj.row - 1; row <= obj.row + 1; row++) {

        for (let col = obj.colA - 1; col <= obj.colB + 1; col++) {

            findCandidateAt(row, col, obj.number)
        }
    }
}

function findCandidateAt(row, col, number) {

    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > height - 1) { return }
    if (col > width  - 1) { return }

    const c = map[row][col]
    
    if (c != "*") { return }
    
    const key = row + "~" + col
    
    if (candidates[key] == undefined) { candidates[key] = [ ] }
    
    candidates[key].push(number)
}

main()

