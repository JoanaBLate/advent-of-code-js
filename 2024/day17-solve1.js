// solution for https://adventofcode.com/2024/day/17 part 1

"use strict"

const input = Deno.readTextFileSync("day17-input.txt").trim()

var registerA = 0
var registerB = 0
var registerC = 0

const program = [ ]

var pointer = 0

var output = [ ]


function main() {

    processInput()

    runProgram()
    
    console.log("the answer is", output.join(","))
}

function processInput() {
    
    const lines = input.split("\n")
    
    registerA = parseInt(lines.shift().trim().replace("Register A: ", ""))
    registerB = parseInt(lines.shift().trim().replace("Register B: ", ""))
    registerC = parseInt(lines.shift().trim().replace("Register C: ", ""))
    
    lines.shift() // blank line
    
    const strProgram = lines.shift().trim().replace("Program: ", "").split(",")
    
    for (const str of strProgram) { program.push(parseInt(str)) }
}

///////////////////////////////////////////////////////////////////////////////

function runProgram() {

    while (true) {
        
        const opcode = program[pointer]
        
        if (opcode == undefined) { return }
        
        const operand = program[pointer + 1]

        if (opcode == 0) { adv(operand); pointer += 2; continue }
        if (opcode == 1) { bxl(operand); pointer += 2; continue }
        if (opcode == 2) { bst(operand); pointer += 2; continue }
        if (opcode == 3) { jnz(operand); continue }
        if (opcode == 4) { bxc(operand); pointer += 2; continue }
        if (opcode == 5) { out(operand); pointer += 2; continue }
        if (opcode == 6) { bdv(operand); pointer += 2; continue }
        if (opcode == 7) { cdv(operand); pointer += 2; continue }
    }
}

function adv(operand) { registerA = Math.floor(registerA / Math.pow(2, combo(operand))) }
    
function bdv(operand) { registerB = Math.floor(registerA / Math.pow(2, combo(operand))) }      

function cdv(operand) { registerC = Math.floor(registerA / Math.pow(2, combo(operand))) }

function bst(operand) { registerB = combo(operand) % 8 }
  
function bxl(operand) { registerB = registerB ^ operand }
      
function bxc(operand) { registerB = registerB ^ registerC }

function jnz(operand) { pointer = (registerA == 0) ? pointer + 2 : operand } 

function out(operand) { output.push(combo(operand) % 8) }

function combo(operand) {

    if (operand < 4) { return operand }
        
    if (operand == 4) { return registerA }
    if (operand == 5) { return registerB }
    if (operand == 6) { return registerC }
    
    console.log("error in function 'combo'")
}

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms


