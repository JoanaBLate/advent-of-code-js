"use strict"

// solving the puzzle takes (my computer) 0.024s

const screen = [ ]

function main() {

    for (let n = 0; n < 6; n++) { screen.push(createRow()) }
    
    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { executeInstruction(rawLine.trim()) }
    
    let count = 0
    
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 50; c++) {
        
            if (screen[r][c] == true) { count += 1 }
        }
    }
        
    console.log("the number of lit pixels is", count)
}

function createRow() {
    
    const array = new Array(50)
    
    array.fill(false)
    
    return array
}

function executeInstruction(instruction) {    

    if (instruction.startsWith("rect")) { executeRect(instruction); return }
    if (instruction.startsWith("rotate row")) { rotateRow(instruction); return }
    if (instruction.startsWith("rotate col")) { rotateCol(instruction); return }
}
    
function executeRect(instruction) {

    const tokens = instruction.replace("rect ", "").split("x")

    const wide = parseInt(tokens.shift())
    
    const tall = parseInt(tokens.shift())
    
    for (let row = 0; row < tall; row++) {

        for (let col = 0; col < wide; col++) {
        
            screen[row][col] = true
        }
    }
}

function rotateRow(instruction) {

    const tokens = instruction.replace("rotate row y=", "").split("by")

    const y = parseInt(tokens.shift())
    
    const count = parseInt(tokens.shift())
    
    const row = screen[y]
    
    for (let n = 0; n < count; n++) { row.unshift(row.pop()) }
}

function rotateCol(instruction) {

    const tokens = instruction.replace("rotate column x=", "").split("by")

    const x = parseInt(tokens.shift())
    
    const count = parseInt(tokens.shift())
    
    for (let n = 0; n < count; n++) { rotateColOnce(x) }
}

function rotateColOnce(x) {

    const last = screen[5][x]

    for (let y = 5; y > 0; y--) { screen[y][x] = screen[y - 1][x] }
    
    screen[0][x] = last
}

main()

