"use strict"

// solving the puzzle takes (my computer) 0.030s

// there is excedent of chemicals after each fuel production,
// but the excedent is not regular;
// I tried to find a repeating pattern of excedent,
// but it was taking too long (more than 8 minutes): 
// I am using binary search now


const formulaFor = { }

const inventory = { "ORE": 0 }

var allChemicals = null

const trillion = 1000 * 1000 * 1000 * 1000 


function main() {

    processInput()
    
    allChemicals = Object.keys(inventory) // for performance, only
    
    produceFuel(1)

    const maxOrePerFuel = - inventory["ORE"] // first time gets no excedent from previous time
    
    const minProduction = Math.floor(trillion / maxOrePerFuel)
    
    let goodLow = minProduction

    let badHigh = Infinity
    
    let span = goodLow // arbitrary value
    
    while (true) {
           
        const number = goodLow + span
        
        const success = tryProduction(number)
        
        if (success) { goodLow = number } else { badHigh = number; break }
    }
         
    while (true) {
    
        if (goodLow + 1 == badHigh) { break }    
        
        const middle = Math.floor((badHigh + goodLow) / 2)
                
        const success = tryProduction(middle)
        
        if (success) { goodLow = middle } else {  badHigh = middle }
    }
    
    console.log("the answer is", goodLow)
}

function tryProduction(n) {

    resetInventory()
    
    produceFuel(n)
    
    const usedOre = - inventory["ORE"]
    
    return usedOre <= trillion
}

function resetInventory() {
    
    for (const chemical of allChemicals) { inventory[chemical] = 0 }
}

///////////////////////////////////////////////////////////

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

function produceFuel(n) {

    inventory["FUEL"] = -n

    while (true) {
    
        const refilled = refillAllChemicals()
        
        if (! refilled) { break }  
    }
}

function refillAllChemicals() {

    let refilled = false

    for (const chemical of allChemicals) { 
        
        if (chemical == "ORE") { continue }
        
        if (inventory[chemical] >= 0) { continue }
    
        refillThisChemical(chemical) 
        
        refilled = true    
    }
    return refilled
}
        
function refillThisChemical(chemical) { 

    const formula = formulaFor[chemical]

    const factor = Math.ceil(- inventory[chemical] / formula.amount)
    
    inventory[chemical] += factor * formula.amount
    
    for (const ingredient of formula.ingredients) {
    
        inventory[ingredient.chemical] -= factor * ingredient.amount
    }
}  

main()

