"use strict"

// solving the puzzle takes (my computer) 0.930s

const patterns = { }

function main() {

    fillPatternsWithTheInput()
     
    let image = ".#./..#/###"
    
    for (let n = 0; n < 18; n++) { image = processImage(image) }        
        
    let count = 0
    
    for (const c of image) { if (c == "#") { count += 1 } }

    console.log("number of lit pixels is", count)
}

///////////////////////////////////////////////////////////

function processImage(source) {

    const rows = source.split("/")
    
    const len = rows.length

    if (len == 3) { return patterns[source] }
    
    return  (len % 2 == 0) ? processImage_2(rows) : processImage_3(rows)
}

function processImage_2(rows) {

    const image = [ ]
    
    while (rows.length > 0) {
        
        createAndPushNewRows_2(image, rows.shift(), rows.shift())
    }
    
    return image.join("/")
}

function processImage_3(rows) {

    const image = [ ]
    
    while (rows.length > 0) {
        
        createAndPushNewRows_3(image, rows.shift(), rows.shift(), rows.shift())
    }
    
    return image.join("/")
}

///////////////////////////////////////////////////////////

function createAndPushNewRows_2(image, rowA, rowB) {

    let blocks = [ ]

    while (rowA != "") {
    
        const a = rowA.substr(0, 2)
        rowA = rowA.replace(a, "")
        
        const b = rowB.substr(0, 2)
        rowB = rowB.replace(b, "")
    
        const block = patterns[a + "/" + b]
        
        blocks.push(block)
    }
            
    for (let n = 0; n < 3; n++) {
        
        let row = ""
        
        for (let i = 0; i < blocks.length; i++) {
    
            let block = blocks[i]
            
            row += block.substr(0, 3)
            
            blocks[i] = block.substr(4)
        }
        image.push(row)
    }        
}

function createAndPushNewRows_3(image, rowA, rowB, rowC) {

    let blocks = [ ]

    while (rowA != "") {
    
        const a = rowA.substr(0, 3)
        rowA = rowA.replace(a, "")
        
        const b = rowB.substr(0, 3)
        rowB = rowB.replace(b, "")
        
        const c = rowC.substr(0, 3)
        rowC = rowC.replace(c, "")
    
        const block = patterns[a + "/" + b + "/" + c]
        
        blocks.push(block)
    }
            
    for (let n = 0; n < 4; n++) {
        
        let row = ""
        
        for (let i = 0; i < blocks.length; i++) {
    
            let block = blocks[i]
            
            row += block.substr(0, 4)
            
            blocks[i] = block.substr(5)
        }
        image.push(row)
    }        
}

///////////////////////////////////////////////////////////

function fillPatternsWithTheInput() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")

    for (const rawLine of rawLines) {
    
        const tokens = rawLine.trim().split(" => ")
    
        const key = tokens.shift()
        
        const value = tokens.shift()
        
        patterns[key] = value
        
        patterns[flipHoriz(key)] = value
        
        patterns[flipVert(key)] = value
        
        const rotated1 = rotate(key) 
        
        patterns[rotated1] = value
        
        const rotated2 = rotate(rotated1)
        
        patterns[rotated2] = value
        
        const rotated3 = rotate(rotated2)
        
        patterns[rotated3] = value
        
        //
        
        patterns[flipHoriz(rotated1)] = value
        patterns[flipHoriz(rotated2)] = value
        patterns[flipHoriz(rotated3)] = value
        
        patterns[flipVert(rotated1)] = value
        patterns[flipVert(rotated2)] = value
        patterns[flipVert(rotated3)] = value
    }
}

function flipVert(source) {

    const rows = source.split("/")
    
    rows.reverse()
    
    return rows.join("/")
}

function flipHoriz(source) {

    const rows = source.split("/")
    
    for (let i = 0; i < rows.length; i++) {
    
        const cells = rows[i].split("")
        cells.reverse()
        rows[i] = cells.join("")    
    }

    return rows.join("/")
}

function rotate(source) {

    const rows = source.split("/")
    
    const len = rows.length
    
    const newCols = [ ]
    
    for (const row of rows) { newCols.unshift(row) }
    
    const newRows = [ ]
    
    for (let r = 0; r < len; r++) { 
    
        let row = ""
        
        for (let c = 0; c < len; c++) {
        
            row += newCols[c][r]
        }
        newRows.push(row)
    }
    
    return newRows.join("/")
}

main()

