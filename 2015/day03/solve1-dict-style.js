"use strict"

// solving the puzzle by using a dictionary takes (my computer) 0.030s

function main() {

    const data = Deno.readTextFileSync("input.txt").trim()
    
    const houses = { "0,0": true } // the key represents the coordinates inside an *imaginary* grid

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
            
        const key = "" + coordX + "," + coordY
        
        houses[key] = true
    }
            
    console.log("houses with present is", Object.keys(houses).length)
}

main()

