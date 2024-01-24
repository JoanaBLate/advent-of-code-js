"use strict"

// solving the puzzle takes (my computer) 0.042s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

var greatestX = 0
var greatestY = 0

var WIDTH = 0
var HEIGHT = 0

const BOARD = [ ]


function main() {

    processInput()
    
    WIDTH = greatestX + 1
    HEIGHT = greatestY + 1
    
    initBoard()
    
    fillBoard()
    
    console.log("the answer is", countBoard())
    
   // show()
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" -> ")
        
        const tokensA = tokens.shift().split(",")
        
        const x1 = parseInt(tokensA.shift())
        const y1 = parseInt(tokensA.shift())
        
        const tokensB = tokens.shift().split(",")
        
        const x2 = parseInt(tokensB.shift())
        const y2 = parseInt(tokensB.shift())
        
        DATA.push({ "x1": x1, "y1": y1, "x2": x2, "y2": y2 })
        
        if (x1 > greatestX) { greatestX = x1 }
        if (x2 > greatestX) { greatestX = x2 }
        if (y1 > greatestY) { greatestY = y1 }
        if (y2 > greatestY) { greatestY = y2 }
    }
}

///////////////////////////////////////////////////////////

function initBoard() {
    
    for (let n = 0; n < HEIGHT; n++) { BOARD.push(new Uint32Array(WIDTH)) }
}

function fillBoard() {
    
    for (const data of DATA) {
    
        let x1 = data.x1
        let x2 = data.x2
    
        let y1 = data.y1
        let y2 = data.y2
        
        const deltaX = x2 - x1
        const deltaY = y2 - y1

        if (Math.abs(deltaX) == Math.abs(deltaY)) { fillBoardLine45(x1, y1, x2, deltaX, deltaY); continue }
        
        if (x1 != x2  &&  y1 != y2) { continue } // not horizontal or vertical
        
        
        if (x2 < x1) { x1 = data.x2; x2 = data.x1 }
        
        if (y2 < y1) { y1 = data.y2; y2 = data.y1 }
    
        for (let y = y1; y <= y2; y++) {

            for (let x = x1; x <= x2; x++) { BOARD[y][x] += 1 }
        }    
    }
}    

function fillBoardLine45(x1, y1, x2, deltaX, deltaY) { 
    
    let x = x1
    let y = y1
    
    while (true) {
    
        BOARD[y][x] += 1
    
        if (x == x2) { return }
        
        x += Math.sign(deltaX)
        y += Math.sign(deltaY)
    } 
}

function countBoard() {

    let count = 0
    
    for (const line of BOARD) {
    
        for (const value of line) {
        
            if (value > 1) { count += 1 }
        }
    }
    return count
}

function show() {

    console.log("")
    
    for (const line of BOARD) {
    
        let s = ""
        
        for (const item of line) {
        
            s += " " + (item == 0 ? "." : item)        
        }
        console.log(s)
    }
}

main()

