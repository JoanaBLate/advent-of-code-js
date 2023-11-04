"use strict"

// solving the puzzle takes (my computer) 0.030s

var DATA = null

const WIDTH = 25
const HEIGHT = 6

const LENGTH = WIDTH * HEIGHT

        
function main() {

    processInput()
    
    let bestZeros = 99999999

    let result = 0

    for (const layer of getLayers()) {
            
        if (layer.zeros < bestZeros) { bestZeros = layer.zeros; result = layer.ones * layer.twos }
    }
    
    console.log(result)
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
        
        const layer = { "data": data, "zeros": 0, "ones": 0, "twos": 0 }
        
        layers.push(layer)
        
        for (const c of layer.data) {
        
            if (c == "0") { layer.zeros += 1 }
            if (c == "1") { layer.ones  += 1 }
            if (c == "2") { layer.twos  += 1 }        
        }
    }
    return layers
}

main()

