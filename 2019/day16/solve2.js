"use strict"

// solving the puzzle takes (my computer) 0.180s

/* 
    consider we have this input:

    a b c d X f

    X is the position 5 (base one)

    the pattern for X (position 5) is:   

    0 0 0 0 1 1 (1 1 1 0 0 0 0 0 -1 -1 -1 -1 -1...)

    HINTS:
    
    -> the pattern starts with 4 ZEROs: we can IGNORE everything
    that comes before X (because it would be multiplied by 
    zero and then added to the total value)

    -> as X is close to the end, it and everything beyond will
    be mutlipied by POSITIVE ONE: don't need to multiply
    
    -> we can have a very simplified, straight forward program!
*/

// this code expects that the target segment is on the second half of the input //


const DATA = [ ]

var repeats = 10000

const maxPhases = 100


function main() {

    processInput()

    let offset = parseInt(DATA.slice(0, 7).join(""))
    
    while (offset >= DATA.length) { offset -= DATA.length; repeats -= 1 } // aborting useless data
    
    let state = repeatArray(DATA, repeats).slice(offset)
    
    let nextState = new Array(state.length)
            
    for (let n = 0; n < maxPhases; n++) { 
      
        let sum = 0
        
        for (let index = state.length - 1; index >= 0; index--) { 
        
            // we just run the loop once, not once for each item of the state,
            // imagine running 500_000 times a loop for 500_000 items
            
            // the loop must start at the end, because the sum increases backwards!
        
            sum += state[index]
            
            nextState[index] = sum % 10        
        }

        [ state, nextState ] = [ nextState, state ]
    }

    console.log("the answer is", state.slice(0, 8).join(""))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    for (const c of input) { DATA.push(parseInt(c)) }
}

function repeatArray(source, times) {

    const array = new Array(source.length * times)
    
    for (let n = 0; n < times; n++) {
    
        const offset = source.length * n
        
        for (let index = 0; index < source.length; index++) {
        
            array[offset + index] = source[index]
        }
    }
    return array
}

main()

