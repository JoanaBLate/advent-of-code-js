// solution for https://adventofcode.com/2024/day/21 part 1

"use strict"

const input = Deno.readTextFileSync("day21-input.txt").trim()

const allCodes = [ ]

const numericPadSteps = { } // shortest and simplest paths between buttons (redundant when possible)

const directionalPadSteps = { // shortest path between buttons

    // doesn't need redundant paths (because of the design of the keypad?)
    
    "^ to ^": "",
    "^ to v": "v",
    "^ to <": "v<",
    "^ to >": "v>",
    "^ to A": ">",
    
    "v to ^": "^",
    "v to v": "",
    "v to <": "<",
    "v to >": ">",
    "v to A": "^>",
    
    "< to ^": ">^",
    "< to v": ">",
    "< to <": "",
    "< to >": ">>",
    "< to A": ">>^",
    
    "> to ^": "^<",
    "> to v": "<",
    "> to <": "<<",
    "> to >": "",
    "> to A": "^",
    
    "A to ^": "<",
    "A to v": "v<",
    "A to <": "v<<",
    "A to >": "v",
    "A to A": ""
}


function main() {

    processInput()

    fillNumericPadSteps()

    let complexity = 0

    for (const code of allCodes) { 
    
        const initialDirectionalPaths = runNumericBot(code)
        
        const leastSteps = calcLeastDirectionalSteps(initialDirectionalPaths)
        
        complexity += parseInt(code) * leastSteps
    }
      
    console.log("the answer is", complexity)    
}

function processInput() {
    
    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { allCodes.push(rawLine.trim()) }
}

///////////////////////////////////////////////////////////////////////////////

function fillNumericPadSteps() {

    const keypad = { }
    
    let row = -1
    
    for (const line of [ "789", "456", "123", "!0A" ]) {
        
        row += 1
        let col = -1
        
        for (const char of line) {
     
            col += 1
            keypad[char]  = { "row": row, "col": col }
        }
    }
    
    const symbols = "0123456789A"

    const forbidden = keypad["!"]

    for (const symbolA of symbols) {
        for (const symbolB of symbols) {
        
            const id = symbolA + " to " + symbolB 
            
            if (symbolA == symbolB) { numericPadSteps[id] = [ "" ]; continue }
            
            const a = keypad[symbolA]
            const b = keypad[symbolB]
            
            numericPadSteps[id] = findPadPaths(a.row, a.col, b.row, b.col, forbidden.row, forbidden.col)
        }
    }
}

function findPadPaths(rowA, colA, rowB, colB, forbiddenRow, forbiddenCol) {

    const goodPaths = [ ]

    let pathsToGo = [ "" ]
    
    while (true) {
    
        const newPathsToGo = [ ]
            
        for (const path of pathsToGo) {
            
            let row = rowA
            let col = colA
  
            for (const symbol of path) {
            
                if (symbol == "^") { row -= 1 }
                if (symbol == "v") { row += 1 }
                if (symbol == "<") { col -= 1 }
                if (symbol == ">") { col += 1 }
            }
            
            if (row == forbiddenRow  &&  col == forbiddenCol) { continue }
              
            if (row == rowB  &&  col == colB) { 
            
                if (isSimplePath(path)) { goodPaths.push(path) }
                continue 
            }
                
            if (rowB < row) { newPathsToGo.push(path + "^") }
            if (rowB > row) { newPathsToGo.push(path + "v") }
            if (colB < col) { newPathsToGo.push(path + "<") }
            if (colB > col) { newPathsToGo.push(path + ">") }
        }
        
        if (newPathsToGo.length == 0) { return goodPaths }
        
        pathsToGo = newPathsToGo   
    }
}

function isSimplePath(path) { // equal symbols must be together

    const head = path[0]
    
    const length = 1 + path.lastIndexOf(head)
    
    return path.startsWith(head.repeat(length))
}

///////////////////////////////////////////////////////////////////////////////

function runNumericBot(code) { // generates the initial sequences

    let position = "A"

    let paths = [ "" ]

    for (const symbol of code) { 
        
        const newPaths = [ ]

        const tokens = numericPadSteps[position + " to " + symbol]
        
        position = symbol

        for (const token of tokens) {
        
            for (const path of paths) { newPaths.push(path + token + "A") }
        }
        
        paths = newPaths
    }
    return paths
}

///////////////////////////////////////////////////////////////////////////////

function calcLeastDirectionalSteps(initialDirectionalPaths) {
  
    let minSize = 1000 * 1000
    
    for (const path of initialDirectionalPaths) {

        const path2 = runDirectionalBot(path)
        
        const path3 = runDirectionalBot(path2)
        
        const size = path3.length
            
        if (size < minSize) { minSize = size } 
    }

   return minSize
}     

function runDirectionalBot(buttons) { // generates the next sequence (only one)

    let position = "A"

    let path = ""
    
    for (const symbol of buttons) { 

        const token = directionalPadSteps[position + " to " + symbol]

        path += token + "A"
                
        position = symbol        
    }
    
    return path
}   

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

