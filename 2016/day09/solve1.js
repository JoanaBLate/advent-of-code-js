"use strict"

// solving the puzzle takes (my computer) 0.024s


function main() {

    let text = Deno.readTextFileSync("input.txt").trim()

    let length = 0    
    
    while (text != "") {

        if (text[0] != "(") { length += 1; text = text.substr(1); continue }
        
        text = text.substr(1) // '('
        
        const index = text.indexOf(")")
        
        const data = text.substr(0, index)
        
        const tokens = data.split("x")
        
        const len = parseInt(tokens.shift())
        
        const repeats = parseInt(tokens.shift())
        
        length += len * repeats
        
        text = text.substr(index + 1 + len)
    }
    
    console.log("decompressed length is", length)
}

main()

