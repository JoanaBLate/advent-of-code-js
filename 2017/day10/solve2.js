"use strict"

// solving the puzzle takes (my computer) 0.030s

const data = [ ]

const LENGTHS = [ ]

var currentPosition = 0
    
var skipSize = 0

function main() {

    const input = Deno.readTextFileSync("input.txt").trim()
    
    for (const c of input) {
    
        if (c != " ") { const n = c.charCodeAt(0); LENGTHS.push(n) }
    }
    
    for (const n of [ 17, 31, 73, 47, 23 ]) { LENGTHS.push(n) }
    
    for (let n = 0; n < 256; n++) { data.push(n) }
    
    for (let n = 0; n < 64; n++) { processOneRound() }
    
    //
    
    let hash = ""
    
    for (let n = 0; n < 16; n++) { 
    
        const sub = data.splice(0, 16) // sublist
        
        const xor = sub[0] ^ sub[1] ^ sub[2] ^ sub[3] ^ sub[4] ^ sub[5] ^ sub[6] ^ sub[7] ^ 
                    sub[8] ^ sub[9] ^ sub[10] ^ sub[11] ^ sub[12] ^ sub[13] ^ sub[14] ^ sub[15]
        
        const hexa = xor.toString(16).padStart(2, "0")
        
        hash += hexa
    }

    console.log("the Knot Hash is", hash)
}

///////////////////////////////////////////////////////////

function processOneRound() {

    const lengths = LENGTHS.slice()
    
    while (lengths.length > 0) {

        const length = lengths.shift()
        
        if (length > data.length) { continue }
        
        reverse(data, currentPosition, length)

        currentPosition += length + skipSize        
        
        while (currentPosition >= data.length) { currentPosition -= data.length } // MUST BE while NOT if

        skipSize += 1
    }
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

