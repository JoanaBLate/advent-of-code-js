"use strict"

// solving the puzzle takes (my computer) 0.28s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawStrings = rawText.split("\n")
    
    var total = 0 // nice strings
    
    for (const rawString of rawStrings) {
    
        const string = rawString.trim()
        
        if (! pairsOk(string)) { continue }
        
        if (! betweenOk(string)) { continue }
        
        total += 1
    }
        
    console.log(rawStrings.length,"total nice strings is", total)
}

function pairsOk(string) {

    const maxIndex = string.length - 2 // last character cannot start a pair

    for (let i = 0; i <= maxIndex; i++) { 
    
        const a = string[i]
        const b = string[i + 1]
        
        const target =  a + b

        const index = string.indexOf(a + b, i + 2) // searching the string *after* the target
        
        if (index != -1) { return true } // we found another one
        
        // keep trying
    }
    
    return false
}

function betweenOk(string) {

    const maxIndex = string.length - 3 // penultimate (or last) character cannot start a trio

    for (let i = 0; i <= maxIndex; i++) { 
    
        const a = string[i]
        const c = string[i + 2]
        
        if (a == c) { return true }
    }
    
    return false
}

main()

