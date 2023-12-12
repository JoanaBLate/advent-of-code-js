"use strict"

// solving the puzzle takes (my computer) 0.027s

const FOODS = [ ]

const ALLERGENS = { }


function main() {

    processInput()
     
    fillAllergens()
    
    filterAllergens()
     
    console.log("the answer is",  countAppearance())
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) {
    
        const parts = line.split(" (contains ")
        
        const ingredients = parts.shift().split(" ")
        
        const allergens = parts.shift().replace(")", "").split(", ")
        
        FOODS.push({ "ingredients": ingredients, "allergens": allergens })   
        
        for (const allergen of allergens) { ALLERGENS[allergen] = [ ] } // probably overrides
    }
}

///////////////////////////////////////////////////////////

function fillAllergens() {

    for (const name of Object.keys(ALLERGENS)) { fillAllergen(name) }
}

function fillAllergen(name) {

    let numberOfLists = 0
    
    const ingredients = { }

    for (const food of FOODS) {

        if (! food.allergens.includes(name)) { continue }
        
        numberOfLists += 1
        
        for (const ingredient of food.ingredients) {
        
            if (ingredients[ingredient] == undefined) { ingredients[ingredient] = 0 }
            
            ingredients[ingredient] += 1            
        }
    }
    
    for (const ingredient of Object.keys(ingredients)) {
    
        if (ingredients[ingredient] == numberOfLists) { ALLERGENS[name].push(ingredient) }
    
    }
}

///////////////////////////////////////////////////////////

function filterAllergens() {

    const names = Object.keys(ALLERGENS)

    while (true) {
        
        let changed = false 
        
        for (const name of names) { if (filterAllergen(names, name)) { changed = true } }
        
        if (! changed) { return }
    }
}

function filterAllergen(names, masterName) {

    if (ALLERGENS[masterName].length > 1) { return false }
    
    const masterIngredient = ALLERGENS[masterName][0]
    
    let changed = false
    
    for (const name of names) {
    
        if (name == masterName) { continue }
        
        const index = ALLERGENS[name].indexOf(masterIngredient)
        
        if (index == -1) { continue }
        
        ALLERGENS[name].splice(index, 1)
        
        changed = true
    }
    
    return changed
}

///////////////////////////////////////////////////////////

function countAppearance() {

    let count = 0
    
    const forget = [ ]
    
    for (const list of Object.values(ALLERGENS)) { forget.push(list[0]) }
    
    for (const food of FOODS) {
        
        for (const ingredient of food.ingredients) {
        
            if (! forget.includes(ingredient)) { count += 1 }
        }
    }
    return count
}

main()

