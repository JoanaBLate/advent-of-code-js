"use strict"

// solving the puzzle takes (my computer) 0.031s

const input = Deno.readTextFileSync("input.txt").trim()

const DATA = [ ]

const DIM = 10

const FLASHED = [ ]

var FLASHES = 0


function main() {

    processInput()
  
    for (let n = 0; n < 100; n++) { playRound() }
    
    console.log("the answer is", FLASHES)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split("")

        const numbers = tokens.map(function (x) { return parseInt(x) })
        
        DATA.push(numbers)
        
        FLASHED.push(new Uint8Array(DIM))
    }
}

///////////////////////////////////////////////////////////

function playRound() {

    resetFlashed()

    increaseEnergyLevel()
    
    flash()
}

function resetFlashed() {

    for (const line of FLASHED) {
    
        for (let n = 0; n < DIM; n++) { line[n] = 0 }    
    }
}

function increaseEnergyLevel() {

    for (let row = 0; row < DIM; row++) {    

        for (let col = 0; col < DIM; col++) { DATA[row][col] += 1 }
    }
}

function flash() {

    for (let row = 0; row < DIM; row++) {    

        for (let col = 0; col < DIM; col++) { tryFlash(row, col) }
    }
}

function tryFlash(row, col) {        

    if (DATA[row][col] <= 9) { return }
    
    if (FLASHED[row][col] != 0) { return }
    
    DATA[row][col] = 0
    
    FLASHED[row][col] = 1
    
    FLASHES += 1
    
    tryIncrease(row - 1, col - 1)
    tryIncrease(row - 1, col)
    tryIncrease(row - 1, col + 1) 
      
    tryIncrease(row, col - 1)
    tryIncrease(row, col + 1)   
    
    tryIncrease(row + 1, col - 1)
    tryIncrease(row + 1, col)
    tryIncrease(row + 1, col + 1)            
}

function tryIncrease(row, col) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > DIM - 1) { return }
    if (col > DIM - 1) { return }
            
    if (FLASHED[row][col] != 0 ) { return }

    DATA[row][col] += 1 

    tryFlash(row, col)
}

main()

