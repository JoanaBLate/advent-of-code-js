"use strict"

// solving the puzzle takes (my computer) 0.027s
    
var medicine = ""

const formulas = [ ] // { agent, value }


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    medicine = rawLines.pop().trim()
    
    rawLines.pop() // blank line
    
    for (const rawLine of rawLines) { 
        
        const tokens = rawLine.split("=>")
        
        const agent = tokens.shift().trim()
        
        const value = tokens.shift().trim()
        
        const formula = { "agent": agent, "value": value }
        
        formulas.push(formula)
    }

    // The fewest number of steps to go from e to the medicine molecule is the same
    // number of steps to go from the medicine molecule to e!
    // Working backwards is much more efficient!

    let steps = 0
    
    while (medicine != "e") { transformMedicineOnce(); steps += 1 }

    console.log("number of steps for creating the medicine from a electron is", steps)
}

function transformMedicineOnce() { // one of the formulas is granted to work (we are walking backwards)

    for (const formula of formulas) { 
        
        const diff = tryApplyFormula(formula) 
        
        if (diff) { return }   
    }
}

function tryApplyFormula(formula) {

    const agent = formula.agent
    const value = formula.value
    
    const index = medicine.indexOf(value)
        
    if (index == -1) { return false }
        
    medicine = medicine.substr(0, index) + agent + medicine.substr(index + value.length) 
    
    return true
}

main()

