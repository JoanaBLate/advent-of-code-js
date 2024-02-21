"use strict"

// solving the puzzle takes (my computer) 0.030s

/*

    flat map to faces of the cube (*MY* input)

    -AB
    -C-
    DE-
    F--

    A -> top
    B -> right
    C -> front
    D -> left
    E -> bottom
    F -> back
*/


const input = Deno.readTextFileSync("input.txt").trimEnd()

const EAST  = 0
const SOUTH = 1
const WEST  = 2
const NORTH = 3

const MAP = [ ]

const DIM = 50
    
const TOP = [ ]    // cube face

const RIGHT = [ ]  // cube face

const FRONT = [ ]  // cube face

const LEFT  = [ ]  // cube face

const BOTTOM = [ ] // cube face

const BACK   = [ ] // cube face
    
var PATH = ""

var ROW = 0
var COL = 0
var FACE = TOP
var TOWARD = EAST


function main() {

    processInput()
    
    fillCubeFace(0, 1, TOP)
    fillCubeFace(0, 2, RIGHT)    
    fillCubeFace(1, 1, FRONT)    
    fillCubeFace(2, 0, LEFT)    
    fillCubeFace(2, 1, BOTTOM)    
    fillCubeFace(3, 0, BACK)
    
    //
    
    while (PATH != "") { walk() }
    
    let row = 0
    let col = 0
    
    if (FACE == TOP) { col = DIM }
    
    else if (FACE == RIGHT) { col = 2 * DIM }
    
    else if (FACE == FRONT) { row = DIM; col = DIM }
    
    else if (FACE == LEFT)  { row = 2 * DIM }
    
    else if (FACE == BOTTOM) { row = 2 * DIM; col = DIM }
    
    else { row = 3 * DIM } // BACK
    
    row += ROW + 1 // base one
    col += COL + 1 // base one
    
    console.log("the answer is", 1000 * row + 4 * col + TOWARD)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.split("\n\n")
    
    PATH = parts.pop().trim()
    
    const lines = parts.shift().split("\n")
    
    for (const _line of lines) { 
        
        const line = _line.trimEnd()
        
        if (line == "") { continue }
        
        MAP.push(line) 
    }
}

///////////////////////////////////////////////////////////

function fillCubeFace(padRow, padCol, face) {

    padRow *= DIM
    padCol *= DIM

    for (let row = 0; row < DIM; row++) {
    
        const line = MAP[padRow + row]
        
        face.push(line.substr(padCol, DIM))
    }
}

///////////////////////////////////////////////////////////

function walk() {

    if (PATH[0] == "L") { PATH = PATH.substr(1); spinLeft(); return }

    if (PATH[0] == "R") { PATH = PATH.substr(1); spinRight(); return }

    let s = ""
    
    while (PATH != "") {
    
        if (PATH[0] == "L") { break }
        if (PATH[0] == "R") { break }
    
        s += PATH[0]
        
        PATH = PATH.substr(1)    
    }

    if (s == "") { return }

    move(parseInt(s))
}

///////////////////////////////////////////////////////////

function spinLeft() {

    if (TOWARD == NORTH) { TOWARD = WEST;  return }
    if (TOWARD == WEST)  { TOWARD = SOUTH; return }
    if (TOWARD == SOUTH) { TOWARD = EAST;  return }
    if (TOWARD == EAST)  { TOWARD = NORTH; return }
}

function spinRight() {

    if (TOWARD == NORTH) { TOWARD = EAST;  return }
    if (TOWARD == EAST)  { TOWARD = SOUTH; return }
    if (TOWARD == SOUTH) { TOWARD = WEST;  return }
    if (TOWARD == WEST)  { TOWARD = NORTH; return }
} 

function move(steps) {

    let row = ROW
    let col = COL
    
    while (steps > 0) {
    
        if (TOWARD == NORTH) { row -= 1 }
        if (TOWARD == SOUTH) { row += 1 }
        if (TOWARD == WEST)  { col -= 1 }
        if (TOWARD == EAST)  { col += 1 }

        if (row < 0) { changeFace(steps); return }
        if (col < 0) { changeFace(steps); return }
        
        if (row > DIM - 1) { changeFace(steps); return }
        if (col > DIM - 1) { changeFace(steps); return }
            
        if (FACE[row][col] == "#") { return }
            
        ROW = row 
        COL = col
        steps -= 1
    }
}

///////////////////////////////////////////////////////////

function changeFace(steps) {

    let row = ROW
    let col = COL
    let face = null
    let toward = TOWARD
    
    const first = 0
    const last = DIM - 1
    const oppositeRow = DIM - 1 - ROW
    
    //

    if (FACE == TOP) {     
    
        if (TOWARD == NORTH) { face=BACK; toward=EAST; row=COL; col=first }
        
        else if (TOWARD == SOUTH) { face=FRONT; row=first }
        
        else if (TOWARD == WEST)  { face=LEFT; toward=EAST; row=oppositeRow; col=first }
        
        else if (TOWARD == EAST)  { face=RIGHT; col=first }
    }
    
    else if (FACE == RIGHT) {     

        if (TOWARD == NORTH) { face=BACK; row=last }
        
        else if (TOWARD == SOUTH) { face=FRONT; toward=WEST; row=COL; col=last }
        
        else if (TOWARD == WEST)  { face=TOP; col=last }
        
        else if (TOWARD == EAST)  { face=BOTTOM; toward=WEST; row=oppositeRow; col=last }
    }
    
    else if (FACE == FRONT) {     
   
        if (TOWARD == NORTH) { face=TOP; row=last }
        
        else if (TOWARD == SOUTH) { face=BOTTOM; row=first } 
        
        else if (TOWARD == WEST)  { face=LEFT; toward=SOUTH; row=first; col=ROW }
        
        else if (TOWARD == EAST)  { face=RIGHT; toward=NORTH; row=last; col=ROW }
    }
    
    else if (FACE == LEFT) {     
    
        if (TOWARD == NORTH) { face=FRONT; toward=EAST; row=COL; col=first }
        
        else if (TOWARD == SOUTH) { face=BACK; row=first }
        
        else if (TOWARD == WEST)  { face=TOP; toward=EAST; row=oppositeRow; col=first }
        
        else if (TOWARD == EAST)  { face=BOTTOM; col=first }
    }
    
    else if (FACE == BOTTOM) {      
   
        if (TOWARD == NORTH) { face=FRONT; row=last }
        
        else if (TOWARD == SOUTH) { face=BACK; toward=WEST; row=COL; col=last } 
        
        else if (TOWARD == WEST)  { face=LEFT; col=last }
        
        else if (TOWARD == EAST)  { face=RIGHT; toward=WEST; row=oppositeRow; col=last }  
        
    }        
        
    else if (FACE == BACK) {     
    
        if (TOWARD == NORTH) { face=LEFT; row=last }
        
        else if (TOWARD == SOUTH) { face=RIGHT; row=first }
        
        else if (TOWARD == WEST) { face=TOP; toward=SOUTH; row=first; col=ROW }
        
        else if (TOWARD == EAST) { face=BOTTOM; toward=NORTH; row=last; col=ROW }
    }
    
    //

    if (face[row][col] == "#") { return }
    
    ROW = row
    COL = col   
    FACE = face
    TOWARD = toward

    move(steps - 1)
}

///////////////////////////////////////////////////////////

main()

