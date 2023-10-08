"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    let count = 0
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(" ")
    
        if (isGoodPassphrase(tokens)) { count += 1 }
    }

    console.log("number of valid passphrases is", count)
}

function isGoodPassphrase(tokens) {

    for (const token of tokens) {
    
        if (tokens.indexOf(token) != tokens.lastIndexOf(token)) { return false }
    }
    
    return true
}

main()


