"use strict"

// solving the puzzle takes (my computer) 0.027s
    
var medicine = ""

const newMedicines = [ ]


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    medicine = rawLines.pop().trim()
    
    rawLines.pop() // blank line
    
    for (const rawLine of rawLines) { 
        
        const tokens = rawLine.split("=>")
        
        const agent = tokens.shift().trim()
        
        const value = tokens.shift().trim()
        
        processFormula(agent, value)
    }

    console.log("number of distinct molecules is", newMedicines.length)
}

function processFormula(agent, value) {
    
    let fromIndex = 0
    
    while (true) {
    
        const index = medicine.indexOf(agent, fromIndex)
        
        if (index == -1) { return }
        
        fromIndex = index + 1
        
        const newmed = medicine.substr(0, index) + value + medicine.substr(index + agent.length)        
    
        if (newMedicines.includes(newmed)) { continue }
        
        newMedicines.push(newmed)    
    }
}

main()

