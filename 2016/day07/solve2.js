"use strict"

// solving the puzzle takes (my computer) 0.045s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    let count = 0
    
    for (const rawLine of rawLines) { 
    
        const string = rawLine.trim()
        
        if (supportsSSL(string)) { count += 1 }        
    }
        
    console.log("number of IPs that support SSL is", count)
}

function supportsSSL(string) {    
    
    const outsides = [ ]
    const insides  = [ ]
    
    while (true) {
        
        if (string[0] == "[") {
        
            string = string.substr(1)
            
            const index = string.indexOf("]")
            
            const token = string.substr(0, index)

            insides.push(token)
        
            string = string.substr(index + 1)
            
            if (string == "") { break }
        }

        else {
            
            const index = string.indexOf("[")
            
            if (index == -1) { outsides.push(string); break }
            
            const token = string.substr(0, index)
            
            outsides.push(token)
        
            string = string.substr(index)
            
            if (string == "") { break }
        }
    }

    const list = [ ]

    for (const outside of outsides) { fillABAs(list, outside) }
    
    if (list.length == 0) { return false }
    
    const oldLength = list.length
    
    for (const inside of insides) { clearABAs(list, inside) }
    
    // if list is shorter, at least one match (aba vs bab) happened
    
    return list.length < oldLength
}

function fillABAs(list, string) {

    for (let i = 0; i < string.length - 2; i++) {
        
        const a = string[i]
        const b = string[i + 1]
        const c = string[i + 2]
    
        if (a == b) { continue }
        if (a != c) { continue }
        
        const aba = a + b + c
        
        if (! list.includes(aba)) { list.push(aba) }
    }
}

function clearABAs(list, string) {

    for (let i = 0; i < string.length - 2; i++) {
        
        const a = string[i]
        const b = string[i + 1]
        const c = string[i + 2]
    
        if (a == b) { continue }
        if (a != c) { continue }
        
        const aba = b + a + b // inverted sequence
        
        const index = list.indexOf(aba)
        
        if (index != -1) { list.splice(index, 1) }
    }
}

main()

