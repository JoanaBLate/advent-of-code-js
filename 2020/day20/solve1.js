"use strict"

// solving the puzzle takes (my computer) 0.034s

/*
    for this solution we only care about the borders;
    
    for efficiency, the border values are translated into 
    binary numbers, and then converted to decimal numbers
    
    actually, we only need to tell the corner tiles!!!

    --
    
    corner tiles have 2 neighbors (there are only 4 corner tiles)
    
    border (not corner) tiles have 3 neighbors
    
    middle tiles have 4 neighbors
*/


const DATA = [ ]

var IMAGE_DIM = 0 // each image is a fragment of the picture


function main() {

    processInput()
    
    IMAGE_DIM = DATA[0].image.length
    
    for (const data of DATA) { fillInfo(data) }
    
    for (const data of DATA) { countCompatibles(data) }
    
    let result = 1
    
    for (const data of DATA) { 
    
        if (data.compatibles == 2) { result *= data.id } // a corner tile!
    }
    
    console.log("the answer is", result)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const parts = input.split("\n\n")
    
    for (const part of parts) {
    
        const lines = part.trim().split("\n")
        
        const id = parseInt(lines.shift().split(" ").pop())
        
        const image = [ ]
        
        for (const line of lines) { image.push(line.trim()) }
        
        DATA.push(createImageObj(id, image))
    }
}

function createImageObj(id, image) {

    return { 
    
        "id": id, "image": image, "compatibles": 0,
    
        "top": 0, "bottom": 0, "left": 0, "right": 0, 
        
        "revTop": 0, "revBottom": 0, "revLeft": 0, "revRight": 0  
    }
}

///////////////////////////////////////////////////////////

function fillInfo(obj) {
    
    obj.top = getCode(obj.image[0])
    
    obj.revTop = getCodeReversed(obj.image[0])
    
    obj.bottom = getCode(obj.image[IMAGE_DIM - 1])
    
    obj.revBottom = getCodeReversed(obj.image[IMAGE_DIM - 1])
    
    let leftBorder = ""

    let rightBorder = ""
        
    for (let n = 0; n < IMAGE_DIM; n++) {

        leftBorder += obj.image[n][0]

        rightBorder += obj.image[n][IMAGE_DIM - 1]
    }
    
    obj.left = getCode(leftBorder)
    obj.right = getCode(rightBorder)

    obj.revLeft = getCodeReversed(leftBorder)    
    obj.revRight = getCodeReversed(rightBorder)
}

function getCode(string) {

    let s = ""
    
    for (const char of string) { s += (char == ".") ? "0" : "1" }
    
    return parseInt(s, 2)
}

function getCodeReversed(string) {

    return getCode(string.split("").reverse().join(""))
}

///////////////////////////////////////////////////////////

function countCompatibles(master) {

    const edge = [ 
    
        master.top, master.bottom, master.left, master.right, 
        master.revTop, master.revBottom, master.revLeft, master.revRight 
    ]   

    for (const obj of DATA) {
    
        if (obj == master) { continue }
        
        if (edge.includes(obj.top))    { master.compatibles += 1; continue }
        
        if (edge.includes(obj.bottom)) { master.compatibles += 1; continue }
        
        if (edge.includes(obj.left))   { master.compatibles += 1; continue }
        
        if (edge.includes(obj.right))  { master.compatibles += 1; continue }
        
        if (edge.includes(obj.revTop)) { master.compatibles += 1; continue }
        
        if (edge.includes(obj.revBottom)) { master.compatibles += 1; continue }
        
        if (edge.includes(obj.revLeft))   { master.compatibles += 1; continue }
        
        if (edge.includes(obj.revRight))  { master.compatibles += 1; continue }
    }
}

main()

