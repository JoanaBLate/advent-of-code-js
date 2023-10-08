"use strict"

// solving the puzzle takes (my computer) 0.105s

    
const banks = [ ]

const configurations = [ ]

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = rawText.split("\t") // TAB
    
    for (const token of tokens) { 
    
        const number = parseInt(token.trim())
        
        banks.push(number) 
    }
    
    configurations.push(banks.join("~"))
     
    let redistributions = 0
        
    while (true) {
    
        redistribute()
        
        redistributions += 1
         
        const config = banks.join("~")
           
        const index = configurations.indexOf(config) 
        
        if (index == -1) { configurations.push(config); continue }
        
        console.log("number of redistribution cycles is", configurations.length - index)

        break    
    }    
}

function redistribute() {
    
    let index = indexOfBusiest()
    let amount = banks[index]
    
    banks[index] = 0
    
    while (amount > 0) {
    
        index += 1
        
        if (index >= banks.length) { index -= banks.length }
    
        banks[index] += 1
        
        amount -= 1
    }
}

function indexOfBusiest() {

    let biggest = 0

    let index = -1

    for (let i = 0; i < banks.length; i++) {
    
        const bank = banks[i]
    
        if (bank > biggest) { biggest = bank; index = i }
    }

    return index
}

main()


