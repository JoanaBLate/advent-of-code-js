// solution for https://adventofcode.com/2025/day/6 part 2

"use strict"

const input = Deno.readTextFileSync("day06-input.txt") // .trim() // not trimming!

const widths = [ ]

const operands = [ ]  // [ [], []... ]

const operators = [ ]

var result = 0

function main() {

    const rawLines = input.split("\n")
    
    if (rawLines.at(-1).length == 0) { rawLines.pop() } // removing EOF?
    
    fillOperators(rawLines.pop())
    
    while (rawLines.length != 0) { fillOperandsOnce(rawLines.shift()) }

    for (let col = 0; col < operators.length; col++) { result += processColumn(col) }
  
    console.log("the answer is", result)
}

function fillOperators(line) {

    while (line != "") {
    
        let token = line[0]
        
        line = line.substring(1)
        
        while (line.startsWith(" ")) { token += " "; line = line.substring(1) }
        
        operators.push(token)
        
        widths.push(token.length - 1) // '-1' for the separator
    }
    
    widths[widths.length - 1] += 1 // has no separator
}

function fillOperandsOnce(line) {

    const list = [ ]
    
    operands.push(list)

    for (const width of widths) {
    
        const token = line.substr(0, width)
        
        list.push(token)
        
        line = line.substr(width + 1) // '+1' for the separator
    }
}

function processColumn(col) {

    const width = widths[col]

    const originalTokens = [ ]

    for (let row = 0; row < operands.length; row++) { originalTokens.push(operands[row][col]) }
    
    const numbers = [ ]
    
    for (let index = width - 1; index > -1; index--) { // runs backwards
    
        let newToken = ""
        
        for (let row = 0; row < operands.length; row++) { newToken += originalTokens[row][index] }
    
        numbers.push(parseInt(newToken))
    }

    if (operators[col].startsWith("+")) { return sumColumn(numbers) } 
    
    return multiplyColumn(numbers)
}

function sumColumn(numbers) {

    let val = 0
    
    for (const number of numbers) { val += number }
    
    return val
} 

function multiplyColumn(numbers) {

    let val = 1
    
    for (const number of numbers) { val *= number }
    
    return val
}    

console.time("execution time")
main()
console.timeEnd("execution time") // 4ms

