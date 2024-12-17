"use strict"

// solving the puzzle takes (my computer) 0.460s

// virgin data //

const BOARD = [ ]

const CREATURES = [ ]

var ELVES = 0

var GOBLINS = 0

const UNREACHABLE = 999999

var rowLength = 0

// current data //

var board = [ ]

var creatures = [ ]

var numberOfElves = 0

var numberOfGoblins = 0

var damageByElf = 3

var round = 0

var lastActionKilledSomeone = false


function main() {

    processInput()
    
 // show("overture")
    
    rowLength = BOARD[0].length
    
    fillCreatures()
    
    while (true) {
    
        damageByElf += 1
        
        resetCurrentData()
        
        fight()
        
        if (numberOfElves == ELVES) { break }
    }

 // show("done")

    let life = 0
    for (const creature of creatures) { 
    
        if (creature.life > 0) { life += creature.life }
    }

    const fullRounds = round - (lastActionKilledSomeone ? 0 : 1)
    
    console.log("the answer is", fullRounds * life, " (" + fullRounds, "full rounds and remaining " + life,  "HPs)")
}

function resetCurrentData() {

    board = cloneObject(BOARD)

    creatures = cloneObject(CREATURES)

    numberOfElves = ELVES

    numberOfGoblins = GOBLINS

    round = 0

    lastActionKilledSomeone = false
}

function fight() {
        
    while (true) {
    
        round += 1
           
        sortCreatures()
    
        for (const creature of creatures) { runCreature(creature)  }
                
        if (numberOfElves == 0) { break }
        if (numberOfGoblins == 0) { break }
    }
}

///////////////////////////////////////////////////////////

function processInput() {

    const text = Deno.readTextFileSync("input.txt").trim()
           
    const lines = text.split("\n")
    
    for (const line of lines) { 
    
        const row = line.trim().split("")
        
        BOARD.push(row)
    }
}

function fillCreatures() {
    
    for (let row = 0; row < BOARD.length; row++) {
    
        for (let col = 0; col < rowLength; col++) {

            const char = BOARD[row][col]
            
            if (char == "E") { makeCreature(char, row, col) }
            if (char == "G") { makeCreature(char, row, col) }
        }
    }
}

function makeCreature(race, row, col) {

    const creature = { "race": race, "life": 200, "row": row, "col": col }

    if (creature.race == "E") { ELVES += 1 } else { GOBLINS += 1 }

    CREATURES.push(creature)
}

///////////////////////////////////////////////////////////

function sortCreatures() { 

    let index = -1
    
    while (true) {
    
        index += 1
        
        const current = creatures[index]
        const next = creatures[index + 1]
        
        if (next == undefined) { return  }
    
        if (current.row < next.row) { continue }
        
        if (current.row > next.row) {

            creatures[index] = next
            creatures[index + 1] = current
            
            index = -1; continue
        }
        
        // current.row == next.row
        
        if (current.col > next.col) { 
        
            creatures[index] = next
            creatures[index + 1] = current
            
            index = -1; continue
        }
    }
}

///////////////////////////////////////////////////////////

function runCreature(creature) {

    if (creature.life <= 0) { return }
    
    lastActionKilledSomeone = false
    
    const enemyRace = (creature.race == "E") ? "G" : "E"
    
    const success = tryAttack(creature, enemyRace)
    
    if (success) { return }
    
    tryMove(creature, enemyRace)
    
    tryAttack(creature, enemyRace)
}

///////////////////////////////////////////////////////////

function tryAttack(creature, enemyRace) {

    const row = creature.row
    const col = creature.col
        
    let weakest = null
    
    const spots = [ newPoint(row-1, col), newPoint(row, col-1), newPoint(row, col+1), newPoint(row+1, col) ] // n, w, e, s
    
    for (const spot of spots) {
        
        const enemy = enemyAt(spot.row, spot.col, enemyRace)
        
        if (enemy == null) { continue }
        
        if (weakest == null) { weakest = enemy; continue }
        
        if (enemy.life < weakest.life) { weakest = enemy }
    }
        
    if (weakest == null) { return false }
    
    const enemy = weakest
    
    const damage = enemyRace == "G" ? damageByElf : 3
    
    enemy.life -= damage
    
    if (enemy.life <= 0) { 
    
        lastActionKilledSomeone = true
        
        board[enemy.row][enemy.col] = "."
        
        if (enemyRace == "E") { numberOfElves -= 1 } else { numberOfGoblins -= 1 }   
    }
    
    return true
}

function enemyAt(row, col, enemyRace) {

    // all board edge points are walls: 
    // from a valid position, 
    // any step is granted to be inside the board

    if (board[row][col] != enemyRace) { return  null }
    
    for (const creature of creatures) {
    
        if (creature.row != row) { continue }
        if (creature.col != col) { continue }
        
        if (creature.life <= 0)  { continue } // dead creature in the same spot of target!        

        return creature
    }
}

///////////////////////////////////////////////////////////
    
function tryMove(creature, enemyRace) {

    const row = creature.row
    const col = creature.col

    // all board edge points are walls: 
    // from a valid position, 
    // any step is granted to be inside the board
    
    let best = null
    
    const steps = [ newPoint(row-1, col), newPoint(row, col-1), newPoint(row, col+1), newPoint(row+1, col) ] // n, w, e, s
    
    for (const step of steps) {
    
        if (board[step.row][step.col] != ".") { continue }
    
        const walkObj = walk(step.row, step.col, enemyRace)
        
        if (walkObj.targetRow == UNREACHABLE) { continue }
        
        if (best == null) { best = walkObj; continue }
        
        if (walkObj.distance > best.distance) { continue } // necessary
        
        if (walkObj.distance < best.distance) { best = walkObj; continue }
        
        // walkObj.distance == best.distance
        
        if (walkObj.targetRow > best.targetRow) { continue } // necessary
        
        if (walkObj.targetRow < best.targetRow) { best = walkObj; continue }
        
        // walkObj.distance == best.distance  &&  // walkObj.targetRow == best.targetRow
        
        if (walkObj.targetCol < best.targetCol) { best = walkObj }
    }
    
    if (best == null) { return }
    
    board[row][col] = "."
    
    creature.row = best.homeRow
    creature.col = best.homeCol

    board[creature.row][creature.col] = creature.race
}

///////////////////////////////////////////////////////////

function walk(homeRow, homeCol, target) {

    let futurePoints = [ newPoint(homeRow, homeCol) ]
    
    let distance = 0
    
    const reservedTable = createReservedTable()
    
    reservedTable[homeRow][homeCol] = 1
    
    let targetRow = UNREACHABLE
    let targetCol = UNREACHABLE
    
    while (true) {
        
        if (targetRow != UNREACHABLE) { break } // one or more targets found

        const currentPoints = futurePoints
        
        if (currentPoints.length == 0) { break } // nowhere to go
        
        futurePoints = [ ]
    
        distance += 1
        
        for (const point of currentPoints) {
        
            const row = point.row
            const col = point.col
        
            if (board[row][col] != target) { 
                
                tryWalk(row-1, col)
                tryWalk(row+1, col)
                tryWalk(row, col-1)
                tryWalk(row, col+1)        
                continue
            }
            // found a target
            if (row < targetRow) { targetRow = row; targetCol = col; break }
            
            if (row == targetRow  &&  col < targetCol) { targetCol = col; break }            
        }        
    }
        
    return { "homeRow": homeRow, "homeCol": homeCol, "distance": distance, "targetRow": targetRow, "targetCol": targetCol } 
    
    function tryWalk(row, col) {
    
        if (reservedTable[row][col] != 0) { return }
        
        const char = board[row][col]
        
        if (char != "."  &&  char != target) { return }
        
        reservedTable[row][col] = 1
        
        futurePoints.push(newPoint(row, col))
    }
}

function createReservedTable() {

    const table = [ ]

    for (let n = 0; n < board.length; n++) { table.push(new Uint8Array(rowLength)) }
    
    return table
}

function newPoint(row, col) {

    return { "row": row, "col": col }
}

///////////////////////////////////////////////////////////

function cloneObject(source) {

    return JSON.parse(JSON.stringify(source))
}

function show(round) {

    if (round != undefined) { console.log("\nround:", round) }

    let s = ""
    
    for (let n = 0; n < rowLength; n++) { s += (n % 10) + " " }
    
    console.log(s)

    let n = 0
    
    for (const row of board) { console.log(row.join(" ") + " " + n); n += 1 }    
    
    s = ""
    
    for (let n = 0; n < rowLength; n++) { s += (n % 10) + " " }

    console.log(s)
}

main()

