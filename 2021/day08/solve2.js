"use strict"

// solving the puzzle takes (my computer) 0.031s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]


function main() {

    processInput()
    
    let sum = 0
    
    for (const data of DATA) { sum += getOuput(data) }
    
    console.log("the answer is", sum)
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" | ")
        
        const inputs = parts.shift().split(" ")
        
        const outputs = parts.shift().split(" ")
        
        DATA.push({ "inputs": inputs, "outputs": outputs })
    }
}

///////////////////////////////////////////////////////////

function getOuput(data) {
    
    const symbols = findSymbols(data.inputs)

    let digits = ""
    
    for (const output of data.outputs) { digits += symbols[sort(output)] }

    return parseInt(digits)    
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function findSymbols(tokens) {
    
    const one = getTokenByLength(tokens, 2)
    const four = getTokenByLength(tokens, 4)
    const seven = getTokenByLength(tokens, 3)
    const eight = getTokenByLength(tokens, 7)

    const length5 =  getTokensByLength(tokens, 5) // two, three, five
    const length6 =  getTokensByLength(tokens, 6) // zero, six, nine
    
    const three = findThree(one, length5)
    
    const twoAndFive = excludeToken(three, length5)
    
    const two = findTwo(twoAndFive, four)
    
    const five = (twoAndFive[0] == two) ? twoAndFive[1] : twoAndFive[0]
    
    const six = findSix(one, length6)
    
    const zeroAndNine = excludeToken(six, length6)

    const zero = findZero(zeroAndNine, four)
    
    const nine = (zeroAndNine[0] == zero) ? zeroAndNine[1] : zeroAndNine[0]

    const symbols = { }
    
    symbols[sort(zero)]  = 0
    symbols[sort(one)]   = 1
    symbols[sort(two)]   = 2
    symbols[sort(three)] = 3
    symbols[sort(four)]  = 4
    symbols[sort(five)]  = 5
    symbols[sort(six)]   = 6
    symbols[sort(seven)] = 7
    symbols[sort(eight)] = 8
    symbols[sort(nine)]  = 9
    
    return symbols      
}    

function sort(s) { 

    return s.split("").sort().join("") 
}  

///////////////////////////////////////////////////////////

function getTokenByLength(list, length) {

    for (const token of list) { if (token.length == length) { return token } }
}

function getTokensByLength(sourceList, length) {

    const list = [ ]
    
    for (const token of sourceList) { 
    
        if (token.length == length) { list.push(token) }
    }
    return list
}

function excludeToken(target, sourceList) {
    
    const list = [ ]
    
    for (const token of sourceList) { if (token != target) { list.push(token) } }

    return list
}

///////////////////////////////////////////////////////////

function findThree(one, length5) {

    for (const token of length5) {

        if (token.includes(one[0])  &&  token.includes(one[1])) { return token }
    }
}

function findTwo(twoAndFive, four) {

    let misses = 0
    
    for (const letter of twoAndFive[0]) {
    
        if (! four.includes(letter)) { misses += 1 }
    }
    
    return (misses == 3) ? twoAndFive[0] : twoAndFive[1]
}

function findSix(one, length6) {

    for (const token of length6) {

        if (token.includes(one[0])  &&  token.includes(one[1])) { continue }
        
        return token
    }
}

function findZero(zeroAndNine, four) {

    let misses = 0
    
    for (const letter of zeroAndNine[0]) {
    
        if (! four.includes(letter)) { misses += 1 }
    }
    
    return (misses == 3) ? zeroAndNine[0] : zeroAndNine[1]
}

main()

