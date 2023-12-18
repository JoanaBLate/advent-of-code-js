"use strict"

// solving the puzzle takes (my computer) 0.040s

const DATA = [ ]


function main() {

    processInput()

    let sum = 0    
    
    for (const data of DATA) { 
            
        sum += countArrangements(data.string, data.blueprint)
    } 
    
    console.log("the answer is", sum)       
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")

    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const string = parts.shift()
        
        const blueprint = [ ]
        
        for (const token of parts.shift().split(",")) { blueprint.push(parseInt(token)) }        
        
        DATA.push({ "string": string, "blueprint": blueprint })
    }
}

function tokenize(source) { // excludes dots ('.')

    const tokens = [ ]
    
    let token = ""
    
    for (const c of source) { 
    
        if (c != ".") { token += c; continue } // joins '#' with '?'
        
         if (token != "") { tokens.push(token); token = "" }
    }
    
    if (token != "") { tokens.push(token) }
    
    return tokens
}

function showScheme(scheme) {

    for (const sharp of scheme) {

        let s = "#".repeat(sharp.size) + " (size " + sharp.size + ") (positions " + sharp.positions.join() + ")  paths:"
        
        console.log(s, sharp.paths)   
    }
}

///////////////////////////////////////////////////////////

function countArrangements(string, blueprint) {
    
    const tokens = tokenize(string)
    
    const map = tokens.join(".")
    
    const scheme =  [ ]
        
    for (const size of blueprint) { scheme.push({ "size": size, "positions": [ ], "paths": { } }) }   
    
    findLeftMostPositions(map, scheme)
        
    findRightMostPositions(map, scheme)

    findIntermediaryPositions(map, scheme)

    fixFirstSharp(map, scheme[0])

    fixLastSharp(map, scheme.at(-1))
    
    resetArrangements(scheme)
    
    const result = countGoodArrangements(map, scheme)

    /*/
            MONITORING SECTION
            ==================
       
        console.log("")
    
        const s = "0123456789".repeat(15)
        console.log(s.substr(0, map.length)) 
        
        console.log(map) 
    
        const sharps = [ ]        
        for (const size of blueprint) { sharps.push("#".repeat(size)) }
        console.log(sharps.join(".")) 

        showScheme(scheme)
        
        console.log("THIS RESULT:", result, "\n")
    /*/
            
    return result
}

///////////////////////////////////////////////////////////

function positionIsGood(map, start, size) {
    
    const end = start + size - 1
    
    if (end >= map.length)     { return false }

    if (map[start - 1] == "#") { return false }

    if (map[end + 1] == "#")   { return false }

    for (let n = start; n <= end; n++) { if (map[n] == ".") { return false } }

   return true
}

///////////////////////////////////////////////////////////

function findLeftMostPositions(map, scheme) { 

    let base = 0 
  
    for (const sharp of scheme) {
         
         const position = findLeftMostPosition(map, sharp, base)
    
         base = position + sharp.size + 1 // '+ 1' for the intermediary dot
     }
}

function findLeftMostPosition(map, sharp, base) {
    
    for (let n = base; n < map.length; n++) {
    
        if (positionIsGood(map, n, sharp.size)) { sharp.positions.push(n); return n }
    }
}

function findRightMostPositions(map, scheme) { 

    let base = map.length - scheme.at(-1).size
  
    for (let n = scheme.length - 1; n > -1; n--) {
    
         const sharp = scheme[n]
                 
         const position = findRightMostPosition(map, sharp, base)
         
         base = position - 2 // '- 2': -1 for stepping beside, -1 for the intermediary dot
     }
}

function findRightMostPosition(map, sharp, base) {
        
    for (let n = base; n > -1; n--) {
    
        if (! positionIsGood(map, n, sharp.size)) { continue }
        
        if (sharp.positions.includes(n)) { return n } // necessary!
        
        sharp.positions.push(n)
        
        return n
    }
}

function findIntermediaryPositions(map, scheme) { 

    for (const sharp of scheme) { findIntermediaryPositionsFor(map, sharp) }
}

function findIntermediaryPositionsFor(map, sharp) { 

    const base = sharp.positions[0] + 1
    
    const off = sharp.positions.pop()
    
    for (let n = base; n < off; n++) {
    
        if (positionIsGood(map, n, sharp.size)) { sharp.positions.push(n) }
    }
    
    sharp.positions.push(off)
}

///////////////////////////////////////////////////////////

function fixFirstSharp(map, sharp) {
    
    const index = map.indexOf("#")
    
    if (index == -1) { return }
    
    while (sharp.positions.at(-1) > index) { sharp.positions.pop() }
}

function fixLastSharp(map, sharp) {
    
    const index = map.lastIndexOf("#")
    
    if (index == -1) { return }
    
    while (sharp.positions[0] + sharp.size - 1 < index) { sharp.positions.shift() }
}


///////////////////////////////////////////////////////////

function resetArrangements(scheme) {

    for (const sharp of scheme) { 
    
        const value = (sharp == scheme[0]) ? 1 : 0
        
        for (const position of sharp.positions) { sharp.paths[position] = value }
    }
}

function countGoodArrangements(map, scheme) {

    for (let n = 0; n < scheme.length - 1; n++) { 

        const current = scheme[n]
        
        const next = scheme[n + 1]
        
        for (const currentPosition of current.positions) {
        
            const minNextPosition = currentPosition + current.size + 1 
            
            const nextIndex = map.indexOf("#", minNextPosition)
            
            const maxNextPosition = (nextIndex == -1) ? map.length - 1 : nextIndex

            for (const nextPosition of next.positions) {
            
                if (nextPosition >= minNextPosition  &&  nextPosition <= maxNextPosition) {
                
                    next.paths[nextPosition] += current.paths[currentPosition]
                }
            }
        }
    }
    
    const lastSharp = scheme.at(-1)
    
    let sum = 0
    
    for (const value of Object.values(lastSharp.paths)) { sum += value }
    
    return sum
}

main()

