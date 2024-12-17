"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    let text = Deno.readTextFileSync("input.txt").trim()

    let count = 0
    
    let insideGarbage = false
    
    while (text != "") {
    
        const c = text[0]
        
        text = text.substr(1)

        if (c == "!") { text = text.substr(1); continue }
        
        if (insideGarbage) {
        
            if (c == ">") { insideGarbage = false; continue }
            
            count += 1
        }        
        else {
        
            if (c == "<") { insideGarbage = true }
        }
    }
    
    console.log("number of non-canceled characters are within the garbage is", count)
}

main()


