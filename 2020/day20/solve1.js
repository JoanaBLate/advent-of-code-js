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
    
    --
    
    for this *SPECIFIC* puzzle input, for all tiles: any border
    compatible tile is a true neighbor (not just an eventual match)
*/


const DATA = [ ]

var IMAGE_DIM = 0 // each image is a fragment of the picture


function main() {

    processInput()
    
    IMAGE_DIM = DATA[0].image.length
    
    for (const data of DATA) { fillBorders(data) }
    
    let result = 1

    for (const data of DATA) { 
    
        const count = countCompatibles(data)

        if (count == 2) { result *= data.id } // a corner tile!
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

    return { "id": id, "image": image, "borders": [ ] } // 'borders' also includes borders after flipping and rotating
}

///////////////////////////////////////////////////////////

function fillBorders(obj) {
    
    const last = IMAGE_DIM - 1
    
    const top = obj.image[0]
    
    const bottom = obj.image[last]
    
    let left = ""

    let right = ""
        
    for (let n = 0; n <= last; n++) {

        left += obj.image[n][0]

        right += obj.image[n][last]
    }
    
    obj.borders.push(getCode(top))
    obj.borders.push(getCode(bottom))
    obj.borders.push(getCode(left))
    obj.borders.push(getCode(right))

    obj.borders.push(getCodeReversed(top))
    obj.borders.push(getCodeReversed(bottom))
    obj.borders.push(getCodeReversed(left))
    obj.borders.push(getCodeReversed(right))
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

    let compatibles = 0

    for (const data of DATA) { 
    
        if (data == master) { continue }
        
        for (const border of data.borders) { 
        
            if (master.borders.includes(border)) { compatibles += 1; break }
        }
    }
    return compatibles
}

main()

