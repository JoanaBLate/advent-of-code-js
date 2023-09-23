"use strict"

// solving the puzzle by using a real array takes (my computer) 0.028s

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    // first we must determine the size of the grid of houses,
    // by finding how far from the base house Santa and robot walk;
    // we will construct the grid with the smallest possible size,
    // without unused "margins" - we don't want to waste computer memory
    
    const dimensions = calcGridDimensions(data)
 
    const vertical = dimensions["south"] + 1 + dimensions["north"] // 1 means the base house Y coordinate
    
    const horizontal = dimensions["west"] + 1 + dimensions["east"] // 1 means the base house X coordinate   
    
    const grid = [ ]
    
    const size = vertical * horizontal
    
    for (let n = 0; n < size; n++) { grid.push(0) }
    
    // our grid is in fact a single dimension array, 
    // but we will read and write it in a matrix style!
    
    // note that the 0,0 coordinate means the upper left corner
    // of the grid, NOT its center
    
    // we must adjust the Santa's (and robot) base house coordinates to our grid:
    
    var santaX = dimensions["west"]
    var santaY = dimensions["south"]

    var robotX = santaX
    var robotY = santaY

    const homeIndex = santaY * horizontal + santaX 
    
    grid[homeIndex] = 1

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

        const santaIndex = santaY * horizontal + santaX
        
        grid[santaIndex] = 1
    
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

        const robotIndex = robotY * horizontal + robotX
        
        grid[robotIndex] = 1
    }
       
    var total = 0 
    
    for (let i = 0; i < size; i++) { total += grid[i] }
    
    console.log("houses with present is", total)
}

function calcGridDimensions(data) { // walking on an imaginary grid

    let east = 0
    let west = 0
    
    let north = 0
    let south = 0
    
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
        
        if (santaX > east) { east = santaX }
        if (santaX < west) { west = santaX }
        
        if (santaY > north) { north = santaY }
        if (santaY < south) { south = santaY }

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
        
        if (robotX > east) { east = robotX }
        if (robotX < west) { west = robotX }
        
        if (robotY > north) { north = robotY }
        if (robotY < south) { south = robotY }
    }
    
    return { "east": east, "west": -west, "north": north, "south": -south }
}

main()

