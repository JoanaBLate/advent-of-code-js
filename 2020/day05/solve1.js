"use strict"

// solving the puzzle takes (my computer) 0.025s

const positions = [ ]


function main() {

    processInput()
    
    let highest = getId(positions[0])
    
    for (const position of positions) {
        
        const id = getId(position)
        
        if (id > highest) { highest = id }    
    }
     
    console.log("the answer is", highest)
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

