// solution for https://adventofcode.com/2024/day/21 part 1

"use strict"

const input = Deno.readTextFileSync("day21-input.txt").trim()

const allCodes = [ ]

const numericKeypad = {

    "7": { "row": 0, "col": 0 },
    "8": { "row": 0, "col": 1 },
    "9": { "row": 0, "col": 2 },

    "4": { "row": 1, "col": 0 },
    "5": { "row": 1, "col": 1 },
    "6": { "row": 1, "col": 2 },
    
    "1": { "row": 2, "col": 0 },
    "2": { "row": 2, "col": 1 },
    "3": { "row": 2, "col": 2 },
    
    "!": { "row": 3, "col": 0 },
    "0": { "row": 3, "col": 1 },
    "A": { "row": 3, "col": 2 }
}

const directionalKeypad = {

    "!": { "row": 0, "col": 0 },
    "^": { "row": 0, "col": 1 },
    "A": { "row": 0, "col": 2 },

    "<": { "row": 1, "col": 0 },
    "v": { "row": 1, "col": 1 },
    ">": { "row": 1, "col": 2 }
}

const numericPadSteps = { } // shortest paths between keys

const directionalPadSteps = { } // shortest paths between keys


function main() {

    processInput()

    fillPadSteps(numericKeypad, "0123456789A", numericPadSteps)
    
    fillPadSteps(directionalKeypad, "^v<>A", directionalPadSteps)
    

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

function fillPadSteps(keypad, symbols, padSteps) {

    const forbidden = keypad["!"]

    for (const symbolA of symbols) {
        for (const symbolB of symbols) {
        
            const id = symbolA + "~" + symbolB 
            
            if (symbolA == symbolB) { padSteps[id] = [ "" ]; continue }
            
            const a = keypad[symbolA]
            const b = keypad[symbolB]
            
            padSteps[id] = findPadPaths(a.row, a.col, b.row, b.col, forbidden.row, forbidden.col)
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

function runNumericBot(code) {

    return runBot(code, numericPadSteps) 
}

function runDirectionalBot(commands) {

    return runBot(commands, directionalPadSteps)
}

function runBot(data, padSteps) {

    let position = "A"

    let paths = [ "" ]

    for (const symbol of data) { 
        
        const newPaths = [ ]

        const tokens = padSteps[position + "~" + symbol]
        
        position = symbol

        for (const token of tokens) {
        
            for (const path of paths) { newPaths.push(path + token + "A") }
        }
        
        paths = newPaths
    }
    return paths
}

///////////////////////////////////////////////////////////////////////////////

function runHuman(data) { // gives the length of the path

    // different datas may produce different child path lengths, but
    // all child paths of each received data have the same length (among them)

    let position = "A"

    let path = ""

    for (const symbol of data) { 
        
        const tokens = directionalPadSteps[position + "~" + symbol]
        
        const token = tokens[0] // all tokens have the same length
        
        position = symbol

        path += token + "A"
    }
    
    return path.length
}

///////////////////////////////////////////////////////////////////////////////

function calcLeastDirectionalSteps(initialDirectionalPaths) {
    
    let minSize = 1000 * 1000
    
    for (const path of initialDirectionalPaths) {
    
        const newDirectionalPaths = runDirectionalBot(path)
        
        // all paths inside (a lot of) newPaths have the same length
        // and each one will have children of the same length among them;
        // we only need to search on one path
        
        const newPath = newDirectionalPaths[0]
        
        const size = runHuman(newPath)
            
        if (size < minSize) { minSize = size } 
    }

   return minSize
}

///////////////////////////////////////////////////////////////////////////////

console.time("execution time")
main()
console.timeEnd("execution time") // 1ms

