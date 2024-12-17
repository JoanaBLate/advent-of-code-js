"use strict"

// solving the puzzle takes (my computer) 0.025s

var favoriteNumber = 0

var currentSquares = [ ]

var futureSquares = [ newPoint(1, 1) ]

const walkedSquares = { } // { "2~3": true }


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    favoriteNumber = parseInt(rawText)
        
    let steps = -1
    
    while (true) {
    
        steps += 1
        
        if (steps > 50) { break }
        
        currentSquares = futureSquares
        
        futureSquares = [ ]

        for (const square of currentSquares) { walk(square) }
    }

    console.log("number of locations is", Object.keys(walkedSquares).length)
}

function newPoint(x, y) {

    return { "x": x, "y": y } 
}

function walk(square) {

    const x = square.x
    const y = square.y
    
    walkedSquares[x + "~" + y] = true
    
    tryWalk(x, y - 1) // north
    tryWalk(x, y + 1) // south
    
    tryWalk(x - 1, y) // west
    tryWalk(x + 1, y) // east
}

function tryWalk(x, y) {

    if (isBlocked(x, y)) { return }
    
    if (walkedSquares[x + "~" + y] == true) { return }
    
    futureSquares.push(newPoint(x, y))
}

function isBlocked(x, y) {

    if (x < 0) { return true }
    if (y < 0) { return true }
    
    const n = x*x + 3*x + 2*x*y + y + y*y + favoriteNumber
    
    const string = n.toString(2)
    
    let count = 0
    
    for (const c of string) { if (c == "1") { count += 1 } }
    
    return count % 2 == 1
}

main()

