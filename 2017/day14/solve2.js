"use strict"

// solving the puzzle takes (my computer) 0.210s


function main() {

    const keyString = Deno.readTextFileSync("input.txt").trim()
    
    const grid = [ ]
            
    for (let n = 0; n < 128; n++) {
    
        const thisKeyString = keyString + "-" + n
        
        const hash = createKnotHash(thisKeyString)
        
         const row = createGridRow(hash)
        
        grid.push(row)
    }

    let region = 0
    
    while (true) {

        const coord = findStartingCoordinates(grid)
        
        if (coord == null) { break }
        
        region += 1
        
        markRegion(grid, coord, region)
    }

    console.log("the number of regions is", region)
}

///////////////////////////////////////////////////////////

function createGridRow(hash) {

    const row = [ ]
    
    for (const h of hash) { 
        
        const decimal = parseInt(h, 16)
        
        const binary = decimal.toString(2).padStart(4, "0")
        
        for (const b of binary) { row.push(b == "1" ? "-1" : "0") }            
    }

    return row
}

///////////////////////////////////////////////////////////

function findStartingCoordinates(grid) {

    for (let row = 0; row < 128; row++) {
    
        for (let col = 0; col < 128; col++) {
        
            if (grid[row][col] == -1) { return newCoordinates(row, col) }        
        }    
    }
    return null
}

function markRegion(grid, coord, region) {

    let futureCoords = [ coord ]
    
    while (true) {
    
        const currentCoords = futureCoords
        
        futureCoords = [ ]
        
        if (currentCoords.length == 0) { return }
        
        for (const coord of currentCoords) { walk(coord) }
    }

    function walk(coord) {
    
        const row = coord.row
        const col = coord.col
    
        
        grid[row][col] = region
        
        tryWalk(row, col-1) // west
        tryWalk(row, col+1) // east
        tryWalk(row-1, col) // north
        tryWalk(row+1, col) // south
    }
    
    function tryWalk(row, col) {
    
        if (row < 0) { return }
        if (col < 0) { return }
        
        if (row > 127) { return }
        if (col > 127) { return }
        
        if (grid[row][col] != -1) { return } // empty or already walked
        
        futureCoords.push(newCoordinates(row, col))
    }
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

///////////////////////////////////////////////////////////

function newCoordinates(row, col) {

    return { "row": row, "col": col }
}

main()

