"use strict"

// solving the puzzle takes (my computer) 0.035s


function main() {

    let total = 0

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) {
    
        const tokensA = rawLine.trim().split("[")
        
        const checksum = tokensA.pop().replace("]", "")
        
        const tokensB = tokensA.pop().split("-")
        
        const id = parseInt(tokensB.pop())
        
        const letters = tokensB.join("").split("")
        
        letters.sort()
        
        if (roomIsReal(letters, checksum)) { total += id }    
    }
    
    console.log("sum of the sector IDs of the real rooms is", total)
}

function roomIsReal(letters, checksum) {

    const tokens = [ ]
    
    let token = ""
    
    while (true) {
        
        const c = letters.shift()
        
        if (token == "")   { token = c; continue }
        
        if (c == token[0]) { token += c; continue }
        
        tokens.push(token)
        
        if (c == undefined) { break } else { token = c }
    }
    
    while (sortOnceBySize(tokens)) { }
    
    let result = ""
    
    for (let i = 0; i < 5; i++) { result += tokens[i][0] }
    
    return checksum == result
}
    
function sortOnceBySize(tokens) {

    for (let i = 0; i < tokens.length - 1; i++) {
        
        const a = tokens[i]
        const b = tokens[i + 1]
        
        if (a.length < b.length) {
            
            tokens[i] = b
            tokens[i + 1] = a
            return true
        }
    }

    return false
}

main()

