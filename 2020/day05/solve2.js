"use strict"

// solving the puzzle takes (my computer) 0.025s

const positions = [ ]


function main() {

    processInput()
    
    const len = 128 * 8
    
    const allIds = new Uint8Array(len)
    
    for (const position of positions) {
        
        const id = getId(position)

        allIds[id] = 1 
    }

    let foundFirstSeat = false

    for (let n = 0; n < len; n++) {

        if (allIds[n] != 0) { foundFirstSeat = true; continue }
        
        if (! foundFirstSeat) { continue }
    
        console.log("the answer is", n)
        return
    }
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { positions.push(line.trim()) }
}

function getId(position) {

    return 8 * getRow(position) + getCol(position)
}

function getRow(position) {

    const data = position.substr(0, 7)
    
    const bin = convertToBinary(data, "F", "B")
    
    return parseInt(bin, 2)
}

function getCol(position) {

    const data = position.substr(7)
    
    const bin = convertToBinary(data, "L", "R")
    
    return parseInt(bin, 2)
}

function convertToBinary(source, zero, __one) {

    let s = ""
    
    for (const letter of source) { s += (letter == zero) ? "0" : "1" }

    return s
}

main()

