"use strict"

// solving the puzzle takes (my computer) 0.030s

var DATA = null

const WIDTH = 25
const HEIGHT = 6

const LENGTH = WIDTH * HEIGHT

        
function main() {

    processInput()
    
    let image = ""
    
    const layers = getLayers()

    for (let row = 0; row < HEIGHT; row++) {

        for (let col = 0; col < WIDTH; col++) {
    
            image += findPixel(layers, row, col) 
        }
        image += "\n"
    }
    
    console.log(image)
    console.log("\nthe answer is UBUFP")
}

function processInput() {

    DATA = Deno.readTextFileSync("input.txt").trim()
}

function getLayers() {
    
    const layers = [ ]
    
    let start = 0
    
    while (start < DATA.length) {
    
        const data = DATA.substr(start, LENGTH)
        
        start += LENGTH
                
        layers.push(data)
    }
    return layers
}

function findPixel(layers, row, col) {

    const index = row * WIDTH + col
    
    for (const layer of layers) {
    
        const value = layer[index]
 
        if (value == 0) { return " " } 
        if (value == 1) { return "#" }    
    }
    return " "
}

main()

