"use strict"

// solving the puzzle takes (my computer) 0.044s

/*
    **WARNING**: 
    
    IF YOU ARE GETTING A WRONG RESULT,
    LOOK AT FUNCTION 'tryLeaveRoom' AND EDIT IT


  notes:

    hallway positions over the rooms are despised
    
    pawn D can not go left beyond its room minus 1
    
    map coordinates:
    
    -------------
    -01.2.3.4.56-
    ---7-8-9-a---
    ---b-c-d-e---
    -------------

    (hexadecimal style)
    (valid positions only)
    
    map state "cd30a9b7" means:
    
    A  is at c
    A' is at d
    B  is at 3
    B' is at 0
    C  is at a
    C' ia at 9
    D  is at b
    D' is at 7
*/

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

const SPOTS = [ ]

const COORDS = "0123456789abcde"

const COST = { "A": 1, "B": 10, "C": 100, "D": 1000 }

const hallCols = [ 1, 2, 4, 6, 8, 10, 11 ]

const roomColFor = { "A": 3, "B": 5, "C": 7, "D": 9 }

var FUTURE = [ ]

const MEMORY = { }

var costOfCurrentMap = 0

var BEST_COST = Infinity


function main() {

    processInput()
    
    fillSpots()
    
 // show()
    
    search()
    
    console.log("the answer is", BEST_COST)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        MAP.push(line.trimEnd().padEnd(13, " ").split(""))
    }
}

///////////////////////////////////////////////////////////

function fillSpots() {

    const coords = [ // made by hand for skipping some positions in the hall
    
        1,1, 1,2,  1,4,  1,6,  1,8,  1,10, 1,11, // top row 
        //       A     B     C     D
                2,3,  2,5,  2,7,  2,9,           // bottom row 1
                3,3,  3,5,  3,7,  3,9            // bottom row 2
    ]
    
    while (coords.length > 0) {
    
        const point = createPoint(coords.shift(), coords.shift())
        
        SPOTS.push(point)
    }
}

function createPoint(row, col) {

    return { "row": row, "col": col }
}   

///////////////////////////////////////////////////////////

function condenseMap() {

    const result = [ "","",  "","",  "","",  "","" ]

    const baseIndex = { "A": 0, "B": 2, "C": 4, "D": 6 }
    
    for (let n = 0; n < 15; n++) {
    
        const point = SPOTS[n]
        
        let pawn = MAP[point.row][point.col]
        
        if (pawn == ".") { continue }
        
        const coord = COORDS[n]

        const index = baseIndex[pawn]
        
        if (result[index] == "") { result[index] = coord } else { result[index + 1] = coord }        
    }
    
    return result.join("")
}

function resetMap(string) {

    for (const point of SPOTS) { MAP[point.row][point.col] = "." }
    
    for (let n = 0; n < 8; n++) {
    
        const pawn = "AABBCCDD"[n]
        
        const coord = string[n]
     
        const index = parseInt(coord, 16)
        
        const point = SPOTS[index]

        MAP[point.row][point.col] = pawn
    }
}

///////////////////////////////////////////////////////////

function createMaze(map, cost) {

    return { "map": map, "cost": cost }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function search() {

    const map = condenseMap()
    
    FUTURE.push(createMaze(map, 0))
    
    while (FUTURE.length != 0) {
   
     // console.log("queue length", FUTURE.length)
    
        const mazes = FUTURE
        
        FUTURE = [ ]
        
        for (const maze of mazes) { searchThis(maze.map, maze.cost) } 
    }
}

function searchThis(map, cost) {

    resetMap(map)
    costOfCurrentMap = cost
    
    let success = false
    
    if (tryLeaveHall(1))  { success = true }
    if (tryLeaveHall(2))  { success = true }
    if (tryLeaveHall(4))  { success = true }
    if (tryLeaveHall(6))  { success = true }
    if (tryLeaveHall(8))  { success = true }
    if (tryLeaveHall(10)) { success = true }
    if (tryLeaveHall(11)) { success = true }
    
    if (success) { return } // not going to hall when a room can be fixed

    tryLeaveTopRoom(3)
    tryLeaveTopRoom(5)
    tryLeaveTopRoom(7)
    tryLeaveTopRoom(9)

    tryLeaveBottomRoom(3)
    tryLeaveBottomRoom(5)
    tryLeaveBottomRoom(7)
    tryLeaveBottomRoom(9)
}

///////////////////////////////////////////////////////////

function tryLeaveHall(pawnCol) {
    
    const pawn = MAP[1][pawnCol] 

    if (pawn == ".") { return }
    
    const roomCol = roomColFor[pawn]

    if (MAP[2][roomCol] != ".") { return }
    
    const bottom = MAP[3][roomCol]
    
    if (bottom != "."  &&  bottom != pawn) { return }
    
    if (hallIsBlocked(pawnCol, roomCol)) { return }
    
    //
    
    if (MAP[3][roomCol] == ".") { return tryThisMove(1, pawnCol, 3, roomCol) } // bottom room
    
    return tryThisMove(1, pawnCol, 2, roomCol) // top room
}

///////////////////////////////////////////////////////////

function tryLeaveTopRoom(pawnCol) {

   const pawn = MAP[2][pawnCol] 

    if (pawn == ".") { return }
    
    const roomCol = roomColFor[pawn]
    
    if (pawnCol == roomCol  &&  MAP[3][roomCol] == pawn) { return } // already in place
    
    tryLeaveRoom(pawn, 2, pawnCol)
}

function tryLeaveBottomRoom(pawnCol) {

   const pawn = MAP[3][pawnCol] 

    if (pawn == ".") { return }
    
    if (MAP[2][pawnCol] != ".") { return } // room is blocked
    
    const roomCol = roomColFor[pawn]
    
    if (pawnCol == roomCol) { return } // already in place
    
    tryLeaveRoom(pawn, 3, pawnCol)
}

///////////////////////////////////////////////////////////

function tryLeaveRoom(pawn, pawnRow, pawnCol) {

    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 2)
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 4)
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 6)
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 8)
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 10)

    return // *WARNING*: REMOVE THIS LINE IF YOU ARE GETTING A WRONG RESULT!!

    if (pawn == "C") { return } // *WARNING*: REMOVE THIS LINE IF YOU ARE GETTING A WRONG RESULT!!

    if (pawn == "D") { return } 
        
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 1)
    tryLeaveRoomThis(pawn, pawnRow, pawnCol, 11)
}

function tryLeaveRoomThis(pawn, pawnRow, pawnCol, hallCol) {
    
    if (pawn == "D"  &&  hallCol < pawnCol) { // pawn "D" is going left
        
        if (hallCol < 8) { return } // 8 means roomColFor["D"] - 1
    }

    if (MAP[1][hallCol] != ".") { return }

    if (hallIsBlocked(pawnCol, hallCol)) { return }

    tryThisMove(pawnRow, pawnCol, 1, hallCol)
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function hallIsBlocked(colA, colB) { 

    // doesn't check the end points:
    // pawn is over one of them,
    // the other was already checked

    let a = colA
    let b = colB
    
    if (b < a) { a = colB; b = colA }
    
    for (const col of hallCols) {
    
        if (col <= a) { continue }
        if (col >= b) { continue }
        
        if (MAP[1][col] != ".") { return true }
    }
    
    return false
}
 
function hasFinished() {

    if (MAP[2][3] != "A") { return false }
    if (MAP[2][5] != "B") { return false }
    if (MAP[2][7] != "C") { return false }
    if (MAP[2][9] != "D") { return false }
    
    if (MAP[3][3] != "A") { return false }
    if (MAP[3][5] != "B") { return false }
    if (MAP[3][7] != "C") { return false }
    if (MAP[3][9] != "D") { return false }

    return true
}
     
function tryThisMove(row1, col1, row2, col2) { 
    
    const pawn = MAP[row1][col1]
    
    const distance = Math.abs(row2 - row1) + Math.abs(col2 - col1)
    
    const cost = costOfCurrentMap + (distance * COST[pawn])
    
    if (cost > BEST_COST) { return false }
    
    //

    MAP[row1][col1] = "."
    MAP[row2][col2] = pawn
    
    const map = condenseMap()
    
    const done = hasFinished()
    
    MAP[row1][col1] = pawn
    MAP[row2][col2] = "."

    // 
    
    if (MEMORY[map] == undefined) { MEMORY[map] = Infinity } 
    
    if (cost >= MEMORY[map]) { return false }
    
    MEMORY[map] = cost    
    
    if (done) {
        
        if (cost < BEST_COST) { BEST_COST = cost }    
        return true
    }
    
    FUTURE.push(createMaze(map, cost))
    
    return true
}

///////////////////////////////////////////////////////////

function show(cost) {

    console.log("")
    
    for (const line of MAP) { console.log(line.join("")) }
    
    if (cost) { console.log("cost:", cost) }
}
    
///////////////////////////////////////////////////////////  
       
main()

