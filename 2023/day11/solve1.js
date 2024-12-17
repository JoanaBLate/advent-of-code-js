"use strict"

// solving the puzzle takes (my computer) 0.040s

var DATA = [ ]

const GALAXIES = { }


function main() {

    processInput()

    insertRows()    
        
    insertCols()    
        
    noteGalaxies()
     
     let sum = 0
     
     const names = Object.keys(GALAXIES)
     
     for (const nameA of names) {

         for (const nameB of names) {
         
            if (nameA == nameB) { continue }
            
            const a = GALAXIES[nameA]
            const b = GALAXIES[nameB]
            
            const distance = Math.abs(b.row - a.row) + Math.abs(b.col - a.col)
     
            sum += distance
        }
    }
     
    console.log("the answer is", sum / 2) // because each connection was counted twice
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
           
    const lines = input.split("\n")
    
    for (const line of lines) { DATA.push(line.trim()) }
}

///////////////////////////////////////////////////////////

function insertRows() {

    const width = DATA[0].length
    
    const empty = ".".repeat(width)

    const temp = DATA
    
    DATA = [ ]

    for (const line of temp) {
    
        DATA.push(line)
        
        if (line == empty) { DATA.push(empty) }
    }
}

function insertCols() {

    const height = DATA.length

    const width = DATA[0].length

    const emptyCols = [ ]
    
    for (let col = 0; col < width; col++) {
        
        let empty = true
        
        for (let row = 0; row < height; row++) {

            if (DATA[row][col] != ".") { empty = false; continue }
        }
        
        if (empty) { emptyCols.push(col) }
    }

    const temp = DATA
    
    DATA = [ ]

    for (const line of temp) {
    
        const newline = insertColsInLine(line, emptyCols.slice())
        
        DATA.push(newline)        
    }
}

function insertColsInLine(line, emptyCols) {

    let newline = ""
    
    let n = -1
        
    while (line != "") {
    
        n += 1
    
        newline += line[0]
        
        line = line.substr(1)
        
        if (n == emptyCols[0]) { newline += "."; emptyCols.shift() }
    }

    return newline
}

///////////////////////////////////////////////////////////

function noteGalaxies() {

    const height = DATA.length    

    const width = DATA[0].length

    for (let row = 0; row < height; row++) {
    
        for (let col = 0; col < width; col++) {

            if (DATA[row][col] == "#") { GALAXIES[row + "~" + col] = { "row": row, "col": col } }
        }
    }
}

main()

