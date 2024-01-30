"use strict"

// solving the puzzle takes (my computer) 0.190s

/*
    some notes:
    
         it is a waste of time to translate the input data into nodes
         because often you have have to merge things that are not even
         in the same branch (of nodes) 
         
         never the max depth is greater than 4 (depth 4 means the pair is of kind [number, number])
         
         the purpose of the explosion is to flatten the data
*/

const input =  Deno.readTextFileSync("input.txt").trim()

const DATA = [ ] // string format


function main() {

    processInput()
    
    let best = 0
  
    for (let a = 0; a < DATA.length - 1; a++) {
    
        for (let b = a; b < DATA.length; b++) {
        
            const stringA = DATA[a]            
            const stringB = DATA[b]
            
            const ab = add(stringA, stringB)            
            const ba = add(stringB, stringA)
            
            if (ab > best) { best = ab }
            if (ba > best) { best = ba }
        }
    }
    
    console.log("the answer is", best)        
}
   
///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function add(stringA, stringB) {

    const string = "[" + stringA + "," + stringB + "]"
    
    const data = string.split("")

    processData(data)
    
    return calcMagnitude(data)
}

///////////////////////////////////////////////////////////

function processData(data) {

    while (true) {

        tryExplode(data)
        
        if (! trySplit(data)) { return } // not changed
    }
}

///////////////////////////////////////////////////////////

function tryExplode(data) { // does all possible explosions

    let changed = false

    let depth = 0
    
    let n = -1
    
    while (n < data.length) {
        
        n += 1
    
        const c = data[n]
                
        if (c == ",") { continue }
        
        if (c == "]") { depth -= 1; continue }
        
        if (c != "[") { continue } // number
        
        if (depth < 4)  { depth += 1; continue } // [
        
        // maybe explode 
        
        if (data[n + 2] != ",") { continue }
        if (data[n + 4] != "]") { continue }
        
        // exploding  
        const a = parseInt(data[n + 1])
        const b = parseInt(data[n + 3])
        
        data.splice(n, 5, "0") // extracts [ a , b ]

        addToLast(data, n - 1, a) 

        addToFirst(data, n + 1, b)             
        
        changed = true
    }
    return changed
}

function addToFirst(data, index, x) {

    for (let n = index; n < data.length; n++) {
    
        if ("[],".includes(data[n])) { continue }
        
        data[n] = "" + (parseInt(data[n]) + x)
        
        return
    }
}

function addToLast(data, index, x) {

    for (let n = index; n >= 0; n--) {
    
        if ("[],".includes(data[n])) { continue }
        
        data[n] = "" + (parseInt(data[n]) + x)
        
        return
    }
}

///////////////////////////////////////////////////////////

function trySplit(data) { // does just one (or none) split

    const off = data.length
        
    for (let n = 0; n < off; n++) {
    
        const c = data[n]
                
        if (c == ",") { continue }
        
        if (c == "]") { continue }
        
        if (c == "[") { continue } 
        
        // number
        
        const big = parseInt(c) 
        
        if (big < 10)  { continue }
        
        const a = Math.floor(big / 2) + ""
        const b = Math.ceil(big / 2) + ""
        
        data.splice(n, 1, "[", a, ",", b, "]")
                
        return true
    }
    return false
}

///////////////////////////////////////////////////////////

function calcMagnitude(data) {

    while (data.length > 1) { calcMagnitude2(data) }
    
    return parseInt(data[0])
}

function calcMagnitude2(data) {
    
    let n = -1
    
    while (true) {
    
        n += 1
        
        if (data[n + 4] == undefined) { return }

        if (data[n] != "[") { continue }

        if ("[],".includes(data[n + 1])) { continue }
        
        if (data[n + 2] != ",") { continue }

        if ("[],".includes(data[n + 3])) { continue }
        
        if (data[n + 4] != "]") { continue }
        
        // spliting
        
        const a = 3 * data[n + 1]
        
        const b = 2 * data[n + 3]
        
        const value = (a + b) + ""
        
        data.splice(n, 5, value) // extracts [ a , b ]
    }  
}

main()

