"use strict"

// solving the puzzle takes (my computer) 0.040s

const DATA = [ ]

const million = 1000 * 1000

const newRows = [ ] // the index increases by 1; the value increases by 1 or by 1 million

const newCols = [ ] // the index increases by 1; the value increases by 1 or by 1 million

const GALAXIES = { }


function main() {

    processInput()

    fillNewRows()   
    
    fillNewCols()    
        
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

function fillNewRows() {

    const width = DATA[0].length
    
    const empty = ".".repeat(width)

    for (const line of DATA) {
        
        const delta = (line == empty) ? million : 1
        
        const last = (newRows.length == 0) ? -1 : newRows.at(-1)    
        
        newRows.push(last + delta)
    }
}

function fillNewCols() {

    const width = DATA[0].length

    for (let col = 0; col < width; col++) {

        let empty = true

        for (const line of DATA) { if (line[col] == "#") { empty = false; break } }
        
        const delta = empty ? million : 1
        
        const last = (newCols.length == 0) ? +1 : newCols.at(-1)
        
        newCols.push(last + delta)
    }
}

///////////////////////////////////////////////////////////

function noteGalaxies() {

    const height = DATA.length    

    const width = DATA[0].length

    for (let row = 0; row < height; row++) {
    
        for (let col = 0; col < width; col++) {

            if (DATA[row][col] == "#") { GALAXIES[row + "~" + col] = { "row": newRows[row], "col": newCols[col] } }
        }
    }
}

main()

