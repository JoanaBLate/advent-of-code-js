"use strict"

// solving the puzzle takes (my computer) 0.130s


function main() {

    const keyString = Deno.readTextFileSync("input.txt").trim()
    
    let usedSquares = 0
        
    for (let n = 0; n < 128; n++) {
    
        const thisKeyString = keyString + "-" + n
        
        const hash = createKnotHash(thisKeyString)
        
        const us = countUsedsInHash(hash)
        
        usedSquares += us
    }

    console.log("the number of used squares is", usedSquares)
}

function countUsedsInHash(hash) {

    let count = 0
    
    for (const h of hash) { 
        
        const decimal = parseInt(h, 16)
        
        const binary = decimal.toString(2).padStart(4, "0")
        
        for (const b of binary) { if (b == "1") { count += 1 } }
    }

    return count
}

///////////////////////////////////////////////////////////

function createKnotHash(keyString) {

    const data = [ ]
    
    for (let n = 0; n < 256; n++) { data.push(n) }

    const lengths = [ ]
    
    for (const c of keyString) { const n = c.charCodeAt(0); lengths.push(n) }
    
    for (const n of [ 17, 31, 73, 47, 23 ]) { lengths.push(n) }

    const info = { "data": data, "lengths": lengths, "currentPosition": 0, "skipSize": 0 }

    for (let n = 0; n < 64; n++) { processOneRound(info) }
        
    //
   
    let hash = ""
    
    for (let n = 0; n < 16; n++) { 
    
        const sub = info.data.splice(0, 16) // sublist
        
        const xor = sub[0] ^ sub[1] ^ sub[2] ^ sub[3] ^ sub[4] ^ sub[5] ^ sub[6] ^ sub[7] ^ 
                    sub[8] ^ sub[9] ^ sub[10] ^ sub[11] ^ sub[12] ^ sub[13] ^ sub[14] ^ sub[15]
        
        const hexa = xor.toString(16).padStart(2, "0")
        
        hash += hexa
    }

    return hash
}

function processOneRound(info) {

    const lengths = info.lengths.slice()
    
    while (lengths.length > 0) {

        const length = lengths.shift()
        
        if (length > info.data.length) { continue }
        
        reverse(info.data, info.currentPosition, length)

        info.currentPosition += length + info.skipSize        
        
        while (info.currentPosition >= info.data.length) { info.currentPosition -= info.data.length } // MUST BE while NOT if

        info.skipSize += 1
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

