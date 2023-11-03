"use strict"

// solving the puzzle takes (my computer) 0.025s

const arquive = [ ]

var DATA = null


function main() {

    processInput()
    
    for (let noun = 0; noun < 100; noun++) {
    
        for (let verb = 0; verb < 100; verb++) {
    
            DATA = arquive.slice()
            
            const result = run(noun, verb)
            
            if (result == 19690720) { console.log("the answer is", 100 * noun + verb); return }
        }
    }     
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(",")
    
    for (const token of tokens) { arquive.push(parseInt(token)) }
}

function run(noun, verb) {

    DATA[1] = noun
    DATA[2] = verb

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
    
    return DATA[0]
}

main()

