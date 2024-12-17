"use strict"

// solving the puzzle takes (my computer) 0.031s

const input = Deno.readTextFileSync("input.txt").trim()

const YELLERS = { }

const OPERATORS = { }


function main() {

    processInput()
    
    while (true) {
    
        applyValues()
        
        if (YELLERS["root"] != undefined) { break }   
    }
    
    console.log("the answer is", parseInt(YELLERS["root"]))
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const name = tokens.shift().substr(0, 4)
        
        if (tokens.length == 1) { YELLERS[name] = tokens.shift(); continue }
        
        const operator = { "monkeyA": tokens.shift(), "symbol": tokens.shift(), "monkeyB": tokens.shift(), 
        
                          "doneA": false, "doneB": false }
                          
        OPERATORS[name] = operator
    }
}

///////////////////////////////////////////////////////////

function applyValues() {

    const names = Object.keys(OPERATORS)
    
    for (const name of names) { applyValuesFor(name) }
}

function applyValuesFor(name) {
 
    const operator = OPERATORS[name]

    if (! operator.doneA) {
    
        const valueA = YELLERS[operator.monkeyA]
        
        if (valueA != undefined) { operator.monkeyA = valueA; operator.doneA = true }    
    }

    if (! operator.doneB) {
    
        const valueB = YELLERS[operator.monkeyB]
        
        if (valueB != undefined) { operator.monkeyB = valueB; operator.doneB = true }    
    }
    
    if (operator.doneA  &&  operator.doneB) {
    
        const value = valueFromOperator(operator)

        YELLERS[name] = "" + value
        
        delete OPERATORS[name]        
    }
}

function valueFromOperator(operator) {

    const a = parseInt(operator.monkeyA)
    const b = parseInt(operator.monkeyB)
    
    if (operator.symbol == "+") { return a + b }
    if (operator.symbol == "-") { return a - b }
    if (operator.symbol == "*") { return a * b }
    if (operator.symbol == "/") { return a / b }
}

///////////////////////////////////////////////////////////

main()

