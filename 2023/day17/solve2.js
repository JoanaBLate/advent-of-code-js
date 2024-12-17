"use strict"

// solving the puzzle takes (my computer) 0.120s


const BIG_NUMBER = 999

const board = [ ] // stores original heat losses and *BEFORE TURNING* heat loss;
                  // the magic of storing only before turning data is twofold:
                  // 1) the path is basically made by (many) turning nodes
                  // 2) when a turn is made, does not matter how many
                  //    steps (4 to 10) the previous segment of the path had
                  //    (we only need to memorize onde value per direction)

var width = 0
var height = 0


function main() {

    processInput()
        
    const home = board[0][0]
    
    home.fromNorth = 0
    home.fromSouth = 0
    home.fromWest  = 0
    home.fromEast  = 0
        
    walk()
   
    const target = board[height - 1][width - 1]
    
    const best = Math.min(target.fromNorth, target.fromSouth, target.fromWest, target.fromEast)
    
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
    
        const boardLine = [ ]
        
        let col = -1
        
        for (const c of line.trim()) { 
        
            col += 1
            
            const boardNode = createBoardNode(row, col, parseInt(c))
            
            boardLine.push(boardNode) 
        }        
        board.push(boardLine)
    }
}

///////////////////////////////////////////////////////////

function createBoardNode(row, col, heatLoss) {

    return {
    
        "row": row,
        "col": col,
        "heatLoss": heatLoss,
        "fromNorth": BIG_NUMBER, // before turning
        "fromSouth": BIG_NUMBER, // before turning
        "fromWest":  BIG_NUMBER, // before turning
        "fromEast":  BIG_NUMBER  // before turning
    }
}

function createPoint(row, col, forbidden) {

    return { "row": row, "col": col, "forbidden": forbidden }
}
               
// walk ///////////////////////////////////////////////////
              
function walk() {

    let futurePoints = [ createPoint(0, 0, "any") ]
        
    while (true) {
    
        const currentPoints = futurePoints
        
        if (currentPoints.length == 0) { return }
    
        futurePoints = [ ]
        
        for (const point of currentPoints) {
        
            if (point.forbidden != "vertical") {
    
                walkToNorth(point.row, point.col, futurePoints) 
                walkToSouth(point.row, point.col, futurePoints) 
            }
        
            if (point.forbidden != "horizontal") {
            
                walkToWest(point.row, point.col, futurePoints) 
                walkToEast(point.row, point.col, futurePoints) 
            }
        }
    } 
}

// walk vertical //////////////////////////////////////////

function walkToNorth(baserow, basecol, futurePoints) {

    const basenode = board[baserow][basecol]
    
    const col = basecol
        
    let hl = Math.min(basenode.fromWest, basenode.fromEast) 
    
    for (let n = 1; n <= 10; n++) {
    
        const row = baserow - n
    
        if (row < 0) { return }
        
        hl += board[row][col].heatLoss
        
        if (n < 4)  { continue }
        
        if (board[row][col].fromSouth <= hl) { continue }
        
        board[row][col].fromSouth = hl
        
        futurePoints.push(createPoint(row, col, "vertical"))
    }
}              

function walkToSouth(baserow, basecol, futurePoints) {

    const basenode = board[baserow][basecol]
    
    const col = basecol
        
    let hl = Math.min(basenode.fromWest, basenode.fromEast) 
    
    for (let n = 1; n <= 10; n++) {
    
        const row = baserow + n
        
        if (row > height - 1) { return }
        
        hl += board[row][col].heatLoss
        
        if (n < 4)  { continue }
        
        if (board[row][col].fromNorth <= hl) { continue }
        
        board[row][col].fromNorth = hl
        
        futurePoints.push(createPoint(row, col, "vertical"))
    }
}    

// walk horizontal ////////////////////////////////////////

function walkToEast(baserow, basecol, futurePoints) {

    const basenode = board[baserow][basecol]
    
    const row = baserow
        
    let hl = Math.min(basenode.fromNorth, basenode.fromSouth) 
    
    for (let n = 1; n <= 10; n++) {
    
        const col = basecol + n
    
        if (col > width - 1) { return }
        
        hl += board[row][col].heatLoss
        
        if (n < 4)  { continue }
        
        if (board[row][col].fromWest <= hl) { continue }
        
        board[row][col].fromWest = hl
        
        futurePoints.push(createPoint(row, col, "horizontal"))
    }
}              

function walkToWest(baserow, basecol, futurePoints) {

    const basenode = board[baserow][basecol]
    
    const row = baserow
        
    let hl = Math.min(basenode.fromNorth, basenode.fromSouth) 
    
    for (let n = 1; n <= 10; n++) {
    
        const col = basecol - n
    
        if (col < 0) { return }
        
        hl += board[row][col].heatLoss
        
        if (n < 4)  { continue }
        
        if (board[row][col].fromEast <= hl) { continue }
        
        board[row][col].fromEast = hl
        
        futurePoints.push(createPoint(row, col, "horizontal"))
    }
}

main()

