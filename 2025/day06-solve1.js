// solution for https://adventofcode.com/2025/day/6 part 1

"use strict"

const input = Deno.readTextFileSync("day06-input.txt").trim()

const operands = [ ]  // [ [], []... ]

const operators = [ ]

var result = 0

function main() {

    const rawLines = input.split("\n")
    
    fillOperators(rawLines.pop())
    
    while (rawLines.length != 0) { fillOperandsOnce(rawLines.shift()) }
    
    for (let col = 0; col < operators.length; col++) { result += processColumn(col) }
  
    console.log("the answer is", result)
}

function fillOperators(line) {

    for (const char of line) { 
        
        if (char > " ") { operators.push(char) } 
    }
}

function fillOperandsOnce(line) {

    const list = [ ]
    
    operands.push(list)

    let index = -1
    
    let token = ""
    
    while (true) {
    
        index += 1
        
        if (index == line.length) { break }
        
        const c = line[index]
        
        if (c > " ") { token += c; continue }
        
        if (token == "") { continue }
        
        list.push(parseInt(token))
        
        token = ""        
    }
    
    if (token != "") { list.push(parseInt(token)) }
}

function processColumn(col) {

    if (operators[col] == "+") { return sumColumn(col) } 
    
    return multiplyColumn(col)
}

function sumColumn(col) {

    let val = 0
    
    for (let row = 0; row < operands.length; row++) { val += operands[row][col] }
    
    return val
} 

function multiplyColumn(col) {

    let val = 1
    
    for (let row = 0; row < operands.length; row++) { val *= operands[row][col] }
    
    return val
}    

console.time("execution time")
main()
console.timeEnd("execution time") // 3ms

