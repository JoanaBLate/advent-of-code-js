"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trim()

var DATA = ""


function main() {

    processInput()
    
    let n = 2 
    
    while (true) {
    
        n += 1
        
        const a = DATA[n - 3]
        const b = DATA[n - 2]
        const c = DATA[n - 1]
        const d = DATA[n] 
    
        if (a == b) { continue }
        if (a == c) { continue }
        if (a == d) { continue }
        if (b == c) { continue }
        if (b == d) { continue }
        if (c == d) { continue }

        break    
    }
    
    console.log("the answer is", n + 1)
}

function processInput() {
        
    DATA = input
}

main()

