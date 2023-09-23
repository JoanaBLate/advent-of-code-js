"use strict"

// solving the puzzle by using a real array takes (my computer) 0.028s

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    // first we must determine the size of the grid of houses,
    // by finding how far from the base house Santa walks;
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
    
    // we must adjust the Santa's base house coordinates to our grid: 
    
    var coordX = dimensions["west"]
    var coordY = dimensions["south"]
    
    const homeIndex = coordY * horizontal + coordX
    
    grid[homeIndex] = 1
        
    for (const step of data) { 
    
        if (step == ">") {
            coordX += 1
        }
        else if (step == "<") {
            coordX -= 1
        }
        else if (step == "^") {
            coordY += 1
        }
        else { // step == "v"
            coordY -= 1
        }
            
        const i = coordY * horizontal + coordX
        
        grid[i] = 1
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
    
    var coordX = 0
    var coordY = 0
        
    for (const step of data) { 
    
        if (step == ">") {
            coordX += 1
        }
        else if (step == "<") {
            coordX -= 1
        }
        else if (step == "^") {
            coordY += 1
        }
        else { // step == "v"
            coordY -= 1
        }
        
        if (coordX > east) { east = coordX }
        if (coordX < west) { west = coordX }
        
        if (coordY > north) { north = coordY }
        if (coordY < south) { south = coordY }
    }
    
    return { "east": east, "west": -west, "north": north, "south": -south }
}

main()

