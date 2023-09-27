"use strict"

// solving the puzzle takes (my computer) 0.040s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    let count = 0
    
    for (const rawLine of rawLines) { 
    
        const string = rawLine.trim()
        
        if (supportsTLS(string)) { count += 1 }        
    }
        
    console.log("number of IPs that support TLS is", count)
}

function supportsTLS(string) {    
    
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

    for (const inside of insides) { // must check it first

        if (hasABBA(inside)) { return false }
    }


    for (const outside of outsides) {

        if (hasABBA(outside)) { return true }
    }
    
    return false
}

function hasABBA(string) { 

    for (let i = 0; i < string.length - 3; i++) {
        
        const a = string[i]
        const b = string[i + 1]
        const c = string[i + 2]
        const d = string[i + 3]
    
        if (a == b) { continue }
        if (a != d) { continue }
        if (b == c) { return true }    
    }
 
    return false
}

main()

