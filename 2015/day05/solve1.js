"use strict"

// solving the puzzle takes (my computer) 0.28s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawStrings = rawText.split("\n")
    
    var total = 0 // nice strings
    
    for (const rawString of rawStrings) {
    
        const string = rawString.trim()
        
        if (! vowelsOk(string)) { continue }
        
        if (! twiceOk(string)) { continue }
        
        if (! forbiddenOk(string)) { continue }
        
        total += 1
    }
        
    console.log(rawStrings.length,"total nice strings is", total)
}

function vowelsOk(string) {

    let vowels = 0

    for (const c of string) { 
    
        if (c == "a") { vowels += 1; continue }
        if (c == "e") { vowels += 1; continue }
        if (c == "i") { vowels += 1; continue }
        if (c == "o") { vowels += 1; continue }
        if (c == "u") { vowels += 1; continue }
    }
    
    return vowels > 2
}

function twiceOk(string) {

    const maxIndex = string.length - 2 // last character cannot start a pair

    for (let i = 0; i <= maxIndex; i++) { 
    
        const a = string[i]
        const b = string[i + 1]
        
        if (a == b) { return true }
    }
    
    return false
}

function forbiddenOk(string) {

    const maxIndex = string.length - 2 // last character cannot start a pair

    for (let i = 0; i <= maxIndex; i++) { 
    
        const a = string[i]
        const b = string[i + 1]
        
        const pair = a + b
        
        if (pair == "ab") { return false }
        if (pair == "cd") { return false }
        if (pair == "pq") { return false }
        if (pair == "xy") { return false }
    }

    return true
}

main()

