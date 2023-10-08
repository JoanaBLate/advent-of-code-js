"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    let text = Deno.readTextFileSync("input.txt").trim()

    let score = 0
        
    let openBlocks = 0
    
    let insideGarbage = false
    
    while (text != "") {
    
        const c = text[0]
        
        text = text.substr(1)

        if (c == "!") { text = text.substr(1); continue }
        
        if (insideGarbage) {
        
            if (c == ">") { insideGarbage = false }
            
            continue 
        }
        
        else {
        
            if (c == "<") { insideGarbage = true; continue }
        
            if (c == "{") { openBlocks += 1; score += openBlocks; continue }
            
            if (c == "}") { openBlocks -= 1; continue }
        }
    }
    
    console.log("score is", score)
}

main()


