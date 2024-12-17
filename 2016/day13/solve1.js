"use strict"

// solving the puzzle takes (my computer) 0.025s

const targetX = 31
const targetY = 39

var favoriteNumber = 0

var currentSquares = [ ]

var futureSquares = [ newPoint(1, 1) ]

const walkedSquares = { } // { "2~3": true }

var targetFound = false


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    favoriteNumber = parseInt(rawText)
        
    let steps = -1
    
    while (! targetFound) {
    
        steps += 1
        
        currentSquares = futureSquares
        
        futureSquares = [ ]

        for (const square of currentSquares) { walk(square) }
    }

    console.log("fewest number of steps required is", steps)
}

function newPoint(x, y) {

    return { "x": x, "y": y } 
}

function walk(square) {

    const x = square.x
    const y = square.y

    if (x == targetX  &&  y == targetY) { targetFound = true; }
    
    if (targetFound) { return }
    
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


