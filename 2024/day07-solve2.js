// solution for https://adventofcode.com/2024/day/7 part 2

"use strict"

const input = Deno.readTextFileSync("day07-input.txt").trim()

var answer = 0


function main() {

    processInput()
    
    console.log("the answer is", answer)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(":")
        
        const target = parseInt(parts.shift())
        
        const tokens = parts.shift().trim().split(" ")
        
        const operands = [ ]
        
        for (const token of tokens) { operands.push(parseInt(token)) } 
                
        if (checkMath(target, operands, 0, 0, "+")) { answer += target; continue }        
        if (checkMath(target, operands, 0, 0, "*")) { answer += target; continue }         
        
        if (checkMathDeep(target, operands, 0, 0, "+"))  { answer += target; continue }        
        if (checkMathDeep(target, operands, 0, 0, "*"))  { answer += target; continue }        
        if (checkMathDeep(target, operands, 0, 0, "||")) { answer += target; continue }  
    }
}

function checkMath(target, operands, indexOfOperand, result, operator) {

    const operand = operands[indexOfOperand]

    if (operator == "+") { result += operand } else { result *= operand }
        
    if (result > target) { return false }
    
    indexOfOperand += 1
    
    if (indexOfOperand == operands.length) { return target == result }
    
    if (checkMath(target, operands, indexOfOperand, result, "+")) { return true }
    if (checkMath(target, operands, indexOfOperand, result, "*")) { return true }
    
    return false
}

function checkMathDeep(target, operands, indexOfOperand, result, operator) {

    const operand = operands[indexOfOperand]

    if (operator == "+") { 
        result += operand 
    } 
    else if (operator == "*") { 
        result *= operand 
    }
    else {
        result = parseInt(result.toString() + operand.toString())    
    }
        
    if (result > target) { return false }
    
    indexOfOperand += 1
    
    if (indexOfOperand == operands.length) { return target == result }
    
    if (checkMathDeep(target, operands, indexOfOperand, result, "+"))  { return true }
    if (checkMathDeep(target, operands, indexOfOperand, result, "*"))  { return true }
    if (checkMathDeep(target, operands, indexOfOperand, result, "||")) { return true }
    
    return false
}

console.time("execution time")
main()
console.timeEnd("execution time") // 340ms

