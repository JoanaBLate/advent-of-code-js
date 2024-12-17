"use strict"

// solving the puzzle takes (my computer) 0.060s

const fabric = [ ] // 2000 x 2000 grid

const DATA = { }


function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    for (let n = 0; n < 2000; n++) { fabric.push(new Uint8Array(2000)) }
    
    for (const line of input.split("\n")) { processThisInput(line.trim()) }
         
    console.log("the answer is", nonOverlappingClaim())
}

function processThisInput(line) {
   
    const tokens = line.split(" ")
 
    const id = tokens.shift() // id
    tokens.shift() // @
    
    const segmentA = tokens.shift()
    const segmentB = tokens.shift()
 
    const partsA = segmentA.split(",")
    const partsB = segmentB.split("x")
    
    const left = parseInt(partsA.shift())
    const top  = parseInt(partsA.shift())
 
    const width  = parseInt(partsB.shift())
    const height = parseInt(partsB.shift())
    
    DATA[id] = { "left": left, "top": top, "width": width, "height": height }
 
    for (let row = top; row < top + height; row++) {

        for (let col = left; col < left + width; col++) {
 
            const data = fabric[row][col]

            fabric[row][col] = (data == 0) ? 1 : 2
        }
    }
}

function nonOverlappingClaim() {

    for (const id of Object.keys(DATA)) {
    
        if (! overlaps(DATA[id])) { return id.replace("#","") }
    }
}

function overlaps(data) {

    for (let row = data.top; row < data.top + data.height; row++) {

        for (let col = data.left; col < data.left + data.width; col++) {
 
            if (fabric[row][col] != 1) { return true }
        }
    }
    
    return false
}
    
main()

