"use strict"

// solving the puzzle takes (my computer) 0.032s

/*
    WARNING: 
    
    this program expects that one of the sides of the 'root' monkey
    has a *static* number (independent of the value for 'humn')
*/

const input = Deno.readTextFileSync("input.txt").trim()

const YELLERS = { }

const OPERATORS = { }


function main() {

    processInput()

    while (applyValues()) { }
    
    console.log("the answer is", findHumanValue())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const name = tokens.shift().substr(0, 4)
        
        if (name == "humn") { continue }
        
        if (tokens.length == 1) { YELLERS[name] = tokens.shift(); continue }
        
        OPERATORS[name] = { 
        
            "monkeyA": tokens.shift(), "symbol": tokens.shift(), "monkeyB": tokens.shift(), "doneA": false, "doneB": false 
        }
    }
}

///////////////////////////////////////////////////////////

function applyValues() {

    let changed = false

    const names = Object.keys(OPERATORS)
    
    for (const name of names) {
    
        if (applyValuesFor(name)) { changed = true }
    }
    
    return changed
}

function applyValuesFor(name) {

    let changed = false

    const operator = OPERATORS[name]

    if (! operator.doneA) {
    
        const valueA = YELLERS[operator.monkeyA]
        
        if (valueA != undefined) { operator.monkeyA = valueA; operator.doneA = true; changed = true }    
    }

    if (! operator.doneB) {
    
        const valueB = YELLERS[operator.monkeyB]
        
        if (valueB != undefined) { operator.monkeyB = valueB; operator.doneB = true; changed = true }    
    }
    
    if (operator.doneA  &&  operator.doneB) {
    
        const value = valueFromOperator(operator)

        YELLERS[name] = "" + value
        
        delete OPERATORS[name]        
    }
    
    return changed
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

function findHumanValue() {
        
    const monkeyA = OPERATORS["root"].monkeyA
    const monkeyB = OPERATORS["root"].monkeyB
    
    let targetValue = parseInt(monkeyA)
    
    let responseMonkey = monkeyB
    
    if (isNaN(targetValue)) { targetValue = parseInt(monkeyB); responseMonkey = monkeyA }
    
    return findHumanValue2(targetValue, responseMonkey)
}

function findHumanValue2(targetValue, responseMonkey) { // walks backwards

    let result = targetValue

    let monkeyName = responseMonkey
    
    while (true) {
        
        const operator = OPERATORS[monkeyName]
        
        const symbol = operator.symbol
        
        if (operator.doneA) {
            
            monkeyName = operator.monkeyB
            
            const operand = operator.monkeyA
            
            if (symbol == "+") { result -= parseInt(operand) }
            
            if (symbol == "*") { result /= parseInt(operand) }
            
            if (symbol == "-") { result = parseInt(operand) - result }
            
            if (symbol == "/") { result = parseInt(operand) / result }
        }
        
        else { // operator.doneB == true
            
            monkeyName = operator.monkeyA
            
            const operand = operator.monkeyB
            
            if (symbol == "+") { result -= parseInt(operand) }
            
            if (symbol == "*") { result /= parseInt(operand) }
            
            if (symbol == "-") { result += parseInt(operand) }
            
            if (symbol == "/") { result *= parseInt(operand) }
        }
            
        if (monkeyName == "humn") { return result }
    }
}

///////////////////////////////////////////////////////////

main()

