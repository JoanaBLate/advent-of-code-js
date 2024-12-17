"use strict"

// solving the puzzle takes (my computer) 0.025s

/*
    the current program is my JavaScript translation of the
    brilliant solution in Go
    
    at https://github.com/GreenLightning/aoc19/blob/master/day22/main.go
    
    by https://www.reddit.com/user/MegaGreenLightning/

*/

const input = Deno.readTextFileSync("input.txt").trim()

const LENGTH = 119315717514047

const ITERATIONS = 101741582076661
    

function main() {

    const originalInstructions = processInput()
    
 // console.log(originalInstructions)

    const simplified = simplify(originalInstructions)
    
 // console.log(simplified)
    
    const simplified2 = absorveIterations(simplified)
           
 // console.log(simplified2)    
        
    console.log("the answer is", shuffle(simplified2))
}

///////////////////////////////////////////////////////////

function processInput() {

    const instructions = [ ]

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const line = rawLine.trim()
    
        if (line == "deal into new stack") { 
        
            instructions.push(createInstruction("reverse", 0))
        }
            
        else if (line.startsWith("deal with increment")) { 
        
            const value = parseInt(line.split(" ").pop())
            
            instructions.push(createInstruction("deal", value))
        }
        
        else if (line.startsWith("cut")) { 
        
            const value = parseInt(line.split(" ").pop())
            
            instructions.push(createInstruction("cut", value))
        }
        
        else {
        
            console.log("INPUT ERROR!"); Deno.exit()
        }
    }
    
    return instructions
}
    
function createInstruction(kind, value) {

    return { "kind": kind,"value": value }
}    

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function simplify(instructions) {

    const simplified = simplifyDealIntoStack(instructions) // must come first

    const simplified2 = simplifyCut(simplified) // must be the second
    
    return simplifyDealWithIncrement(simplified2) // must be the last
}

///////////////////////////////////////////////////////////

function simplifyDealIntoStack(instructions) {

    const simplified = [ ]
    
    let reversed = false
    
    for (const inst of instructions) {
    
        if (inst.kind == "reverse") { reversed = ! reversed; continue }
    
        if (! reversed) { simplified.push(inst); continue }
        
        // adapting the instruction to have the same result as if the cards were reversed:
        
        if (inst.kind == "cut") {
        
            let value = (inst.value + LENGTH) % LENGTH // for negative value
            
            value = LENGTH - value // reversing cut
            
            simplified.push(createInstruction("cut", value))
            
            continue
        }
        
        // inst.kind = "deal"
        
        simplified.push(inst)
        
        simplified.push(createInstruction("cut", LENGTH + 1 - inst.value))
    }
    
    if (reversed) { simplified.push(createInstruction("reverse", 0)) }
    
    return simplified
}

///////////////////////////////////////////////////////////

function simplifyCut(instructions) { // assumes "deal into stack" was already simplified

    const simplified = [ ]
    
    let cut = BigInt(0) 
    
    for (const inst of instructions) {
    
        if (inst.kind == "reverse") { // tail or near tail
    
            if (cut != 0) { simplified.push(createInstruction("cut", cut)); cut = 0 }   
    
            simplified.push(inst)
            
            continue 
        }
        
        if (inst.kind == "cut") { cut += BigInt(inst.value); cut %= BigInt(LENGTH); continue }
        
        // inst.kind = "deal"
        
        simplified.push(inst)
        
        cut *= BigInt(inst.value)
        cut %= BigInt(LENGTH)
    }
    
    if (cut != 0) { simplified.push(createInstruction("cut", parseInt(cut))) }
    
    return simplified
}

///////////////////////////////////////////////////////////

function simplifyDealWithIncrement(instructions) { // assumes "cut" and "deal into stack" were already simplified

    const simplified = [ ]
    
    let increment = BigInt(1) 
    
    for (const inst of instructions) {
    
        if (inst.kind == "reverse"  ||  inst.kind == "cut") { // tail or near tail
    
            if (increment != 1) { simplified.push(createInstruction("deal", parseInt(increment))); increment = 1 }   
    
            simplified.push(inst)
            
            continue 
        }
        
        // inst.kind = "deal"
        
        increment *= BigInt(inst.value)
        increment %= BigInt(LENGTH)
    }
    
    if (increment != 1) {
	
        simplified.push(createInstruction("deal", parseInt(increment)))
    }

    return simplified
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function absorveIterations(instructions) { 

    let shuffles = [ ]
    
    let factor = instructions

    // exponentiation by squaring

    const start = LENGTH - ITERATIONS - 1

    for (let iterationsLeft = start; iterationsLeft != 0; iterationsLeft = Math.floor(iterationsLeft / 2)) {

        if (iterationsLeft % 2 == 1) {

            for (const inst of factor) { shuffles.push(inst) }
            
            shuffles = simplify(shuffles)
        }

        const temp = factor.slice()
        
        for (const inst of temp) { factor.push(inst) }
    
        factor = simplify(factor)        
    }
    return shuffles
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function shuffle(instructions) {

    let pos = BigInt(2020)

    for (const inst of instructions) {
    
        if (inst.kind == "deal") {
        
            let increment = BigInt(inst.value)
            
            pos *= increment
            pos %= BigInt(LENGTH)
        }

        else if (inst.kind == "reverse") {
        
            pos -= BigInt(LENGTH - 1)
        } 
        
        else { // inst.kind == "cut"
        
            const cut = inst.value

            if (pos < BigInt(cut)) {

                pos += BigInt(LENGTH - cut)
            } 
            else {

                pos -= BigInt(cut)
            }
        }
    }

    return parseInt(pos)
}

/////////////////////////////////////////////////////////// 
		
main()

