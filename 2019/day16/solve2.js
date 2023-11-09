"use strict"

// solving the puzzle takes (my computer) 0.240s


// this code is heavilly based on the solution by Bimperl (https://www.reddit.com/user/Bimperl)
// at https://www.reddit.com/r/adventofcode/comments/ebai4g/comment/fb5zy78

// this code expects that at least the first half of data be skipped

const DATA = [ ]

const repeats = 10000

const maxPhases = 100


function main() {

    processInput()

    const skip = parseInt(DATA.slice(0, 7).join(""))
    
    let state = repeatArray(DATA, repeats).slice(skip)
    
    let nextState = new Array(state.length)
            
    for (let n = 0; n < maxPhases; n++) { 
      
        let count = 0
        
        for (let location = state.length - 1; location >= 0; location--) {
        
            count = (count + state[location]) % 10
            nextState[location] = count
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

