"use strict"

// solving the puzzle takes (my computer) 0.580s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const tokens = rawText.split(" ")
    
    const targetCol = parseInt(tokens.pop().replace(".", ""))
    
    tokens.pop() // column
    
    const targetRow = parseInt(tokens.pop().replace(",", ""))
    
    const linearIndex = calcLinearIndexInDiagonalGrid(targetRow, targetCol)
    
    let code = 20151125 // index 1 row 1  col 1
    
    for (let n = 1; n < linearIndex; n++) { code = calcNextCode(code) }
    
    console.log("code for the machine is", code)
}

function calcLinearIndexInDiagonalGrid(targetRow, targetCol) {

    let row = 1
    let col = 1

    let index = 0
    let rowAtDiagonalStart = 0
    
    while (true) {

        if (row == targetRow  &&  col == targetCol) { break }
 
        index += 1
        
        if (row == 1) { // must start new diagonal
            
            col = 1
             
            rowAtDiagonalStart += 1
            
            row = rowAtDiagonalStart
            
            continue 
        }       
        else {
            
            row -= 1
            
            col += 1
        }        
    }
    
    return index
}

function calcNextCode(current) {

    return (252533 * current) % 33554393
}

main()

