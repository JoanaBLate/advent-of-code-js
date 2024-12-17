"use strict"

// solving the puzzle takes (my computer) 2.750s

function main() {

    let string = Deno.readTextFileSync("input.txt").trim()
    
    for (let n = 0; n < 50; n++) { string = processString(string) }    

    console.log("result length is", string.length)
}

function processString(string) {

    let newString = ""

    let group = ""
    
    while (true) {
    
        const c = string[0]
        
        if (c == undefined) { 
        
            if (group != "") { newString += "" + group.length + group[0] }
            
            break 
        }
    
        string = string.substr(1)
        
        if (group == "") { group = c; continue }
        
        if (c == group[0]) { group += c; continue }
        
        newString += "" + group.length + group[0]
        
        group = c
    }

    return newString
}

main()

