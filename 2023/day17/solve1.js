"use strict"

// solving the puzzle takes (my computer) 0.110s

const NORTH = 1
const SOUTH = 2
const WEST  = 3
const EAST  = 4

const board = [ ]

var width = 0
var height = 0


function main() {

    processInput()
    
    const home = board[0][0]
    
    home.fromNorth1 = 0
    home.fromNorth2 = 0
    home.fromNorth3 = 0
    home.fromSouth1 = 0
    home.fromSouth2 = 0
    home.fromSouth3 = 0
    home.fromWest1 = 0
    home.fromWest2 = 0
    home.fromWest3 = 0
    home.fromEast1 = 0
    home.fromEast2 = 0
    home.fromEast3 = 0
    
    walk()
    
   const node =  board[height -1][width-1]
   
   const best = Math.min(
    
        node.fromNorth1, node.fromNorth2, node.fromNorth3,
        node.fromSouth1, node.fromSouth2, node.fromSouth3,
        node.fromWest1, node.fromWest2, node.fromWest3,
        node.fromEast1, node.fromEast2, node.fromEast3
    )

    console.log("the answer is", best)
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    height = lines.length
    
    width = lines[0].length
    
    let row = -1
    
    for (const line of lines) { 
    
        row += 1
    
        const nodes = [ ]
        
        let col = -1
        
        for (const c of line.trim()) { 
        
            col += 1
            
            const node = createNode(row, col, parseInt(c))
            
            nodes.push(node) 
        }
        
        board.push(nodes)
    }
}

function createNode(row, col, original) {

    return {
    
        "row": row,
        "col": col,
        "original": original,
        "fromNorth1": Infinity,
        "fromNorth2": Infinity,
        "fromNorth3": Infinity,
        "fromSouth1": Infinity,
        "fromSouth2": Infinity,
        "fromSouth3": Infinity,
        "fromEast1": Infinity,
        "fromEast2": Infinity,
        "fromEast3": Infinity,
        "fromWest1": Infinity,
        "fromWest2": Infinity,
        "fromWest3": Infinity,
        "selectedRound": 0
    }
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function findDirectionFrom(deltaRow, deltaCol) {

    if (deltaRow == +1) { return NORTH }
    if (deltaRow == -1) { return SOUTH }
    if (deltaCol == +1) { return WEST  }
    if (deltaCol == -1) { return EAST  }
}

///////////////////////////////////////////////////////////

function walk() {

    let futurePoints = [ createPoint(0, 0) ]
    
    let walkingRound = 0
        
    while (true) {
        
        walkingRound += 1
    
        const currentPoints = futurePoints

        if (currentPoints.length == 0) { return }
    
        futurePoints = [ ]
        
        for (const point of currentPoints) {
    
            processNode(point, -1,  0, futurePoints, walkingRound)
            processNode(point, +1,  0, futurePoints, walkingRound)
            processNode(point,  0, -1, futurePoints, walkingRound)
            processNode(point,  0, +1, futurePoints, walkingRound)
    
        }
    } 
}

function processNode(point, deltaRow, deltaCol, futurePoints, walkingRound) {

    const row = point.row + deltaRow
    const col = point.col + deltaCol
    
    if (row < 0) { return }
    if (col < 0) { return }
    
    if (row > height - 1) { return }
    if (col > width - 1)  { return }

    const previous = board[point.row][point.col]

    const node = board[row][col]
    
    const direction = findDirectionFrom(deltaRow, deltaCol)
    
    if (direction == NORTH) { handleFromNorth(node, previous, futurePoints, walkingRound); return }
    
    if (direction == SOUTH) { handleFromSouth(node, previous, futurePoints, walkingRound); return }
    
    if (direction == WEST)  { handleFromWest(node,  previous, futurePoints, walkingRound); return }
    
    if (direction == EAST)  { handleFromEast(node,  previous, futurePoints, walkingRound); return }    
}

///////////////////////////////////////////////////////////

function handleFromNorth(node, previous, futurePoints, walkingRound) {
    
    const hl = node.original // heat loss
    
    let changed = false
    
    const best = Math.min(
    
        previous.fromWest1,  previous.fromWest2,  previous.fromWest3,
        previous.fromEast1,  previous.fromEast2,  previous.fromEast3
    )
        
    if (hl + best < node.fromNorth1) { node.fromNorth1 = hl + best; changed = true }    
    
    if (hl + previous.fromNorth1 < node.fromNorth2) { node.fromNorth2 = hl + previous.fromNorth1; changed = true }
    
    if (hl + previous.fromNorth2 < node.fromNorth3) { node.fromNorth3 = hl + previous.fromNorth2; changed = true }

    pushToFuturePoints(futurePoints, walkingRound, node, changed)
}

function handleFromSouth(node, previous, futurePoints, walkingRound) {
    
    const hl = node.original // heat loss
    
    let changed = false
    
    const best = Math.min(
    
        previous.fromWest1,  previous.fromWest2,  previous.fromWest3,
        previous.fromEast1,  previous.fromEast2,  previous.fromEast3
    )
        
    if (hl + best < node.fromSouth1) { node.fromSouth1 = hl + best; changed = true }    
    
    if (hl + previous.fromSouth1 < node.fromSouth2) { node.fromSouth2 = hl + previous.fromSouth1; changed = true }
    
    if (hl + previous.fromSouth2 < node.fromSouth3) { node.fromSouth3 = hl + previous.fromSouth2; changed = true }

    pushToFuturePoints(futurePoints, walkingRound, node, changed)
}

function handleFromWest(node, previous, futurePoints, walkingRound) {
    
    const hl = node.original // heat loss
    
    let changed = false
    
    const best = Math.min(
    
        previous.fromNorth1, previous.fromNorth2, previous.fromNorth3,
        previous.fromSouth1, previous.fromSouth2, previous.fromSouth3
    )
        
    if (hl + best < node.fromWest1) { node.fromWest1 = hl + best; changed = true }    
    
    if (hl + previous.fromWest1 < node.fromWest2) { node.fromWest2 = hl + previous.fromWest1; changed = true }
    
    if (hl + previous.fromWest2 < node.fromWest3) { node.fromWest3 = hl + previous.fromWest2; changed = true }

    pushToFuturePoints(futurePoints, walkingRound, node, changed)
}

function handleFromEast(node, previous, futurePoints, walkingRound) {
    
    const hl = node.original // heat loss
    
    let changed = false
    
    const best = Math.min(
    
        previous.fromNorth1, previous.fromNorth2, previous.fromNorth3,
        previous.fromSouth1, previous.fromSouth2, previous.fromSouth3
    )
        
    if (hl + best < node.fromEast1) { node.fromEast1 = hl + best; changed = true }    
    
    if (hl + previous.fromEast1 < node.fromEast2) { node.fromEast2 = hl + previous.fromEast1; changed = true }
    
    if (hl + previous.fromEast2 < node.fromEast3) { node.fromEast3 = hl + previous.fromEast2; changed = true }

    pushToFuturePoints(futurePoints, walkingRound, node, changed)
}

///////////////////////////////////////////////////////////

function pushToFuturePoints(futurePoints, walkingRound, node, changed) {

    if (! changed) { return }
    
    if (node.selectedRound == walkingRound) { return }

    node.selectedRound = walkingRound
    
    futurePoints.push(createPoint(node.row, node.col))
}

main()

