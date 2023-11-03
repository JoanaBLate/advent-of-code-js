"use strict"

// solving the puzzle takes (my computer) 0.025s

const DATA = [ ]


function main() {

    processInput()
    
    DATA[1] = 12
    DATA[2] = 2
    
    let pointer = 0 
    
    while (true) {
    
        const operation = DATA[pointer]

        if (operation == 99) { break }
        
        const addressA = DATA[pointer + 1]
        const addressB = DATA[pointer + 2]
        const addressC = DATA[pointer + 3]
        
        pointer += 4
        
        const valueA = DATA[addressA]
        const valueB = DATA[addressB]
        
        const result = (operation == 1) ? valueA + valueB : valueA * valueB
        
        DATA[addressC] = result
    }
     
    console.log("the answer is", DATA[0])
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { DATA.push(parseInt(token)) }
}


main()

