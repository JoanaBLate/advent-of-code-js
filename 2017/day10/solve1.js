"use strict"

// solving the puzzle takes (my computer) 0.030s


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = rawText.split(",")
    
    const lengths = [ ]
    
    for (const token of tokens) { lengths.push(parseInt(token)) }
    
    const data = [ ]
    
    for (let n = 0; n < 256; n++) { data.push(n) }
        
    let currentPosition = 0
    
    let skipSize = 0
    
    while (lengths.length > 0) {

        const length = lengths.shift()
        
        if (length > data.length) { continue }
        
        reverse(data, currentPosition, length)

        currentPosition += length + skipSize
        
        if (currentPosition >= data.length) { currentPosition -= data.length }

        skipSize += 1
    }

    console.log("the result of multiplying is", data[0] * data[1])
}
    
function reverse(data, start, length) {

    const segment = [ ]

    const end = start + length - 1
    
    for (let a = start; a <= end; a++) { 
    
        let index = a
        if (index >= data.length) { index -= data.length }
    
        segment.push(data[index])
    }
    
    for (let a = start; a <= end; a++) { 
    
        let index = a
        if (index >= data.length) { index -= data.length }
    
        data[index] = segment.pop()
    }
}

main()

