"use strict"

// solving the puzzle takes (my computer) 0.025s

const instructions = [ ]

var regA = 0
var regB = 0
var nextLine = 0

var shallStop = false

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
        
    for (const rawLine of rawLines) { instructions.push(rawLine.trim()) }
    
    while (! shallStop) { executeNextIntruction() }
    
    console.log("register b is", regB)
}

function executeNextIntruction() {
    
    const line = instructions[nextLine]

    if (line == undefined) { shallStop = true; return }
    
    if (line == "inc a") { regA += 1; nextLine += 1; return }
    
    if (line == "inc b") { regB += 1; nextLine += 1; return }

    if (line == "tpl a") { regA *= 3; nextLine += 1; return }

    if (line == "tpl b") { regB *= 3; nextLine += 1; return }

    if (line == "hlf a") { regA /= 2; nextLine += 1; return }

    if (line == "hlf b") { regB /= 2; nextLine += 1; return }
        
    const cmd = line.substr(0, 3)

    const temp = line.substr(4)

    if (cmd == "jmp") { nextLine += parseInt(temp); return }
    
    const regValue = (temp[0] == "a") ? regA : regB
    
    const longDistance = parseInt(temp.substr(3))
    
    if (cmd == "jie") { 
    
        nextLine += (regValue % 2 == 0) ? longDistance : 1
        
        return
    }
    
    if (cmd == "jio") { 
    
        nextLine += (regValue == 1) ? longDistance : 1
        
        return
    }
        
    shallStop = true
}

main()

