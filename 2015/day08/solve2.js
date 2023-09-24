"use strict"

// solving the puzzle takes (my computer) 0.033s

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    let originalLength = 0
    let encodedLength = 0

    for (const rawLine of rawLines) {
        
        const string = rawLine.trim()
        
        const len = string.length
        
        originalLength += len
        
        const core = string.substr(0, len - 1).substr(1) // removing starting and ending quotes
        
        const encoded = encode(core)
    
        encodedLength += encoded.length
        
    }    

    console.log("encoded length minus original length is", encodedLength - originalLength)
}

function encode(string) { 

    let result = '"' + "\\" + '"' // replacing starting quote
    
    while (string != "") {
    
        const c = string[0]
        
        string = string.substr(1)
    
        result += c
        
        if (c != "\\") { continue }
        
        result += "\\"
        
        if (string.startsWith('"')) { result += "\\" }      
    }
 
    result += "\\" // replacing ending quote
    result += '"'
    result += '"'
    
    return result
}

main()

