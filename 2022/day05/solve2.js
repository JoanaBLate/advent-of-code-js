"use strict"

// solving the puzzle takes (my computer) 0.025s

const input = Deno.readTextFileSync("input.txt").trimEnd() // must not trim the start this time

/*
    **WARNING**
    
        THIS PROGRAM EXPECTS A 9 STACK STRUCTURE (in the input)
*/

const STACKS = [ [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ] ]

const COMMANDS = [ ]


function main() {

    processInput()
    
   for (const command of COMMANDS) { move(command) }
   
   let tops = ""
   
   for (const stack of STACKS) { tops += stack.at(-1) }

    console.log("the answer is", tops)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")
    
    parseDiagram(parts.shift().trimEnd()) // must not trim the start 
        
    const lines = parts.shift().trim().split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const amount = parseInt(tokens[1])
        const origin = parseInt(tokens[3])
        const destiny = parseInt(tokens[5])
        
        COMMANDS.push({ "origin": origin, "destiny": destiny, "amount": amount })
    }
}

function parseDiagram(source) {
    
    const lines = source.split("\n")
    
    lines.pop() // labels()
    
    while (lines.length != 0) { fillStacksWithDiagramLine(lines.pop()) }
}
  
function fillStacksWithDiagramLine(line) {

    for (let n = 0; n < 9; n++) {
    
        const left = 1 + (n * 4)
        
        const c = line[left]
        
        if (c == " "  ||  c == undefined) { continue }
        
        STACKS[n].push(c)
    }
}

///////////////////////////////////////////////////////////

function move(command) {

    const origin = STACKS[command.origin - 1]
    
    const destiny = STACKS[command.destiny - 1]

    const temp = [ ]

    for (let n = 0; n < command.amount; n++) {
    
        const crate = origin.pop()
        
        temp.unshift(crate)
    }
        
    for (const crate of temp) {
        
        destiny.push(crate)
    }
}

main()

