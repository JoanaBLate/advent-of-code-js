"use strict"

// solving the puzzle takes (my computer) 0.030s

const formulaFor = { }

const inventory = { "ORE": 0 }

var allChemicals = null


function main() {

    processInput()
    
    allChemicals = Object.keys(inventory) // for performance, only
    
    inventory["FUEL"] = -1
        
 // show()

    while (true) {
    
        const refilled = refillAnyChemical()
        
        if (! refilled) { break }  
    }
    
    console.log("the answer is", - inventory["ORE"])
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
        
        const parts = line.trim().split(" => ")
        
        const segments = parts.shift().split(",")
    
        const ingredients = [ ]
        
        for (const segment of segments) { ingredients.push(createIngredient(segment)) }
        
        const product = createIngredient(parts.shift())
        
        const formula = { "amount": product.amount, "ingredients": ingredients }
                
        formulaFor[product.chemical] = formula
        
        inventory[product.chemical] = 0        
    }
}

function createIngredient(s) {

    const amount = parseInt(s)
    
    const chemical = s.replace("" + amount, "").trim()

    return { "chemical": chemical, "amount": amount }
}

///////////////////////////////////////////////////////////

function refillAnyChemical() {

    for (const chemical of allChemicals) { 
        
        if (chemical == "ORE") { continue }
        
        if (inventory[chemical] >= 0) { continue }
    
        refillThisChemical(chemical) 
        
     // console.log("\nafter refilling:", chemical)
     // show(inventory)
        
        return true    
    }
    return false
}
        
function refillThisChemical(chemical) { 

    while (inventory[chemical] < 0) { refillThisChemicalOnce(chemical) }
}

function refillThisChemicalOnce(chemical) {

    const formula = formulaFor[chemical]
    
    inventory[chemical] += formula.amount
    
    for (const ingredient of formula.ingredients) {
    
        inventory[ingredient.chemical] -= ingredient.amount
    }
} 

/////////////////////////////////////////////////////////// 

function show() {
    
    const obj = { }
    
    for (const key of Object.keys(inventory)) {
    
        if (inventory[key] != 0) { obj[key] = inventory[key] }
    }

    console.log(obj)
}         

main()

