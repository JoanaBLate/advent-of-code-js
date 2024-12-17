"use strict"

// solving the puzzle takes (my computer) 0.024s

var x = 0
var y = 0

// absolute values
let maxNorth = 0
let maxSouth = 0
let maxWest  = 0
let maxEast  = 0

var status = "going-east"

const map = { "0~0": 1 } 


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const target = parseInt(rawText)
        
    while (true) {
    
        move()

        const value = sumNeighbors(x, y)
        
        map[x + "~" + y] = value
        
        if (value <= target) { continue }

        console.log("first larger value is", value)
        
        return
    }
}

function move() {

    if (status == "going-north") {
    
        y -= 1    
        if (Math.abs(y) > maxNorth) { maxNorth += 1; status = "going-west" }
        return
    }
    
    if (status == "going-west") {
    
        x -= 1
        if (Math.abs(x) > maxWest) { maxWest += 1; status = "going-south" }
        return
    }
    
    if (status == "going-south") {

        y += 1
        if (Math.abs(y) > maxSouth) { maxSouth += 1; status = "going-east" }
        return
    }
    
    if (status == "going-east") {
    
         x += 1
        if (Math.abs(x) > maxEast) { maxEast += 1; status = "going-north" }        
        return
    }
}   

function sumNeighbors(x, y) {

    let sum = 0
    
    sum += getValue(x-1, y-1)
    sum += getValue(x,   y-1)
    sum += getValue(x+1, y-1)
    
    sum += getValue(x-1, y)
    sum += getValue(x+1, y)
    
    sum += getValue(x-1, y+1)
    sum += getValue(x,   y+1)
    sum += getValue(x+1, y+1)

    return sum
}

function getValue(x, y) {

    return map[x + "~" + y]  ||  0
}

main()

