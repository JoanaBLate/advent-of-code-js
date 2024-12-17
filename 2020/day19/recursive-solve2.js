"use strict"

// solving the puzzle takes (my computer) 0.160s

// solving both puzzles in recursive style

// comparing to the non recursive solution: 
// this solution is more than 5 times slower

const DATA = [ ]

const RULES = { }

var ruleA = ""

var ruleB = ""

var targetString = ""


function main() {

    processInput() 

    RULES["8"] = [ [ "42" ], [ "42", "8" ] ]
    
    RULES["11"] = [ [ "42", "31" ], [ "42", "11", "31" ] ]

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

// because the puzzle2 uses recursive rules, following different
// branches may produce strings of *different sizes* at the same
// time; that's why we return lists, we must not leave any valid
// path


function isGoodData(data) {

    targetString = data
    
    return search("", "0").includes(data)
}

function search(myString, ruleId) { // depth first search - recursive

    if (myString.length >= targetString.length) { return [ ] }

    if (ruleId == ruleA) {
    
        myString += "a"
        
        if (! targetString.startsWith(myString)) { return [ ] }
        
        return [ myString ]
    }
    
    if (ruleId == ruleB) {
    
        myString += "b"
        
        if (! targetString.startsWith(myString)) { return [ ] }
        
        return [ myString ]
    }
    
    const rule = RULES[ruleId]
    
    const newStrings = [ ]
    
    for (const option of rule) {
        
        let futureStrings = [ myString ]
    
        for (const childRule of option) { // each childRule extends all the previous (extended) strings
    
            const currentStrings = futureStrings
            
            futureStrings = [ ]

            for (const string of currentStrings) {
            
                const nextStrings = search(string, childRule)
                
                for (const string of nextStrings) { futureStrings.push(string) }
            }
            
        }
        for (const string of futureStrings) { newStrings.push(string) }
    }
    return newStrings
}

main()

