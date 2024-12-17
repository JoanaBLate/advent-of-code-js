"use strict"

// solving the puzzle takes (my computer) 0.032s

// not using any math theorem!

const input = Deno.readTextFileSync("input.txt").trim()

const BEAMS = [ ]

const COLUMNS = [ ]

var WIDTH = 0
var HEIGHT = 0

const UP = 1
const DOWN = 2

var futures = [ ]

var TOTAL = 0


function main() {

    processInput()
    
    setDimsAndAdjustCoordinates()

    flood()
        
    console.log("the answer is", TOTAL)    
}

///////////////////////////////////////////////////////////

function processInput() {
        
    let previousRow = 0
    let previousCol = 0
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        tokens.shift()
        tokens.shift()
        
        const info = tokens.shift().substr(2, 6)

        const amount = parseInt(info.substr(0, 5), 16)

        const direction = "RDLU"[parseInt(info.substr(5, 1))]

        const data = createRawData(previousRow, previousCol, direction, amount)
        
        previousRow = data.row
        previousCol = data.col 
        
        const isBeam = (data.top == data.bottom  &&  data.left != data.right)
        
        if (isBeam) {
        
            BEAMS.push({ "row": data.row, "left": data.left + 1, "right": data.right - 1}) // NO MORE OVERLAPPING
        }
        else {
        
            COLUMNS.push({ "col": data.col, "top": data.top, "bottom": data.bottom })        
        }
    }    
}

///////////////////////////////////////////////////////////

function createRawData(previousRow, previousCol, direction, steps) {

    TOTAL += steps

    let row = previousRow
    let col = previousCol
    
    if (direction == "U") { row = previousRow - steps }

    if (direction == "D") { row = previousRow + steps }

    if (direction == "L") { col = previousCol - steps }

    if (direction == "R") { col = previousCol + steps }
    
    const left  = (previousCol < col) ? previousCol : col
    const right = (previousCol < col) ? col : previousCol
    
    const top = (previousRow < row) ? previousRow : row
    const bottom = (previousRow < row) ? row : previousRow    
    
    return { "row": row, "col": col, "top": top, "left": left, "right": right, "bottom": bottom }
}

/////////////////////////////////////////////////////////// 

function setDimsAndAdjustCoordinates() {
    
    let smallestRow = 0
    let smallestCol = 0

    let biggestRow = 0
    let biggestCol = 0
    
    for (const beam of BEAMS) {

        if (beam.row < smallestRow) { smallestRow = beam.row }
        if (beam.row > biggestRow)  { biggestRow = beam.row }
    }
    
    for (const column of COLUMNS) {
    
        if (column.col < smallestCol) { smallestCol = column.col }        
        if (column.col > biggestCol)  { biggestCol = column.col }
    }
    
    WIDTH = biggestCol - smallestCol + 1
    
    HEIGHT = biggestRow - smallestRow + 1
        
    for (const beam of BEAMS) {
    
        beam.row    -= smallestRow
        beam.left   -= smallestCol
        beam.right  -= smallestCol    
    }
    
    for (const column of COLUMNS) {
    
        column.col    -= smallestCol
        column.top    -= smallestRow
        column.bottom -= smallestRow
    }
}

///////////////////////////////////////////////////////////

function deepestBeam() {

    let best = BEAMS[0]
    
    for (const beam of BEAMS) { if (beam.row > best.row) { best = beam } }
    
    return best
}
        
function findLeftColumn(row, left) {

    let best = null

    for (const column of COLUMNS) {
    
        if (column.top > row) { continue }
        
        if (column.bottom < row) { continue }
        
        if (column.col == left) { return column }
        
        if (column.col > left)  { continue }
        
        if (best == null) { best = column; continue }
        
        if (column.col > best.col) { best = column }
    }
    return best
}

function findRightColumn(row, right) {

    let best = null

    for (const column of COLUMNS) {
    
        if (column.top > row) { continue }
        
        if (column.bottom < row) { continue }
        
        if (column.col == right) { return column }
        
        if (column.col < right)  { continue }
        
        if (best == null) { best = column; continue }
        
        if (column.col < best.col) { best = column }
    }
    
    return best
}

function findRoof(bottom, left, right) {

    let best = null

    for (const beam of BEAMS) {
    
        if (beam.row >= bottom) { continue }
        
        if (beam.left > right) { continue }
        
        if (beam.right < left) { continue }
        
        if (best == null) { best = beam; continue }
        
        if (beam.row > best.row) { best = beam }
    }
    
    return best
}
  
function findFloor(top, left, right) {

    let best = null

    for (const beam of BEAMS) {
    
        if (beam.row < top) { continue }
        
        if (beam.left > right) { continue }
        
        if (beam.right < left) { continue }
        
        if (best == null) { best = beam; continue }
        
        if (beam.row < best.row) { best = beam }
    }
    
    return best
}
        
function findBeams(row, left, right) {

    let beams = [ ]
    
    for (const beam of BEAMS) {
    
        if (beam.row != row) { continue }
        
        if (beam.left > right) { continue }

        if (beam.right < left) { continue }
        
        beams.push(beam)
    }
    
    return beams
}

function orderByLeft(list) {

    if (list.length == 1) { return }
    
    let n = -1 
    
    while (true) {
        
        n += 1
        
        const a = list[n]
        const b = list[n + 1]
        
        if (b == undefined) { return }
        
        if (b.left < a.left) {
        
            list[n] = b
            list[n + 1] = a
            
            n = Math.max(-1, n - 2)
        }
    }        
}

function floodArea(top, left, bottom, right) {

    const width = right - left + 1
    const height = bottom - top + 1
    
    TOTAL += width * height
}

function createInfo(row, left, right, going) {

    return { "row": row, "left": left, "right": right, "going": going }
}

///////////////////////////////////////////////////////////

function flood() {

    const floor = deepestBeam() // expecting there is a minimum room over floor    
    
    floodFromBottom(floor.row - 1, floor.left, floor.right)
   
    while (true) {
    
        if (futures.length == 0) { return }
        
        const currents = futures
        
        futures = [ ]
        
        for (const info of currents) { 
        
            if (info.going == UP) { 
                
                floodFromBottom(info.row, info.left, info.right)
            }
            else {                
                floodFromTop(info.row, info.left, info.right)            
            }
        }
    }
}

///////////////////////////////////////////////////////////

function floodFromBottom(bottom, baseLeft, baseRight) {  // *INCLUSIVE* coordinates of the *NEW* area

    const leftColumn = findLeftColumn(bottom, baseLeft)
    
    const rightColumn = findRightColumn(bottom, baseRight)
    
    const left = leftColumn.col + 1
    const right = rightColumn.col - 1
    
    if (left < baseLeft) { maybeFlood(bottom + 1, left, baseLeft - 2, DOWN) }  // "- 2" includes column
    
    if (right > baseRight) { maybeFlood(bottom + 1, baseRight + 2, right, DOWN) }  // "+ 2" includes column

    let top = Math.max(leftColumn.top, rightColumn.top)
    
    let roofless = true
    
    const roof = findRoof(bottom, left, right)
    
    if (roof == null) { return } // no more room
    
    const minTop = roof.row + 1
        
    if (top <= minTop) { top = minTop; roofless = false }
    
    floodArea(top, left, bottom, right)    

    const newBottom = top - 1
    
    if (roofless) {
    
        const info = createInfo(newBottom, left, right, UP)
        
        futures.push(info)
    }    
    else {    
        maybeFlood(newBottom, left, right, UP)    
    }    
}

///////////////////////////////////////////////////////////

function floodFromTop(top, baseLeft, baseRight) {  // *INCLUSIVE* coordinates of the *NEW* area

    const leftColumn = findLeftColumn(top, baseLeft)
    
    const rightColumn = findRightColumn(top, baseRight)
    
    const left = leftColumn.col + 1
    const right = rightColumn.col - 1
    
    if (left < baseLeft) { maybeFlood(top - 1, left, baseLeft - 2, UP) }  // "- 2" includes column
    
    if (right > baseRight) { maybeFlood(top - 1, baseRight + 2, right, UP) }  // "+ 2" includes column

    let bottom = Math.min(leftColumn.bottom, rightColumn.bottom)
    
    let floorless = true
    
    const floor = findFloor(top, left, right)
    
    if (floor == null) { return } // no more room
    
    const maxBottom = floor.row - 1
        
    if (bottom >= maxBottom) { bottom = maxBottom; floorless = false }
    
    floodArea(top, left, bottom, right)    

    const newTop = bottom + 1
    
    if (floorless) {
    
        const info = createInfo(newTop, left, right, DOWN)
        
        futures.push(info)
    }    
    else {    
        maybeFlood(newTop, left, right, DOWN)    
    }    
}

///////////////////////////////////////////////////////////
    
function maybeFlood(row, left, right, going) { // *INCLUSIVE* coordinates of the *NEW* area 

    const beams = findBeams(row, left, right)
  
    orderByLeft(beams)
    
    const first = beams[0]
    const last  = beams.at(-1)
    
    if (first.left <= left) { left = first.right + 2; beams.shift() } // "+ 2" includes column
    
    if (last.right >= right) { right = last.left - 2; beams.pop() } // "- 2" includes column
    
    for (const beam of beams) {

        const thisRight = beam.left - 2 // "- 2" includes column
            
        const info = createInfo(row, left, thisRight, going)
  
        futures.push(info)
        
        left = beam.right + 2 // "+ 2" includes column
    }
    
    if (left > right) { return } // happens when there is no more room above (or below)
    
    const info = createInfo(row, left, right, going)
    
    futures.push(info)
}

///////////////////////////////////////////////////////////

main()

