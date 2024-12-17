"use strict"

// solving the puzzle takes (my computer) 0.030s

const DATA = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) {
    
        let first = ""
        let last = ""
        
        for (const c of data) {
        
            if (c < "0") { continue }
            if (c > "9") { continue }
            
            if (first == "") { first = c } else { last = c }        
        }
        
        if (last == "") { last = first }
        
        sum += parseInt(first + last)    
    }
     
    console.log("the answer is", sum)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}


main()

