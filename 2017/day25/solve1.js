"use strict"

// solving the puzzle takes (my computer) 0.200s

// THIS SOLUTION IS SPECIALIZED FOR THE CURRENT INPUT //


const maxNumberOfSteps = 12134527

const tape = new Uint8Array(12 * 1000 * 1000) // 6 million to each side - 1

var pointer = 6 * 1000 * 1000

var nextAction = runStateA

function main() {
    
    let steps =  0 
    
    while (true) {
    
        steps += 1
        
        if (steps > maxNumberOfSteps) { break }
        
        nextAction()
    }
    
    let count = 0

    for (let i = 0; i< 12000000; i++) { count += tape[i] }
    
    console.log("the checksum is", count)
}
        
function runStateA() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1
        
        pointer += 1

        nextAction = runStateB
    }   
    else {
    
        tape[pointer] = 0
        
        pointer -= 1

        nextAction = runStateC
    }
}

function runStateB() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1
        
        pointer -= 1

        nextAction = runStateA
    }   
    else {
    
        pointer += 1

        nextAction = runStateC
    }
}

function runStateC() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1

        pointer += 1

        nextAction = runStateA
    }   
    else {
    
        tape[pointer] = 0
        
        pointer -= 1

        nextAction = runStateD
    }
}
      
function runStateD() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1
        
        pointer -= 1

        nextAction = runStateE
    }   
    else {

        pointer -= 1

        nextAction = runStateC
    }
}
        
function runStateE() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1

        pointer += 1

        nextAction = runStateF
    }   
    else {
    
        pointer += 1

        nextAction = runStateA
    }
}
        
function runStateF() {

    if (tape[pointer] == 0) {
    
        tape[pointer] = 1

        pointer += 1

        nextAction = runStateA
    }   
    else {
    
        pointer += 1

        nextAction = runStateE
    }
}

main()

