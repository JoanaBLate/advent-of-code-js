"use strict"

// solving the puzzle takes (my computer) 0.030s

var depth = 0

var targetRow = 0
var targetCol = 0

var width = 0
var height = 0

const table = [ ] // rows of objects


function main() {

    processInput()
     
    makeTable()
    
    const risk = fillTable()
    
 // show()
    
    console.log("the answer is", risk)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    depth = parseInt(lines.shift().split(" ").pop())
    
    const tokens = lines.shift().replace("target:", "").split(",")
    
    targetCol = parseInt(tokens.shift())
    targetRow = parseInt(tokens.shift())
}

function makeTable() {

    width = targetCol + 1
    height = targetRow + 1
    
    for (let row = 0; row < height; row++) { table.push(makeRow()) }
}
    
function makeRow() {

    const cells = [ ]    
 
    for (let col = 0; col < width; col++) { cells.push({ "geoIndex": 0, "erosion": 0 }) }
    return cells
}

///////////////////////////////////////////////////////////

function fillTable() {

    let risk = 0
   
    for (let row = 0; row < height; row++) { 

        for (let col = 0; col < width; col++) { 
    
            const cell = table[row][col]
            
            if (row == 0) { 
                
                cell.geoIndex = col * 16807 
            }            
            else if (col == 0) { 
                
                cell.geoIndex = row * 48271 
            }            
            else if (row == targetRow  &&  col == targetCol) { 
                
                cell.geoIndex = 0 
            }            
            else {
        
                const topCell = table[row-1][col]
                
                const leftCell = table[row][col-1]
                
                cell.geoIndex = topCell.erosion * leftCell.erosion
            }
            
            cell.erosion = (cell.geoIndex + depth) % 20183 
            
            risk += cell.erosion % 3
        }      
    }
    return risk
}

///////////////////////////////////////////////////////////

function show() {

    console.log("")
    
    for (const line of table) { 

         let s = ""
    
        for (const cell of line) { s += ".=|"[cell.erosion % 3].padStart(3) }
        
        console.log(s) 
    }
}

main()

