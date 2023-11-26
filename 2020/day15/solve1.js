"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    while (DATA.length < 2020) {
    
        const lastNumber = DATA.at(-1)
        
        const lastIndex = DATA.lastIndexOf(lastNumber, DATA.length - 2)
        
        if (lastIndex == -1) { DATA.push(0); continue }
        
        DATA.push(DATA.length - 1 - lastIndex)    
    }
     
    console.log("the answer is", DATA.at(-1))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}


main()

