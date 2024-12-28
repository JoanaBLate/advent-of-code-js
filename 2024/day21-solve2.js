// solution for https://adventofcode.com/2024/day/21 part 2

// this solution doesn't check all combinations of directional commands
// at any possible branch;
// instead it uses only directional commands that performed better when 
// tested, so...

// *** MAYBE THIS WILL NOT WORK FOR YOUR INPUT ***

"use strict"

const input = Deno.readTextFileSync("day21-input.txt").trim()

const allCodes = [ ]

const numericCommandsByMove = { // simplest commands only

    "0 to 0": [ "A" ],
    "0 to 1": [ "^<A" ],
    "0 to 2": [ "^A" ],
    "0 to 3": [ "^>A", ">^A" ],
    "0 to 4": [ "^^<A" ],
    "0 to 5": [ "^^A" ],
    "0 to 6": [ "^^>A", ">^^A" ],
    "0 to 7": [ "^^^<A" ],
    "0 to 8": [ "^^^A" ],
    "0 to 9": [ "^^^>A", ">^^^A" ],
    "0 to A": [ ">A" ],
    "1 to 0": [ ">vA" ],
    "1 to 1": [ "A" ],
    "1 to 2": [ ">A" ],
    "1 to 3": [ ">>A" ],
    "1 to 4": [ "^A" ],
    "1 to 5": [ "^>A", ">^A" ],
    "1 to 6": [ "^>>A", ">>^A" ],
    "1 to 7": [ "^^A" ],
    "1 to 8": [ "^^>A", ">^^A" ],
    "1 to 9": [ "^^>>A", ">>^^A" ],
    "1 to A": [ ">>vA" ],
    "2 to 0": [ "vA" ],
    "2 to 1": [ "<A" ],
    "2 to 2": [ "A" ],
    "2 to 3": [ ">A" ],
    "2 to 4": [ "^<A", "<^A" ],
    "2 to 5": [ "^A" ],
    "2 to 6": [ "^>A", ">^A" ],
    "2 to 7": [ "^^<A", "<^^A" ],
    "2 to 8": [ "^^A" ],
    "2 to 9": [ "^^>A", ">^^A" ],
    "2 to A": [ "v>A", ">vA" ],
    "3 to 0": [ "v<A", "<vA" ],
    "3 to 1": [ "<<A" ],
    "3 to 2": [ "<A" ],
    "3 to 3": [ "A" ],
    "3 to 4": [ "^<<A", "<<^A" ],
    "3 to 5": [ "^<A", "<^A" ],
    "3 to 6": [ "^A" ],
    "3 to 7": [ "^^<<A", "<<^^A" ],
    "3 to 8": [ "^^<A", "<^^A" ],
    "3 to 9": [ "^^A" ],
    "3 to A": [ "vA" ],
    "4 to 0": [ ">vvA" ],
    "4 to 1": [ "vA" ],
    "4 to 2": [ "v>A", ">vA" ],
    "4 to 3": [ "v>>A", ">>vA" ],
    "4 to 4": [ "A" ],
    "4 to 5": [ ">A" ],
    "4 to 6": [ ">>A" ],
    "4 to 7": [ "^A" ],
    "4 to 8": [ "^>A", ">^A" ],
    "4 to 9": [ "^>>A", ">>^A" ],
    "4 to A": [ ">>vvA" ],
    "5 to 0": [ "vvA" ],
    "5 to 1": [ "v<A", "<vA" ],
    "5 to 2": [ "vA" ],
    "5 to 3": [ "v>A", ">vA" ],
    "5 to 4": [ "<A" ],
    "5 to 5": [ "A" ],
    "5 to 6": [ ">A" ],
    "5 to 7": [ "^<A", "<^A" ],
    "5 to 8": [ "^A" ],
    "5 to 9": [ "^>A", ">^A" ],
    "5 to A": [ "vv>A", ">vvA" ],
    "6 to 0": [ "vv<A", "<vvA" ],
    "6 to 1": [ "v<<A", "<<vA" ],
    "6 to 2": [ "v<A", "<vA" ],
    "6 to 3": [ "vA" ],
    "6 to 4": [ "<<A" ],
    "6 to 5": [ "<A" ],
    "6 to 6": [ "A" ],
    "6 to 7": [ "^<<A", "<<^A" ],
    "6 to 8": [ "^<A", "<^A" ],
    "6 to 9": [ "^A" ],
    "6 to A": [ "vvA" ],
    "7 to 0": [ ">vvvA" ],
    "7 to 1": [ "vvA" ],
    "7 to 2": [ "vv>A", ">vvA" ],
    "7 to 3": [ "vv>>A", ">>vvA" ],
    "7 to 4": [ "vA" ],
    "7 to 5": [ "v>A", ">vA" ],
    "7 to 6": [ "v>>A", ">>vA" ],
    "7 to 7": [ "A" ],
    "7 to 8": [ ">A" ],
    "7 to 9": [ ">>A" ],
    "7 to A": [ ">>vvvA" ],
    "8 to 0": [ "vvvA" ],
    "8 to 1": [ "vv<A", "<vvA" ],
    "8 to 2": [ "vvA" ],
    "8 to 3": [ "vv>A", ">vvA" ],
    "8 to 4": [ "v<A", "<vA" ],
    "8 to 5": [ "vA" ],
    "8 to 6": [ "v>A", ">vA" ],
    "8 to 7": [ "<A" ],
    "8 to 8": [ "A" ],
    "8 to 9": [ ">A" ],
    "8 to A": [ "vvv>A", ">vvvA" ],
    "9 to 0": [ "vvv<A", "<vvvA" ],
    "9 to 1": [ "vv<<A", "<<vvA" ],
    "9 to 2": [ "vv<A", "<vvA" ],
    "9 to 3": [ "vvA" ],
    "9 to 4": [ "v<<A", "<<vA" ],
    "9 to 5": [ "v<A", "<vA" ],
    "9 to 6": [ "vA" ],
    "9 to 7": [ "<<A" ],
    "9 to 8": [ "<A" ],
    "9 to 9": [ "A" ],
    "9 to A": [ "vvvA" ],
    "A to 0": [ "<A" ],
    "A to 1": [ "^<<A" ],
    "A to 2": [ "^<A", "<^A" ],
    "A to 3": [ "^A" ],
    "A to 4": [ "^^<<A" ],
    "A to 5": [ "^^<A", "<^^A" ],
    "A to 6": [ "^^A" ],
    "A to 7": [ "^^^<<A" ],
    "A to 8": [ "^^^<A", "<^^^A" ],
    "A to 9": [ "^^^A" ],
    "A to A": [ "A" ]
}

const directionalCommandsByMove = { // shortest and simplest commands only    

    "^ to ^": "A",
    "^ to v": "vA",
    "^ to <": "v<A",
    "^ to >": "v>A", // ">vA"  does not result in the shortest sequence 
    "^ to A": ">A",
    
    "v to ^": "^A",
    "v to v": "A",
    "v to <": "<A",
    "v to >": ">A",
    "v to A": "^>A", // ">^A" does not result in the shortest sequence 
    
    "< to ^": ">^A", 
    "< to v": ">A",
    "< to <": "A",
    "< to >": ">>A",
    "< to A": ">>^A", 
    
    "> to ^": "<^A", // "^<A" does not result in the shortest sequence 
    "> to v": "<A",
    "> to <": "<<A",
    "> to >": "A",
    "> to A": "^A",
    
    "A to ^": "<A",
    "A to v": "<vA", // "v<A" does not result in the shortest sequence 
    "A to <": "v<<A",
    "A to >": "vA",
    "A to A": "A"
}

const memory = { }


function main() {

    processInput()

    let complexity = 0

    for (const code of allCodes) { complexity += calcComplexityOf(code) }
      
    console.log("the answer is", complexity)    
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { allCodes.push(rawLine.trim()) }
}

function calcComplexityOf(code) {

    const initialSequences = generateInitialSequences(code)

    const leastSteps = calcLeastSteps(initialSequences)
    
    return parseInt(code) * leastSteps
}

///////////////////////////////////////////////////////////////////////////////

function generateInitialSequences(code) { 

    let lastButton = "A"

    let sequences = [ "" ]

    for (const button of code) { 
        
        const temp = [ ]

        const commands = numericCommandsByMove[lastButton + " to " + button]
        
        lastButton = button

        for (const command of commands) {
        
            for (const sequence of sequences) { temp.push(sequence + command) }
        }
        
        sequences = temp
    }
    
    return sequences
}      

///////////////////////////////////////////////////////////////////////////////

function calcLeastSteps(initialSequences) {
  
    let minLength = Infinity
    
    for (const sequence of initialSequences) {

        const length = findFutureLength(sequence)

        if (length < minLength) { minLength = length }             
    }        

   return minLength
}     

function findFutureLength(sequence) {

    const tokens = tokenize(sequence)

    let length = 0
    
    for (const token of tokens) { length += findLengthFromExpandedToken(token, 25) }

    return length
}

function tokenize(sequence) {

    const tokens = [ ]

    let token = ""
    
    for (const button of sequence) {

        token += button
        
        if (button == "A") { tokens. push(token); token = "" }
    }
    return tokens
}

///////////////////////////////////////////////////////////////////////////////

function findLengthFromExpandedToken(sourceToken, roundsToGo) { 

    if (roundsToGo == 0) { return sourceToken.length }

    const id = sourceToken + "~" + roundsToGo
    
    if (memory[id] != undefined) { return memory[id] }
    
    //
    
    let length = 0

    let lastButton = "A"

    for (const button of sourceToken) {

        const newToken = directionalCommandsByMove[lastButton + " to " + button]
       
        lastButton = button
        
        length += findLengthFromExpandedToken(newToken, roundsToGo - 1)
    }
        
    memory[id] = length
    return length
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

