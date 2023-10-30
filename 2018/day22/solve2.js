"use strict"

// solving the puzzle takes (my computer) 0.080s

var depth = 510 // example

var targetRow =  10 // example
var targetCol =  10 // example

const ARBITRARY_EXTENSION = 60

var height = 0
var width  = 0

const ROCKY = 0
const WET = 1
const NARROW = 2

const TORCH = 0
const GEAR = 1
const NONE = 2

const INFINITE = 999999

const table = [ ]

const nearFuture = [ ] // nodes 

const distantFuture = [ ] // nodes 

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

    width = targetCol + 1 + ARBITRARY_EXTENSION
    height = targetRow + 1 + ARBITRARY_EXTENSION
    
    for (let row = 0; row < height; row++) { table.push(makeRow()) }
}

function makeRow() {

    const cells = [ ]    
 
    for (let col = 0; col < width; col++) { cells.push(createCell()) }
    return cells
}

function createCell() {

    return {         
        "erosion": 0, 
        "kind": 0, 
        "torch": INFINITE, 
        "gear": INFINITE, 
        "none": INFINITE,
        "torchScheduled": false,
        "gearScheduled": false,
        "noneScheduled": false 
    }
}

///////////////////////////////////////////////////////////

function fillTable() {

    let risk = 0

    for (let row = 0; row < height; row++) { 

        for (let col = 0; col < width; col++) { 
    
            const cell = table[row][col]
            
            let geoIndex = 0
            
            if (row == 0) { 
                
                geoIndex = col * 16807 
            }            
            else if (col == 0) { 
                
                geoIndex = row * 48271 
            }            
            else if (row == targetRow  &&  col == targetCol) { 
                
                geoIndex = 0 
            }            
            else {
        
                const topCell = table[row-1][col]
                
                const leftCell = table[row][col-1]
                
                geoIndex = topCell.erosion * leftCell.erosion
            }
            
            cell.erosion = (geoIndex + depth) % 20183
            
            cell.kind = cell.erosion % 3
            
            if (row <= targetRow  &&  col <= targetCol) { risk += cell.kind }    
        }      
    }
 // console.log("risk is", risk)
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function createNode(row, col, tool, minutes) {

    return { "row": row, "col": col, "tool": tool, "minutes": minutes }
}

function tryScheduleNear(row, col, tool, minutes) {    
         
    if (row < 0  ||  row > height - 1) { return }
    if (col < 0  ||  col > width - 1)  { return }
    
    const cell = table[row][col]
        
    if (! isValidTool(cell.kind, tool)) { return }     
         
    if (alreadyScheduled(row, col, tool)) { return }
      
    markScheduled(row, col, tool)
    
    const node = createNode(row, col, tool, minutes)   
    
    nearFuture.push(node)
}

function tryScheduleDistant(row, col, tool, minutes) {

    const cell = table[row][col]
    
    if (tool == TORCH  &&  cell.torch <= minutes) { return }
    
    if (tool == GEAR   &&  cell.gear <= minutes) { return }
    
    if (tool == NONE   &&  cell.none <= minutes) { return }
            
    const node = createNode(row, col, tool, minutes)
    
    distantFuture.push(node)
}        

function takeNodeFromSchedule() {

    if (distantFuture.length == 0) { return nearFuture.shift() }
    
    if (nearFuture.length == 0) { return distantFuture.shift() }
    
    if (nearFuture[0].minutes <= distantFuture[0].minutes) { return nearFuture.shift() }
    
    return distantFuture.shift() 
}

///////////////////////////////////////////////////////////

function markScheduled(row, col, tool) {

    const cell = table[row][col]

    if (tool == TORCH) { cell.torchScheduled = true }
    if (tool == GEAR)  { cell.gearScheduled  = true }
    if (tool == NONE)  { cell.noneScheduled  = true }
}

function alreadyScheduled(row, col, tool) {

    const cell = table[row][col]
    
    if (tool == TORCH) { return cell.torchScheduled }
    if (tool == GEAR)  { return cell.gearScheduled  }
    if (tool == NONE)  { return cell.noneScheduled  }
}

///////////////////////////////////////////////////////////

function alternativeTool(kind, tool) {

    if (kind == ROCKY)  { return tool == TORCH ? GEAR : TORCH }
    if (kind == WET)    { return tool == GEAR  ? NONE : GEAR  }
    if (kind == NARROW) { return tool == TORCH ? NONE : TORCH }
}

function isValidTool(kind, tool) {

    if (kind == ROCKY)  { return tool != NONE  }
    if (kind == WET)    { return tool != TORCH }
    if (kind == NARROW) { return tool != GEAR  }
}

///////////////////////////////////////////////////////////

function main() { 

    processInput()
    makeTable()
    fillTable() 

    nearFuture.push(createNode(0, 0, TORCH, 0))
    
    while (true) {

        const node = takeNodeFromSchedule()
        const row = node.row
        const col = node.col
        const tool = node.tool
        const minutes = node.minutes
        
        const cell = table[row][col]
        
        if (tool == TORCH) {
        
            if (cell.torch > minutes) { cell.torch = minutes } else { continue }
        }
        else if (tool == GEAR) {
        
            if (cell.gear > minutes) { cell.gear = minutes } else { continue }
        }
        else { // tool == NONE
        
            if (cell.none > minutes) { cell.none = minutes } else { continue }        
        }
                        
        if (row == targetRow  &&  col == targetCol  &&  tool == TORCH) { break }
        
        const newTool = alternativeTool(cell.kind, tool)   

        tryScheduleDistant(row, col, newTool, minutes + 7) // + 7: just changing tool, not changing row or col
         
        tryScheduleNear(row-1, col, tool, minutes + 1)
        tryScheduleNear(row+1, col, tool, minutes + 1)
        tryScheduleNear(row, col-1, tool, minutes + 1)
        tryScheduleNear(row, col+1, tool, minutes + 1)
    }
    
    console.log("\nthe answer is", table[targetRow][targetCol].torch)
}       

main()

