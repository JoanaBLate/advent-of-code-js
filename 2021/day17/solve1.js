"use strict"

// solving the puzzle takes (my computer) 0.026s

const input = Deno.readTextFileSync("input.txt").trim()

var Xa = 0
var Xb = 0
var Ya = 0
var Yb = 0


function main() {

    processInput()
    
    console.log("the answer is", findMaxHeight())
}

function processInput() {
        
    const parts = input.replace("target area: ", "").split(", ")
    
    const tokensX = parts.shift().substr(2).split("..")
    const tokensY = parts.shift().substr(2).split("..")
    
    Xa = parseInt(tokensX.shift())
    Xb = parseInt(tokensX.shift())
    Ya = parseInt(tokensY.shift())
    Yb = parseInt(tokensY.shift())
    
    if (Xa > Xb) { const temp = Xa; Xa = Xb; Xb = temp }
    if (Ya > Yb) { const temp = Ya; Ya = Yb; Yb = temp }
}

///////////////////////////////////////////////////////////

function findMaxHeight() {

    let maxHeight = 0

    for (let y = Ya; y <= Yb; y++) {
    
        const height = findMaxHeightThis(y)
        
        if (height > maxHeight) { maxHeight = height } 
    }
    return maxHeight
}

function findMaxHeightThis(y) {

    let maxHeight = 0
    
    let steps = 0

    while (true) {
    
        steps += 1

        const vy = y / steps + ((steps - 1) / 2)

        if (steps > 2 * Math.abs(y)) { break } 

        const height = vy / 2 * (vy + 1) // arithmetic progression

        if (height > maxHeight) { maxHeight = height }
    }
    
    return maxHeight
}

main()

