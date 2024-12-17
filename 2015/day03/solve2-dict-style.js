"use strict"

// solving the puzzle by using a dictionary takes (my computer) 0.033s

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    const houses = { "0,0": true } // the key represents the coordinates inside an *imaginary* grid

    var santaX = 0
    var santaY = 0
    
    var robotX = 0
    var robotY = 0
        
    const maxIndex = data.length - 1
        
    let index = -1
        
    while (true) {
    
        // Santa's turn
    
        index += 1
                
        if (index > maxIndex) { break }
        
        const santaStep = data[index]
        
        if (santaStep == ">") {
            santaX += 1
        }
        else if (santaStep == "<") {
            santaX -= 1
        }
        else if (santaStep == "^") {
            santaY += 1
        }
        else { // santaStep == "v"
            santaY -= 1
        }

        const santaKey = "" + santaX + "," + santaY
        
        houses[santaKey] = true
    
        // robots's turn
        
        index += 1
                
        if (index > maxIndex) { break }
        
        const robotStep = data[index]
    
        if (robotStep == ">") {
            robotX += 1
        }
        else if (robotStep == "<") {
            robotX -= 1
        }
        else if (robotStep == "^") {
            robotY += 1
        }
        else { // robotStep == "v"
            robotY -= 1
        }
        
        const robotKey = "" + robotX + "," + robotY
        
        houses[robotKey] = true
    }
            
    console.log("houses with present is", Object.keys(houses).length)
}

main()

