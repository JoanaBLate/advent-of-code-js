"use strict"

// solving the puzzle takes (my computer) 0.026s


function main() {

    const text = Deno.readTextFileSync("input.txt").trim()
    
    console.log("decompressed length is", lengthOfText(text))
}

function lengthOfText(text) { // recursive function (calls it self)

 // console.log("\nprocessing:", text)
    
    let length = 0    
    
    while (true) {

        if (text == "") { 
        
         // console.log("returning", length)
        
            return length 
        }
        
        const c = text[0]
        
        text = text.substr(1)

        if (c != "(") { length += 1; continue }
        
        const index = text.indexOf(")")
        
        const data = text.substr(0, index)
        
     // console.log("data:", data, "    length before data:", length)
        
        text = text.substr(index + 1) // skips ']'
        
     // console.log("text after data:", text)
        
        const tokens = data.split("x")
        
        const len = parseInt(tokens.shift())
        
        const repeats = parseInt(tokens.shift())
        
        const segment = text.substr(0, len)
        
        text = text.substr(len) // skips the segment
        
     // console.log("segment:", segment.length, segment)
        
     // console.log("text after segment:", text)
        
        length += repeats * lengthOfText(segment)
    }
}

main()

