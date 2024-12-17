"use strict"

// solving the puzzle takes (my computer) 0.040s

// solving both puzzles in recursive style

// comparing to the non recursive solution: 
// this solution is slightly slower


const DATA = [ ]

const RULES = { }

var ruleA = ""

var ruleB = ""

var targetString = ""


function main() {

    processInput() 
    
    let goods = 0   
        
    for (const data of DATA) { if (isGoodData(data)) { goods += 1 } }
    
    console.log("the answer is", goods)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const segments = input.split("\n\n")
        
    const rules = segments.shift().trim()
    const datas = segments.shift().trim()
    
    for (const line of datas.split("\n")) { DATA.push(line.trim()) }
    
    const lines = rules.split("\n")
    
    for (const line of lines) { 

        const parts = line.split(":")
        
        const key = parts.shift().trim()
        
        let value = parts.shift().trim()
                
        if (value == '"a"') { value = "a"; ruleA = key }
        if (value == '"b"') { value = "b"; ruleB = key }
        
        RULES[key] = [ ]
        
        const options = value.split(" | ")
   
        RULES[key].push(options.shift().split(" "))
        
        if (options.length == 0) { continue }
        
        RULES[key].push(options.shift().split(" "))
    }
}

///////////////////////////////////////////////////////////

// as the function only has to return a string that matches
// the source string, the function could return only the length
// of the string being mounted (instead of the string itself)!

// we are not really constructing a string; we just checking if
// the source string would pass the *minimum* necessary checks


function isGoodData(data) {

    targetString = data
    
    return search("", "0") == data
}

function search(myString, ruleId) { // depth first search - recursive

    if (ruleId == ruleA) {
    
        myString += "a"
        
        if (! targetString.startsWith(myString)) { return null }
        
        return myString
    }
    
    if (ruleId == ruleB) {
    
        myString += "b"
        
        if (! targetString.startsWith(myString)) { return null }
        
        return myString
    }
    
    const rule = RULES[ruleId]
    
    let newString = null
    
    for (const option of rule) {
    
        let candidate = myString
    
        for (const childRule of option) {
            
            candidate = search(candidate, childRule) // candidate accumulates changes
                                                     // is not a trick, 
                                                     // it is the NATURE of the rules
    
            if (candidate == null) { break } 
        }
        
        if (candidate != null) { newString = candidate }
    }
    return newString
}

main()

