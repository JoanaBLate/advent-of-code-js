"use strict"

// solving the puzzle takes (my computer) 0.085s

/*
    some notes:
    
         it is a waste of time to translate the input data into nodes
         because often you have have to merge things that are not even
         in the same branch (of nodes) 
         
         never the max depth is greater than 4 (depth 4 means the pair is of kind [number, number])
         
         the purpose of the explosion is to flatten the data
*/

const input =  Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
  
    let data = DATA.shift()
    
    while (DATA.length != 0) {
        
        data.unshift("[")

        data.push(",")
    
        const next = DATA.shift()
        
        for (const item of next) { data.push(item) }
        
        data.push("]")

        data = processData(data)
    }
    
    console.log("the answer is", calcMagnitude(data))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split("")
        
        DATA.push(tokens) 
    }
}

///////////////////////////////////////////////////////////

function processData(data) {

    while (true) {

        const resultExplode = tryExplode(data)
        
        data = resultExplode.data
        
        if (resultExplode.changed) { continue }
        
        const resultSplit = trySplit(data)
        
        data = resultSplit.data
        
        if (resultSplit.changed) { continue }
        
        return data
    }
}

///////////////////////////////////////////////////////////

function tryExplode(data) {

    let depth = 0
    
    let left = [ ]
    
    while (data.length != 0) {
    
        const c = data.shift()
        
        left.push(c)
                
        if (c == ",") { continue }
        
        if (c == "]") { depth -= 1; continue }
        
        if (c != "[") { continue } // number
        
        if (depth < 4)  { depth += 1; continue } // [
        
        // maybe explode 
        
        if (data[1] != ",") { continue }
        if (data[3] != "]") { continue }
        
        // exploding  
        
        left.pop() // removing last [
    
        const a = parseInt(data.shift())
        
        data.shift() // ,
        
        const b = parseInt(data.shift())
        
        data.shift() // ]
        
        addToLast(left, a) 
        
        left.push(0)

        addToFirst(data, b)
        
        for (const item of data) { left.push(item) }
        
        return { "data": left, "changed": true }
                
    }
    return { "data": left, "changed": false }
}

function addToFirst(segment, x) {

    for (let n = 0; n < segment.length; n++) {
    
        if ("[],".includes(segment[n])) { continue }
        
        segment[n] = "" + (parseInt(segment[n]) + x)
        
        return
    }
}

function addToLast(segment, x) {

    for (let n = segment.length - 1; n >= 0; n--) {
    
        if ("[],".includes(segment[n])) { continue }
        
        segment[n] = "" + (parseInt(segment[n]) + x)
        
        return
    }
}

///////////////////////////////////////////////////////////

function trySplit(data) {
    
    let left = [ ]
    
    while (data.length != 0) {
    
        const c = data.shift()
        
        left.push(c)
                
        if (c == ",") { continue }
        
        if (c == "]") { continue }
        
        if (c == "[") { continue } 
        
        // number
        
        if (c < 10)  { continue }
        
        const big = left.pop()
        
        left.push("[")
        
        left.push(Math.floor(big / 2))
        
        left.push(",")
        
        left.push(Math.ceil(big / 2))
        
        left.push("]")
        
        for (const item of data) { left.push(item) }        
        
        return { "data": left, "changed": true }
    }
    return { "data": left, "changed": false }
}

///////////////////////////////////////////////////////////

function calcMagnitude(data) {

    if (data.length == 1) { return parseInt(data[0]) }
    
    const left = [ ]
    
    while (data.length != 0) {
    
        if (! startsWithAtomicPair(data)) { left.push(data.shift()); continue }
        
        data.shift() // [
        
        const a = 3 * data.shift()
        
        data.shift() // ,
        
        const b = 2 * data.shift()
        
        data.shift() // ]
        
        left.push(a + b + "")
        
        for (const item of data) { left.push(item) } 

        return calcMagnitude(left)
    }  
}

function startsWithAtomicPair(data) {

    if (data[0] != "[") { return false }

    if ("[],".includes(data[1])) { return false }
    
    if (data[2] != ",") { return false }

    if ("[],".includes(data[3])) { return false }
    
    if (data[4] != "]") { return false }

    return true
}

main()

