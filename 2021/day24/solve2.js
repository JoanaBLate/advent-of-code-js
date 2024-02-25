"use strict"

// solving the puzzle takes (my computer) 0.024s

/*
    *WARNING*
    
    THIS SOLUTION MAY NOT WORK FOR YOUR INPUT
*/

const input = Deno.readTextFileSync("input.txt").trim()

const SUBROUTINES = [ ]


function main() {

    processInput()
    
    console.log("the answer is", search())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    let group = [ ]
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const kind = tokens.shift()

        const operand1 = tokens.shift()
        
        const operand2 = tokens.shift() || ""
        
        if (kind == "inp") { group = [ ]; SUBROUTINES.push(group) }
        
        group.push({ "kind": kind, "operand1": operand1, "operand2": operand2 })
    }
}

///////////////////////////////////////////////////////////

function getSignifcantCommands() {

    // the ALU program is a sequence of 14 VERY SIMILAR subroutines
    // (one for each digit of the number to be validated)
    
    // from each subroutine we take its SIGNIFICANT part as data
    
    // the subroutines can be thought as (push/pop) stack operations

    /**
     *  0. inp w
     *  1. mul x 0
     *  2. add x z
     *  3. mod x 26
     *  4. div z 1   <-- truncates z
     *  5. add x 10  <-- increments x
     *  6. eql x w
     *  7. eql x 0
     *  8. mul y 0
     *  9. add y 25
     * 10. mul y x
     * 11. add y 1
     * 12. mul z y
     * 13. mul y 0
     * 14. add y w
     * 15. add y 5   <-- increments y
     * 16. mul y x
     * 17. add z y
     */

    const commands = [ ]

    for (const subroutine of SUBROUTINES) {

        const truncatesZ = 26 == parseInt(subroutine[4].operand2)

        const incrementX = parseInt(subroutine[5].operand2)

        const incrementY = parseInt(subroutine[15].operand2)

        const stackOp = truncatesZ ? "pop" : "push" // pops read x_inc, pushes read y_inc

        const value = truncatesZ ? incrementX : incrementY

        commands.push({ "stackOp": stackOp, "value": value })
    }

    return commands
}

///////////////////////////////////////////////////////////

function getRestraints() {

    const commands = getSignifcantCommands()

    const stack = [ ]

    const restraints = [ ]

    for (let index = 0; index < commands.length; index++) {

        const command = commands[index]
        
        if (command.stackOp == "push") { 
        
            const obj = { "index": index, "value": command.value }
            
            stack.push(obj)
        }
        
        else { // command.stackOp == "pop" 

            const head = stack.pop()

            const obj = { "left": index, "right": head.index, "value": head.value + command.value }

            restraints.push(obj)
        }
    }
    
    return restraints
}

///////////////////////////////////////////////////////////

function search() {

    const result = new Array(14)

    result.fill(0)

    for (const restraint of getRestraints()) {

        const rightInput = findMinRightInput(restraint.value)

        const leftInput = rightInput + restraint.value

        result[restraint.left] = leftInput

        result[restraint.right] = rightInput
    }

    return parseInt(result.join(""))
}

function findMinRightInput(restraint) {

    for (let digit = 1; digit <= 9; digit++) {
    
        if (digit + restraint < 1) { continue }
        if (digit + restraint > 9) { continue }
        
        return digit
    }    
}

///////////////////////////////////////////////////////////

main()

