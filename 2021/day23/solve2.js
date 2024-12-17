"use strict"

// solving the puzzle takes (my computer) 0.520s

/*
  notes:

    hallway positions over the rooms are despised
    
    map coordinates:
    
    -------------
    -01.2.3.4.56-
    ---7-8-9-a---
    ---b-c-d-e---
    ---f-g-h-i---
    ---j-k-l-m---
    -------------

    (hexadecimal+ style)
    (valid positions only)
    
    map state "cd30hfae2mljik56" means:
    
    A    is at c
    A'   is at d
    A''  is at 3
    A''' is at 0
    B    is at h
    B'   is at f
    etc.
*/

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

const SPOTS = [ ]

const COORDS = "0123456789abcdefghijklm"

const COST = { "A": 1, "B": 10, "C": 100, "D": 1000 }

const hallCols = [ 1, 2, 4, 6, 8, 10, 11 ]

const roomColFor = { "A": 3, "B": 5, "C": 7, "D": 9 }

// status of each room tower
const MESSED = 0
const FINISHED = 1
const HUNGRY2 = 2
const HUNGRY3 = 3
const HUNGRY4 = 4
const HUNGRY5 = 5

const TOWER = { } 

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
    
    const line4 = MAP.pop()
    const line3 = MAP.pop()
    
    MAP.push("  #D#C#B#A#  ".split(""))
    MAP.push("  #D#B#A#C#  ".split(""))
    MAP.push(line3)
    MAP.push(line4)
}

///////////////////////////////////////////////////////////

function fillSpots() {

    const coords = [ // made by hand for skipping some positions in the hall
    
        1,1, 1,2,  1,4,  1,6,  1,8,  1,10, 1,11, // top row 
        //       A     B     C     D
                2,3,  2,5,  2,7,  2,9,           // bottom row 1
                3,3,  3,5,  3,7,  3,9,           // bottom row 2
                4,3,  4,5,  4,7,  4,9,           // bottom row 3
                5,3,  5,5,  5,7,  5,9            // bottom row 4
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

    const result = [ "","","","",  "","","","",  "","","","",  "","","","" ]

    const baseIndex = { "A": 0, "B": 4, "C": 8, "D": 12 }
    
    for (let n = 0; n < 23; n++) {
    
        const point = SPOTS[n]
        
        let pawn = MAP[point.row][point.col]
        
        if (pawn == ".") { continue }
        
        const coord = COORDS[n]

        const index = baseIndex[pawn]
        
        if (result[index] == "")     { result[index]     = coord; continue }
        if (result[index + 1] == "") { result[index + 1] = coord; continue }
        if (result[index + 2] == "") { result[index + 2] = coord; continue }
        if (result[index + 3] == "") { result[index + 3] = coord; continue }
    }
    
    return result.join("")
}

function resetMap(string) {

    for (const point of SPOTS) { MAP[point.row][point.col] = "." }
    
    for (let n = 0; n < 16; n++) {
    
        const pawn = "AAAABBBBCCCCDDDD"[n]
        
        const coord = string[n]
     
        const index = parseInt(coord, 24)
        
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
    
    TOWER["A"] = calcTowerStatus("A", 3)
    TOWER["B"] = calcTowerStatus("B", 5)
    TOWER["C"] = calcTowerStatus("C", 7)
    TOWER["D"] = calcTowerStatus("D", 9)
    
    let success = false
    
    if (tryLeaveHall(1))  { success = true }
    if (tryLeaveHall(2))  { success = true }
    if (tryLeaveHall(4))  { success = true }
    if (tryLeaveHall(6))  { success = true }
    if (tryLeaveHall(8))  { success = true }
    if (tryLeaveHall(10)) { success = true }
    if (tryLeaveHall(11)) { success = true }
    
    if (success) { return } // not going to hall when a room can be fixed
    
    tryLeaveTower("A")
    tryLeaveTower("B")
    tryLeaveTower("C")
    tryLeaveTower("D")
}

///////////////////////////////////////////////////////////

function tryLeaveHall(pawnCol) {
    
    const pawn = MAP[1][pawnCol] 

    if (pawn == ".") { return }
    
    const tower = TOWER[pawn]
    
    if (tower == MESSED) { return } // FINISHED is impossible: a member is on the hall
    
    const roomCol = roomColFor[pawn]
    
    if (hallIsBlocked(pawnCol, roomCol)) { return }
    
    // go deep as possible
    
    if (tower == HUNGRY5) { return tryThisMove(1, pawnCol, 5, roomCol) }
    
    if (tower == HUNGRY4) { return tryThisMove(1, pawnCol, 4, roomCol) }
    
    if (tower == HUNGRY3) { return tryThisMove(1, pawnCol, 3, roomCol) }
    
    return tryThisMove(1, pawnCol, 2, roomCol) 
}

///////////////////////////////////////////////////////////

function tryLeaveTower(banner) {

    if (TOWER[banner] != MESSED) { return }

    const roomCol = roomColFor[banner]

    if (MAP[2][roomCol] != ".") { tryLeaveRoom(2, roomCol); return }
    if (MAP[3][roomCol] != ".") { tryLeaveRoom(3, roomCol); return }
    if (MAP[4][roomCol] != ".") { tryLeaveRoom(4, roomCol); return }
    if (MAP[5][roomCol] != ".") { tryLeaveRoom(5, roomCol); return }
}

function tryLeaveRoom(pawnRow, pawnCol) {

    tryLeaveRoomThis(pawnRow, pawnCol, 1)
    tryLeaveRoomThis(pawnRow, pawnCol, 2)
    tryLeaveRoomThis(pawnRow, pawnCol, 4)
    tryLeaveRoomThis(pawnRow, pawnCol, 6)
    tryLeaveRoomThis(pawnRow, pawnCol, 8)
    tryLeaveRoomThis(pawnRow, pawnCol, 10)
    tryLeaveRoomThis(pawnRow, pawnCol, 11)
}

function tryLeaveRoomThis(pawnRow, pawnCol, hallCol) {

    if (MAP[1][hallCol] != ".") { return }

    if (hallIsBlocked(pawnCol, hallCol)) { return }

    tryThisMove(pawnRow, pawnCol, 1, hallCol)
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function calcTowerStatus(banner, col) {

    if (MAP[5][col] == ".") { return HUNGRY5 }
    if (MAP[5][col] != banner) { return MESSED }
    
    if (MAP[4][col] == ".") { return HUNGRY4 }
    if (MAP[4][col] != banner) { return MESSED }
    
    if (MAP[3][col] == ".") { return HUNGRY3 }
    if (MAP[3][col] != banner) { return MESSED }
    
    if (MAP[2][col] == ".") { return HUNGRY2 }
    if (MAP[2][col] != banner) { return MESSED }
    
    return FINISHED
}

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
    
    if (MAP[4][3] != "A") { return false }
    if (MAP[4][5] != "B") { return false }
    if (MAP[4][7] != "C") { return false }
    if (MAP[4][9] != "D") { return false }
    
    if (MAP[5][3] != "A") { return false }
    if (MAP[5][5] != "B") { return false }
    if (MAP[5][7] != "C") { return false }
    if (MAP[5][9] != "D") { return false }

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

