"use strict"

// solving the puzzle takes (my computer) 5.6s

/*
  notes:

    hallway positions over the rooms are despised
    
    D can not go left (excepting D on roomD1, just one step)
    
    columns:
    
    #############
    #12345678901#
    ###3#5#7#9###
    ###3#5#7#9###
*/

const input = Deno.readTextFileSync("input.txt").trim()

const MAP = [ ]

const COST = { "A": 1, "B": 10, "C": 100, "D": 1000 }

const hallCols = [ 1, 2, 4, 6, 8, 10, 11 ]

const roomColFor = { "A": 3, "B": 5, "C": 7, "D": 9 }

var FUTURE = [ ]

const MEMORY = { }

var BEST_COST = Infinity


function main() {

    processInput()
    
    show(MAP)
    
    search()
    
    console.log("\nthe answer is", BEST_COST)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    const width = lines[0].length
    
    for (const _line of lines) { 
    
        let line = _line.trim()
        
        if (line.length < width) { line = "##" + line + "##" }
        
        MAP.push(line.trim())
    }
}

///////////////////////////////////////////////////////////

function createMaze(map, cost) {

    return { "map": map, "cost": cost }
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function search() {

    FUTURE.push(createMaze(MAP, 0))
    
    while (FUTURE.length != 0) {
    
        console.log("queue length:", FUTURE.length)
    
        const mazes = FUTURE
        
        FUTURE = [ ]
        
        for (const maze of mazes) { searchThis(maze.map, maze.cost) }  
    }
}

function searchThis(map, cost) {

    tryHallSpot(map, 1, cost)
    tryHallSpot(map, 2, cost)
    tryHallSpot(map, 4, cost)
    tryHallSpot(map, 6, cost)
    tryHallSpot(map, 8, cost)
    tryHallSpot(map, 10, cost)
    tryHallSpot(map, 11, cost)

    tryTopRoom(map, 3, cost)
    tryTopRoom(map, 5, cost)
    tryTopRoom(map, 7, cost)
    tryTopRoom(map, 9, cost)

    tryBottomRoom(map, 3, cost)
    tryBottomRoom(map, 5, cost)
    tryBottomRoom(map, 7, cost)
    tryBottomRoom(map, 9, cost)
}

///////////////////////////////////////////////////////////

function tryHallSpot(map, heroCol, cost) {
    
    const hero = map[1][heroCol] 

    if (hero == ".") { return }
    
    const roomCol = roomColFor[hero]

    if (map[2][roomCol] != ".") { return }
    
    const bottom = map[3][roomCol]
    
    if (bottom != "."  &&  bottom != hero) { return }
    
    if (hallIsBlocked(map, heroCol, roomCol)) { return }
    
    tryThisMove(map, 1, heroCol, 2, roomCol, cost)
    
    if (map[3][roomCol] != ".") { return }
    
    tryThisMove(map, 1, heroCol, 3, roomCol, cost)
}

///////////////////////////////////////////////////////////

function tryTopRoom(map, heroCol, cost) {

   const hero = map[2][heroCol] 

    if (hero == ".") { return }
    
    const roomCol = roomColFor[hero]
    
    if (heroCol == roomCol  &&  map[3][roomCol] == hero) { return } // already in place
    
    leaveRoom(map, 2, heroCol, cost)
}

function tryBottomRoom(map, heroCol, cost) {

   const hero = map[3][heroCol] 

    if (hero == ".") { return }
    
    if (map[2][heroCol] != ".") { return } // room is blocked
    
    const roomCol = roomColFor[hero]
    
    if (heroCol == roomCol) { return } // already in place
    
    leaveRoom(map, 3, heroCol, cost)
}

///////////////////////////////////////////////////////////

function leaveRoom(map, heroRow, heroCol, cost) {

    leaveRoomThis(map, heroRow, heroCol, 1, cost)
    leaveRoomThis(map, heroRow, heroCol, 2, cost)
    leaveRoomThis(map, heroRow, heroCol, 4, cost)
    leaveRoomThis(map, heroRow, heroCol, 6, cost)
    leaveRoomThis(map, heroRow, heroCol, 8, cost)
    leaveRoomThis(map, heroRow, heroCol, 10, cost)
    leaveRoomThis(map, heroRow, heroCol, 11, cost)
}

function leaveRoomThis(map, heroRow, heroCol, hallCol, cost) {

    if (map[1][hallCol] != ".") { return }

    if (hallIsBlocked(map, heroCol, hallCol)) { return }

    tryThisMove(map, heroRow, heroCol, 1, hallCol, cost)
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

function getMapTop(map) {

    return map[1].substr(1, 11)
}

function getMapBottom(map) {

    return map[2].substr(3, 7) + map[3].substr(3, 7)
}

function hallIsBlocked(map, colA, colB) { 

    // doesn't chack the end points:
    // hero is over one of them,
    // the other was already checked

    let a = colA
    let b = colB
    
    if (b < a) { a = colB; b = colA }
    
    for (const col of hallCols) {
    
        if (col <= a) { continue }
        if (col >= b) { continue }
        
        if (map[1][col] != ".") { return true }
    }
    
    return false
}
 
function hasFinished(map) {

    if (map[2][3] != "A") { return false }
    if (map[2][5] != "B") { return false }
    if (map[2][7] != "C") { return false }
    if (map[2][9] != "D") { return false }
    
    if (map[3][3] != "A") { return false }
    if (map[3][5] != "B") { return false }
    if (map[3][7] != "C") { return false }
    if (map[3][9] != "D") { return false }

    return true
}
     
function tryThisMove(oldMap, row1, col1, row2, col2, cost) { 
    
    const hero = oldMap[row1][col1]
    
    const distance = Math.abs(row2 - row1) + Math.abs(col2 - col1)
    
    cost += distance * COST[hero]
    
    if (cost > BEST_COST) { return }
    
    //

    const newMap = oldMap.slice()
    
    const line1 = newMap[row1].split("")
    line1[col1] = "." 
    newMap[row1] = line1.join("")
    
    const line2 = newMap[row2].split("")
    line2[col2] = hero 
    newMap[row2] = line2.join("")
    
    //
    
    const key = getMapTop(newMap)
    
    const subKey = getMapBottom(newMap)
    
    if (MEMORY[key] == undefined) { MEMORY[key] = { } }
    
    const subMemory = MEMORY[key] 
    
    if (subMemory[subKey] == undefined) { subMemory[subKey] = Infinity } 
    
    if (cost >= subMemory[subKey]) { return }
    
    subMemory[subKey] = cost
    
    if (hasFinished(newMap)) {
        
        if (cost < BEST_COST) { BEST_COST = cost }    
        return
    }
    
    FUTURE.push(createMaze(newMap, cost))
}

///////////////////////////////////////////////////////////

function show(map, cost) {

    console.log("")
    
    for (const line of map) { console.log(line) }
    
    if (cost) { console.log("cost:", cost) }
}
    
///////////////////////////////////////////////////////////  
        
main()

