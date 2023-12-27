"use strict"

// solving the puzzle takes (my computer) 0.024s

const DATA = [ ]


function main() {

    processInput()      
    
    console.log("the answer is", calcArea())    
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
        
        const tokens = line.trim().split(" ")
        
        tokens.shift()
        tokens.shift()
        
        const info = tokens.shift().substr(2, 6)

        const amount = parseInt(info.substr(0, 5), 16)

        const direction = "RDLU"[parseInt(info.substr(5, 1))]
        
        DATA.push({ "direction": direction, "amount": amount })
    }
}

///////////////////////////////////////////////////////////

function calcArea() {

    let area = 0
       
    let previousRow = 0
    let previousCol = 0 
    
    for (const data of DATA) {
    
        const direction = data.direction
        const steps = data.amount

        let row = previousRow
        let col = previousCol
        
        if (direction == "U") { row = previousRow - steps }

        if (direction == "D") { row = previousRow + steps }

        if (direction == "L") { col = previousCol - steps }

        if (direction == "R") { col = previousCol + steps }
        
        area += (previousCol * row - previousRow * col) + steps  // using shoelace formula

        previousRow = row
        previousCol = col    
    }
    
    return area / 2 + 1
}

main()

