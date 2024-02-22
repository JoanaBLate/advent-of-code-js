"use strict"

// solving the puzzle takes (my computer) 0.240s

/*
    WARNING:
    
    this program expects the input  
    
        - having always the same entrance and exit
        - having 600 as the number of different maps (it is easy to change)
*/

const input = Deno.readTextFileSync("input.txt").trim()

const FREE = 0

const ROCK = 1

const BLIZZARD = 2

const NUMBER_OF_MAPS = 600 // TOTAL number of different maps // map 601 is map 0, map 602 is map 1...

const MAPS = [ ]  // one map for each minute

var HEIGHT = 0

var WIDTH = 0

var MEMORY = { }


function main() {

    const stringMap = processInput()
    
 // console.log(stringMap.join("\n"))
    
    createDynamicMaps()
    
    createBlizzards(stringMap)
    
    //                                                       //
    // while searching, doesn't step on the home/exit tiles! //
    //                                                       //
    
    // from entrance to exit:
    
    const minute1 = 1 + search(0, 1, 1, HEIGHT - 2, WIDTH - 2)
          
    // from exit back to entrance:
    
    MEMORY = { }
    
    const minute2 = 1 + search(minute1 + 1, HEIGHT - 2, WIDTH - 2, 1, 1)
           
    // from entrance to exit again:
    
    MEMORY = { }
    
    const minute3 = 1 + search(minute2 + 1, 1, 1, HEIGHT - 2, WIDTH - 2)
    
    //
    
    console.log("the answer is", minute3)
}

///////////////////////////////////////////////////////////

function processInput() {

    const stringMap = [ ]
        
    const lines = input.split("\n")
    
    for (const line of lines) { stringMap.push(line.trim()) }
    
    HEIGHT = stringMap.length
    WIDTH = stringMap[0].length
    
    return stringMap
}

///////////////////////////////////////////////////////////

function createDynamicMaps() {

    for (let n = 0; n < NUMBER_OF_MAPS; n++) { MAPS.push(createDynamicMap()) }
}

function createDynamicMap() {

    const map = [ ]
    
    for (let row = 0; row < HEIGHT; row++) { map.push(new Uint8Array(WIDTH)) }
    
    for (let row = 0; row < HEIGHT; row++) {
    
        map[row][0] = ROCK
    
        map[row][WIDTH - 1] = ROCK    
    }  
        
    for (let col = 0; col < WIDTH; col++) { 
    
        map[0][col] = ROCK
    
        map[HEIGHT - 1][col] = ROCK 
    }
    
    return map
}

///////////////////////////////////////////////////////////

function createBlizzards(stringMap) {

    for (let row = 1; row < HEIGHT - 1; row++) {
    
        for (let col = 1; col < WIDTH - 1; col++) {

            const symbol = stringMap[row][col]
            
            if (symbol == "v") { createBlizzardFromNorth(row, col); continue }
            
            if (symbol == "^") { createBlizzardFromSouth(row, col); continue }
            
            if (symbol == ">") { createBlizzardFromWest(row, col); continue }
            
            if (symbol == "<") { createBlizzardFromEast(row, col); continue }
        }
    }
}

function createBlizzardFromNorth(row, col) {

    for (let n = 0; n < NUMBER_OF_MAPS; n++) {
    
        const map = MAPS[n]
        
        map[row][col] = BLIZZARD
        
        row += 1
        
        if (row == HEIGHT - 1) { row = 1 }
    }
}

function createBlizzardFromSouth(row, col) {

    for (let n = 0; n < NUMBER_OF_MAPS; n++) {
    
        const map = MAPS[n]
        
        map[row][col] = BLIZZARD
        
        row -= 1
        
        if (row == 0) { row = HEIGHT - 2 }
    }
}

function createBlizzardFromWest(row, col) {

    for (let n = 0; n < NUMBER_OF_MAPS; n++) {
    
        const map = MAPS[n]
        
        map[row][col] = BLIZZARD
        
        col += 1
        
        if (col == WIDTH - 1) { col = 1 }
    }
}

function createBlizzardFromEast(row, col) {

    for (let n = 0; n < NUMBER_OF_MAPS; n++) {
    
        const map = MAPS[n]
        
        map[row][col] = BLIZZARD
        
        col -= 1
        
        if (col == 0) { col = WIDTH - 2 }
    }
}

///////////////////////////////////////////////////////////

function search(minute, startingRow, startingCol, targetRow, targetCol) {

    let futureSpots = [ createPoint(startingRow, startingCol) ]
    
    while (true) {
    
        minute += 1
        
        const currentSpots = futureSpots

        futureSpots = [ ]
        
        for (const spot of currentSpots) {
        
            const row = spot.row
            const col = spot.col
            
            if (row == targetRow  &&  col == targetCol) { return minute }
            
            //
    
            const indexOfNextMap = (minute + 1) % NUMBER_OF_MAPS

            const nextMap = MAPS[indexOfNextMap] 

            if (nextMap[row][col] == FREE) { maybeGrab(row, col) }
                
            if (nextMap[row - 1][col] == FREE) { maybeGrab(row - 1, col) }
                
            if (nextMap[row + 1][col] == FREE) { maybeGrab(row + 1, col) }

            if (nextMap[row][col - 1] == FREE) { maybeGrab(row, col - 1) }

            if (nextMap[row][col + 1] == FREE) { maybeGrab(row, col + 1) }
        }
    }
    
    function maybeGrab(row, col) {   
        
        if (MEMORY[minute] == undefined) { MEMORY[minute] = { } }
        
        const subMemory = MEMORY[minute]
        
        const subKey = row + "~" + col 
        
        if (subMemory[subKey]) { return }

        subMemory[subKey] = true
    
        futureSpots.push(createPoint(row, col))
    }
}    
            
///////////////////////////////////////////////////////////

function createPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function show(src, heroRow, heroCol) {

    const map = [ ]
    
    for (const srcLine of src) {
    
        const line = [ ]
        
        map.push(line)
    
        for (const item of srcLine) { line.push(".#@ "[item]) }
    }
    
    if (heroCol != undefined) { map[heroRow][heroCol] = "H" }

    console.log("")
    
    for (const line of map) { console.log(line.join("")) }
}

///////////////////////////////////////////////////////////

main()

