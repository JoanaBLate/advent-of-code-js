"use strict"

/*

        this program is just for helping UNDERSTAND
        
        the essence of the whole geometry of the puzzle 2
        
        
        >> YOU MUST USE A SMALL FONT SIZE (probably 4 )
*/


const input = Deno.readTextFileSync("input.txt").trim()

var MAP = null

var WIDTH = 0 // 393

var HEIGHT = 0 // 393

const FREE = 0

const ROCK = 1

var TARGET = 2 // mutable

var FUTURE = 3 // mutable


function main() {

    processInput()
    
    walk(196) // with 196 it touches the borders
    
    show() 
    
    console.log("\n9 x 9 map - just for vizualization and understanding")

    console.log("\nprobably you need to REDUCE THE FONT SIZE of your monitor to 4")
}

///////////////////////////////////////////////////////////

function processInput() {

    const lines = input.split("\n")
    
    const tripleLines = [ ]
    
    for (const line of lines) { tripleLines.push(line.trim().repeat(3)) }
    
    const height = lines.length
    
    for (let n = 0; n < height; n++) { tripleLines.push(tripleLines[n]) }
    
    for (let n = 0; n < height; n++) { tripleLines.push(tripleLines[n]) }
    
    HEIGHT = tripleLines.length
    
    WIDTH = tripleLines[0].trim().length
        
    MAP = new Uint8Array(WIDTH * HEIGHT)
    
    let startCount = 0

    for (let row = 0; row < HEIGHT; row++) {
    
        for (let col = 0; col < WIDTH; col++) {
            
            const index = row * WIDTH + col
        
            if (tripleLines[row][col] == "#") { MAP[index] = ROCK; continue }
            
            if (tripleLines[row][col] != "S") { continue }
            
            startCount += 1
            
            if (startCount == 5) { MAP[index] = TARGET }
        }
    }
}

///////////////////////////////////////////////////////////

function walk(maxStep) {

    let step = 0
    
    while (true) {

        step += 1

        if (step > maxStep) { return }
        
        if (step % 2 == 0) { TARGET = 3; FUTURE = 2 } else { TARGET = 2; FUTURE = 3 }
        
        for (let row = 0; row < HEIGHT; row++) {
        
            for (let col = 0; col < WIDTH; col++) {
            
                const index = row * WIDTH + col
            
                if (MAP[index] != TARGET) { continue }
                
                MAP[index] = FREE

                tryWalk(row - 1, col)
                tryWalk(row + 1, col)
                tryWalk(row, col - 1)
                tryWalk(row, col + 1)
            }
        } 
    }
}

function tryWalk(row, col) {

    if (row < 0) { return }
    if (col < 0) { return }
    if (row > HEIGHT - 1) { return }
    if (col > WIDTH  - 1) { return }
    
    const index = row * WIDTH + col
    
    if (MAP[index] == ROCK) { return }

    MAP[index] = FUTURE
}

///////////////////////////////////////////////////////////

function show() {

    for (let row = 0; row < HEIGHT; row++) {
    
        let s = ""
        
        for (let col = 0; col < WIDTH; col++) {
        
            const index = row * WIDTH + col

            s += ".#TF"[MAP[index]]
        }
        console.log(s)
    }
}    

main()

