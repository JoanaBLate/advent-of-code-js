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

                      "index": perimeter.length, "offAreaIs": NONE }
        
    perimeter.push(segment)
}

function improvePerimeterInfo() {

    let index = highestHorizontalSegmentIndex() // no problem if there ara two or more
    
    const highestSegment = perimeter[index]
    
    highestSegment.offAreaIs = ABOVE

    let previousSegment = highestSegment
        
    while (true) {
            
        index += 1
        
        if (index == perimeter.length) { index = 0 }
    
        const segment = perimeter[index]
    
        if (segment.offAreaIs != NONE) { return } // already done
        
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
    
        segment.offAreaIs = (previousSegment.offAreaIs == ABOVE) ? AT_RIGHT : AT_LEFT    
    }
    else { // going up

        segment.offAreaIs = (previousSegment.offAreaIs == ABOVE) ? AT_LEFT : AT_RIGHT 
    }
}

function markHorizontalSegment(segment, previousSegment) {

    if (segment.left == previousSegment.left) { // going right
    
        segment.offAreaIs = (previousSegment.offAreaIs == AT_LEFT) ? BELOW : ABOVE   
    }
    else { // going left

        segment.offAreaIs = (previousSegment.offAreaIs == AT_LEFT) ? ABOVE : BELOW 
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
           
            if (isBadUpperLeftCorner(top, left)) { continue }
            
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

        off
     #-------
     | green
     |
     |       #

.........................................        
     
corner at the start of the row, its column goes up:

     |
     |
     |  off
     #--------
       green
        
             #
             
.........................................     
     
corner at the end of the row, its column goes up:
     
             |
             |
        off  |
     --------#
            green
        
                 #
.........................................     
                  
corner at the end of the row, its column goes down:
             
       green  
     --------#
        off  | 
             |  green
             |    
                   #
                   
 (this diagram is different from the others: off area is below)  
                   
************************************************************/
       
function isBadUpperLeftCorner(cornerRow, cornerCol) { // corner coordinates

    for (const segment of perimeter) {

        if (segment.top != segment.bottom) { continue } // vertical segment
        
        if (segment.top != cornerRow) { continue }
                
        if (segment.left == cornerCol) { return segment.offAreaIs == ABOVE }
        
        if (columnAtEndGoesUp(segment)) { return segment.offAreaIs == ABOVE }
        
        return ! segment.offAreaIs == ABOVE
    }
}
    
function columnAtEndGoesUp(segment) {

    const targetLeft = segment.right
    const targetBottom = segment.top
    
    const deltas = [ -1, +1 ]
    
    for (const delta of deltas) {
    
        let index = segment.index + delta
        
        if (index == -1) { index = perimeter.length - 1 }
        
        if (index == perimeter.length) { index = 0 }
    
        const candidate = perimeter[index]
        
        if (candidate.left == targetLeft  &&  candidate.bottom == targetBottom) { return true }    
    }

    return false
}
  
console.time("execution time")
main()
console.timeEnd("execution time") // 24ms

