"use strict"

// solving the puzzle takes (my computer) 0.280s


// this code is heavilly based on the solution by Bimperl (https://www.reddit.com/user/Bimperl)
// at https://www.reddit.com/r/adventofcode/comments/ebai4g/comment/fb5zy78


const DATA = [ ]


function main() {

    processInput()
    
    const repeats = 10000

    const wat = Number(DATA.slice(0, 7).join(""))
    
    const code = repeatArray(DATA, repeats).slice(wat)
    
    const totalIterations = 100
    
    const state = code.slice()
    
    const nextState = new Array(code.length)
    
    // the code only works for input with code which is after the 0.5 mark
    
    for (let iteration = 0; iteration < totalIterations; iteration++) {
    
        let count = 0
        
        for (let location = state.length - 1; location >= 0; location--) {
        
            count = (count + state[location]) % 10
            nextState[location] = count
        }
        
        for (let location = 0; location < state.length; location++) {
        
            state[location] = nextState[location]
        }
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

