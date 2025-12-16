// solution for https://adventofcode.com/2025/day/9 part 2

"use strict"

// this solution shoud work with complex/irregular perimeters:
    
//         ######  #######
//         #    ####     #
//  #####  #             #
//  #   #  #     ######  #
//  #   #  #     #    #  #
//  #   #  #     #  ###  #
//  #   ####     #  #    #
//  #            #  #    #
//  #   ####     #  ######
//  #   #  #     #
//  #   #  #     # #####
//  #   #  #     ###   ####
//  #####  #              #
//         #        #######
//  ########        #         
//  #               ###########
//  #                         #
//  ###########################


//
//             ***VERY IMPORTANT 1***
//
// This program expects the coordinates order to be **CLOCKWISE**.
//

//
//             ***VERY IMPORTANT 2***
//
// First this program was written using the system {ROW,COL} FOR COORDINATES, NOT THE {X,Y} system;
// but for solving the puzzle input which seems to use the input {X,Y} coordinates, I've made this hack:
//
// Inside the function 'fillAllRedTiles', I have changed the {ROW,COL} order:
//   
//        const col = parseInt(tokens.shift())
//        const row = parseInt(tokens.shift())
//        
// This means that now the program EXPECTS {X,Y} coordinates as input, although it
// talks all the time about {ROW,COL}.
//
// Feel free to reverse that hack as you need. 
//

const input = Deno.readTextFileSync("day09-input.txt").trim()

const NONE = 0
const ABOVE = 1
const BELOW = 2
const AT_LEFT = 3
const AT_RIGHT = 4

const allRedTiles = [ ]

var highestRow = 999999

const perimeter = [ ]

var largestArea = 0


function main() {

    fillAllRedTiles()
    
    createPerimeter()
    
    improvePerimeterInfo()
    
    searchRectangles()
    
    console.log("the answer is", largestArea)
}

// preparing data -------------------------------------------------------------

function fillAllRedTiles() {

    const rawLines = input.split("\n")
    
    for (const rawLine of rawLines) { 
    
        const tokens = rawLine.trim().split(",")
    
        const col = parseInt(tokens.shift())
        const row = parseInt(tokens.shift())
        
        allRedTiles.push({ "row": row, "col": col })
        
        if (row < highestRow) { highestRow = row }
    }
}

function createPerimeter() {

    for (let index = 1; index < allRedTiles.length; index++) {
    
        createSegment(index - 1, index)
    }
    
    createSegment(allRedTiles.length - 1, 0) // last -> first redTiles
}
    
function createSegment(indexA, indexB) {

    const tileA = allRedTiles[indexA]
    const tileB = allRedTiles[indexB]
        
    const top = (tileA.row < tileB.row) ? tileA.row : tileB.row

    const bottom = (tileB.row > tileA.row) ? tileB.row : tileA.row
    
    const left = (tileA.col < tileB.col) ? tileA.col : tileB.col
    
    const right = (tileB.col > tileA.col) ? tileB.col : tileA.col
            
    const segment = { "top": top, "bottom": bottom, "left": left, "right": right, 

                      "index": perimeter.length, "greenAreaIs": NONE }
        
    perimeter.push(segment)
}

function improvePerimeterInfo() {

    let index = highestHorizontalSegmentIndex() // no problem if there ara two or more
    
    const highestSegment = perimeter[index]
    
    highestSegment.greenAreaIs = BELOW

    let previousSegment = highestSegment
        
    while (true) {
            
        index += 1
        
        if (index == perimeter.length) { index = 0 }
    
        const segment = perimeter[index]
    
        if (segment.greenAreaIs != NONE) { return } // already done
        
        if (segment.top == segment.bottom) { 
        
            markHorizontalSegment(segment, previousSegment)
        }
        else {
            markVerticalSegment(segment, previousSegment)
        }
        
        previousSegment = segment
    }
}
    
function highestHorizontalSegmentIndex() { 
    
    for (let index = 0; index < perimeter.length; index++) {
    
        const segment = perimeter[index] 
        
        if (segment.top > highestRow) { continue }
        
        if (segment.top != segment.bottom) { continue } // vertical segment
        
        return index
    }
}

function markVerticalSegment(segment, previousSegment) {

    if (segment.top == previousSegment.top) { // going down
    
        segment.greenAreaIs = (previousSegment.greenAreaIs == BELOW) ? AT_LEFT : AT_RIGHT    
    }
    else { // going up

        segment.greenAreaIs = (previousSegment.greenAreaIs == BELOW) ? AT_RIGHT : AT_LEFT 
    }
}

function markHorizontalSegment(segment, previousSegment) {

    if (segment.left == previousSegment.left) { // going right
    
        segment.greenAreaIs = (previousSegment.greenAreaIs == AT_LEFT) ? ABOVE : BELOW   
    }
    else { // going left

        segment.greenAreaIs = (previousSegment.greenAreaIs == AT_LEFT) ? BELOW : ABOVE 
    }
}

// searching ------------------------------------------------------------------

function searchRectangles() {            
            
    const len = allRedTiles.length

    for (let indexA = 0; indexA < len; indexA++) {
   
        for (let indexB = indexA+1; indexB < len; indexB++) {
        
            const tileA = allRedTiles[indexA]
            const tileB = allRedTiles[indexB]
       
            const top = (tileA.row < tileB.row) ? tileA.row : tileB.row

            const bottom = (tileB.row > tileA.row) ? tileB.row : tileA.row
            
            const left = (tileA.col < tileB.col) ? tileA.col : tileB.col
            
            const right = (tileB.col > tileA.col) ? tileB.col : tileA.col
                        
            const width  = 1 + (right - left)
            const height = 1 + (bottom - top)

            const area = width * height
            
            if (area <= largestArea) { continue }

            if (rectangleHasIntruder(top, left, bottom, right)) { continue }
           
            if (! isGoodUpperLeftCorner(top, left)) { continue }
            
            largestArea = area
        }
    }
}

function rectangleHasIntruder(top, left, bottom, right) {

    for (const segment of perimeter) {
    
        if (segment.top    >= bottom) { continue }
        if (segment.bottom <= top)    { continue }
        
        if (segment.left  >= right) { continue }
        if (segment.right <= left)  { continue }
        
        return true
    }
     
    return false
}


/************************************************************
 
    diagrams for the upper-left corner:
    ----------------------------------
    
corner at the start of the row, its column goes down:

        
     #-------
     | green
     |
     |       #

.........................................        
     
corner at the start of the row, its column goes up:

     |
     |
     | 
     #--------
       green
        
             #
             
.........................................     
     
corner at the end of the row, its column goes up:
     
             |
             | 
             |
     --------#
       green
        
                 #
.........................................     
                  
corner at the end of the row, its column goes down:
             
        
     --------#
             | 
             |  green
             |    
                   #
                   
************************************************************/
       
function isGoodUpperLeftCorner(cornerRow, cornerCol) { // corner coordinates

    for (const segment of perimeter) {

        if (segment.top != segment.bottom) { continue } // vertical segment
        
        if (segment.top != cornerRow) { continue }
                
        if (segment.left == cornerCol) { return segment.greenAreaIs == BELOW }
        
        const columnAtRight = findColumnAtRight(segment) 
        
        // column goes up
        if (columnAtRight.bottom == segment.top) { return segment.greenAreaIs == BELOW }
        
        // column goes down        
        return columnAtRight.greenAreaIs == AT_RIGHT
    }
}
    
function findColumnAtRight(segment) {
    
    const targetLeft = segment.right
    
    const deltas = [ -1, +1 ]
    
    for (const delta of deltas) {
    
        let index = segment.index + delta
        
        if (index == -1) { index = perimeter.length - 1 }
        
        if (index == perimeter.length) { index = 0 }
    
        const candidate = perimeter[index]
        
        if (candidate.left == targetLeft) { return candidate }    
    }
    
    console.log("ERROR in function 'findColumnAtRight'")
}
  
console.time("execution time")
main()
console.timeEnd("execution time") // 24ms

