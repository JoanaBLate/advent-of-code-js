"use strict"

// solving the puzzle takes (my computer) 0.030s

/* My best **ATTEMPT** to solve the part 2 without using heavy math */

// GOING REVERSED IS NICE BUT USELESS BECAUSE I DONT HAVE 
// THE FINAL RESULT TO REVERT (it is not 2020)

// EVEN IF IT WORKED, I DON'T KNOW HOW TO "REDO" IT 10 TRILLION TIMES
// THERE IS NO SIMPLE/REGULAR PATTERN OF REPETITION (part 1):
//  when lenght is 2006, it takes 2632 turns to get back to the original state
//  when lenght is 2007, it takes 5003 turns to get back to the original state
//  when lenght is 2008, it takes 7539 turns to get back to the original state


const instructions = [ ] // reversed order!

const LENGTH = 10007 // for puzzle 1

var POSITION = 5540 // -> 2019 for puzzle 1


function main() {

    processInput()
       
    shuffle()
     
    console.log("going **backwards once**, we find", POSITION)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const inst = rawLine.trim()
    
        if (inst == "deal into new stack") { 
        
            instructions.unshift(dealIntoNewStackReversed)
            continue 
        }
    
        if (inst.startsWith("deal with increment")) { 
        
            const value = parseInt(inst.split(" ").pop())
            
            instructions.unshift(function () { dealWithIncrementReversed(value) })
            continue 
        }
        
        if (inst.startsWith("cut")) { 
        
            const value = parseInt(inst.split(" ").pop())
            
            instructions.unshift(function () { cutReversed(value) })
            continue 
        }        
    }
}

///////////////////////////////////////////////////////////

function shuffle() {

    for (const instruction of instructions) { instruction() }
}

function dealIntoNewStackReversed() {  
    
    // standard function:
    // 0 1 2 3 4 5 6 7 8 9  // before
    // 9 8 7 6 5 4 3 2 1 0  // after

    const last = LENGTH - 1
    
    const currentPos = POSITION
    
    const previousPos = last - currentPos
    
    POSITION = previousPos
}

function cutReversed(amount) {  

    // standard cut 6:
    // 0 1 2 3 4 5          // before
    //             6 7 8 9  // before

    //         0 1 2 3 4 5  // after
    // 6 7 8 9              // after

    while (amount < 0) { amount += LENGTH }

    const margin = LENGTH - amount
     
    const currentPos = POSITION

    let previousPos
    
    if (currentPos <= margin) { 
    
        previousPos = currentPos + amount 
    } 
    else { 
    
        previousPos = currentPos - margin 
    }
 
    POSITION = previousPos
}

function dealWithIncrementReversed(increment) {

    const segment = createIncDealFirstSegment(LENGTH, increment)
    
    const count = Math.floor(POSITION / increment)
    
    for (let n = 0; n < increment; n++) { segment[n] += count }
    
    const indexInSegment = POSITION % increment

    POSITION = segment[indexInSegment]
}

///////////////////////////////////////////////////////////

function createIncDealFirstSegment(length, increment) {

    // all segments follow the same pattern, so
    // we don't need to create the last segment 
    // for knowing about the tail: the first segment
    // is all we need
    
    const firstSegment = new Array(increment) // first segment of the virtual resulting array
    
    firstSegment[0] = 0
    
    const numberOfFullSegments = Math.floor(length / increment)
    
    const lengthOfTail = length - (numberOfFullSegments * increment)
    
    let indexInFirstSegment = 0
    
    let indexInSource = 0

    for (let n = 0; n < increment - 1; n++) { doOneRound() } // 'increment - 1' because the first (zero) was already done
    
    function doOneRound() {
        
        const tailWasUsed = (indexInFirstSegment + 1) <= lengthOfTail        
        
        const amount = numberOfFullSegments + (tailWasUsed ? 1 : 0)
        
        indexInSource += amount
        
        //
    
        indexInFirstSegment += increment - lengthOfTail

        if (indexInFirstSegment >= increment) { indexInFirstSegment -= increment }
        
        firstSegment[indexInFirstSegment] = indexInSource        
    }
    
    return firstSegment
}

main()

