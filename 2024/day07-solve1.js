// solution for https://adventofcode.com/2024/day/7 part 1

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
        
        const operand = operands.shift()
        
        if (checkMath(target, operands.slice(0), operand, "+")) { answer += target; continue }
        
        if (checkMath(target, operands.slice(0), operand, "*")) { answer += target; continue }  
    }
}

function checkMath(target, operands, result, operator) {

    const operand = operands.shift()

    if (operator == "+") { result += operand } else { result *= operand }
        
    if (result > target) { return false }
    
    if (operands.length == 0) { return target == result }
    
    if (checkMath(target, operands.slice(0), result, "+")) { return true }
    if (checkMath(target, operands.slice(0), result, "*")) { return true }
    
    return false
}

console.time("execution time")
main()
console.timeEnd("execution time") // 18ms

