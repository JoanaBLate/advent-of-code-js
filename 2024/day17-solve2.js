// solution for https://adventofcode.com/2024/day/17 part 2

// analysing *MY* puzzle entry I came to some conclusions:
//
// - register A is the main register that holds data and commands the execution
// - register B and register C only exist for helping temporarily
// - near the end of the program there is the *only* output instruction (outputs some_value % 8)
// - there is *only* one jump instruction, it is in the last position, if register A is
//   zero it finishes the execution, otherwise it jumps back to the first line of the program
//
// - register A % 8 (its *THREE BITS* OT THE RIGHT) controls the value of each output
// - register A / pow(8, n) (its *OTHER BITS*) controls how many loops (outputs) will exist

"use strict"

const input = Deno.readTextFileSync("day17-input.txt").trim()

var originalA = 0 // unused
var originalB = 0
var originalC = 0

const program = [ ]


function main() {

    processInput()
    
    const register = search(BigInt(0), 1)
    
    console.log("the answer is", register.toString())
}

function processInput() {
  
    const lines = input.split("\n")
    
    originalA = BigInt(lines.shift().trim().replace("Register A: ", ""))
    originalB = BigInt(lines.shift().trim().replace("Register B: ", ""))
    originalC = BigInt(lines.shift().trim().replace("Register C: ", ""))
    
    lines.shift() // blank line
    
    const tokens = lines.shift().trim().replace("Program: ", "").split(",")
    
    for (const token of tokens) { program.push(parseInt(token)) }
}

///////////////////////////////////////////////////////////////////////////////

function search(register, tail) { // wants to match the tail // 'tail' means the length of the tail

    for (let delta = 0; delta < 8; delta++) {
    
        const newRegister = register * BigInt(8) + BigInt(delta)
    
        const output = runProgram(newRegister)
        
        if (program.at(-tail) != output.at(-tail)) { continue } // tails don't match
        
        if (program.length == output.length) { return newRegister } // solved!
        
        const ultimateRegister = search(newRegister, tail + 1)
        
        if (ultimateRegister != 0) { return ultimateRegister } 
    }    
    
    return 0
}
        
///////////////////////////////////////////////////////////////////////////////

function runProgram(register) {

    let registerA = register
    let registerB = originalB
    let registerC = originalC

    let pointer = 0
    
    const output = [ ]   

    while (true) {
    
        const opcode = program[pointer]
        
        if (opcode == undefined) { return output }
        
        const operand = BigInt(program[pointer + 1])

        if (opcode == 0) { adv(operand); pointer += 2; continue }
        if (opcode == 1) { bxl(operand); pointer += 2; continue }
        if (opcode == 2) { bst(operand); pointer += 2; continue }
        if (opcode == 3) { jnz(operand); continue }
        if (opcode == 4) { bxc(operand); pointer += 2; continue }
        if (opcode == 5) { out(operand); pointer += 2; continue }
        if (opcode == 6) { bdv(operand); pointer += 2; continue }
        if (opcode == 7) { cdv(operand); pointer += 2; continue }
    }


    function adv(operand) { registerA = registerA / pow(BigInt(2), combo(operand)) } // BigInt dismisses Math.floor
        
    function bdv(operand) { registerB = registerA / pow(BigInt(2), combo(operand)) } // BigInt dismisses Math.floor    

    function cdv(operand) { registerC = registerA / pow(BigInt(2), combo(operand)) } // BigInt dismisses Math.floor

    function bst(operand) { registerB = combo(operand) % BigInt(8) }
      
    function bxl(operand) { registerB = registerB ^ operand }
          
    function bxc(operand) { registerB = registerB ^ registerC }

    function jnz(operand) { pointer = (registerA == 0) ? pointer + 2 : parseInt(operand) } 

    function out(operand) { output.push(combo(operand) % BigInt(8)) }
    
    function combo(operand) {

        if (operand <  4) { return operand }        
        if (operand == 4) { return registerA }
        if (operand == 5) { return registerB }
        if (operand == 6) { return registerC }
        
        console.log("error in function 'combo'")
    }  
    
    function pow(base, expoent) { // necessary because Math.pow doesn't accept BigInt
    
        let result = BigInt(1)
        
        for (let n = BigInt(0); n < expoent; n++) { result *= base }

        return result
    }
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 7ms

