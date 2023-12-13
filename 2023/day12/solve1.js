"use strict"

// solving the puzzle takes (my computer) 0.038s

// we DON'T need to know or keep the possible matches!
// we only need to count how many they are

const DATA = [ ]


function main() {

    processInput()

    let sum = 0
    
    for (const data of DATA) { sum += search(data.springs, data.scheme, false) }
    
    console.log("the answer is", sum)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")

    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const springs = parts.shift()
        
        const scheme = [ ]
        
        for (const token of parts.shift().split(",")) { scheme.push(parseInt(token)) }        
        
        DATA.push({ "springs": springs, "scheme": scheme })
    }
}

///////////////////////////////////////////////////////////

function search(springs, scheme, sharpHeadWasJustEaten) {

    if (scheme.length == 0) {
    
        return (springs.indexOf("#") != -1) ? 0 : 1
    }
    
    if (springs == "") { return 0 } // because scheme isn't empty
    
    //

    if (springs[0] == ".") { 
    
        while (springs[0] == ".") { springs = springs.substr(1) }
        
        return search(springs, scheme.slice(), false)
    }
    
    //    

    if (springs[0] == "#") { 
    
        if (sharpHeadWasJustEaten) { return 0 }
        
        const targetLength = scheme.shift()
        
        for (let n = 0; n < targetLength; n++) {
        
            const c = springs[0]
            
            springs = springs.substr(1)
            
            if (c != "#"  &&  c != "?") { return 0 }        
        }
        
        return search(springs, scheme.slice(), true)
    }
    
    // springs starts with "?"
    
    if (sharpHeadWasJustEaten) { return search(springs.substr(1), scheme.slice(), false) }
    
    const targetLength = scheme[0] // not shifting now
    
    if (springs.length < targetLength) { return 0 } // no room for the target
    
    let count = 0
    
    count += search(springs.substr(1), scheme.slice(), false) // not replacing "?" with sharp
    
    scheme.shift()

    let ok = true
        
    for (let n = 0; n < targetLength; n++) { // replacing "?" with sharp
    
        const c = springs[0]
        
        springs = springs.substr(1)
        
        if (c != "#"  &&  c != "?") { ok = false; break }        
    }
    
    if (ok) { count += search(springs, scheme.slice(), true) }
    
    return count
}

main()

