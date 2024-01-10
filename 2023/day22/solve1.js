"use strict"

// solving the puzzle takes (my computer) 0.040s

const input = Deno.readTextFileSync("input.txt").trim()

const BRICKS = { }

const LEVELS = { }


function main() {

    const top = processInput()
    
    if (top == null) { return }
    
    for (let n = 1; n <= top; n++) { LEVELS[n] = [ ] }
    
    placeBricksOnLevels()
    
    settleBricks() 

    console.log("the answer is", countUnneededBricks())
}

///////////////////////////////////////////////////////////

function processInput() {

    let top = 0
    
    let id = 0
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        id += 1
    
        const groups = line.trim().split("~")
        
        const tokensA = groups.shift().split(",")
        
        const x1 = parseInt(tokensA.shift())
        const y1 = parseInt(tokensA.shift())
        const z1 = parseInt(tokensA.shift())
        
        const tokensB = groups.shift().split(",")
        
        const x2 = parseInt(tokensB.shift())
        const y2 = parseInt(tokensB.shift())
        const z2 = parseInt(tokensB.shift())
        
        if (x2 < x1  ||  y2 < y1  ||  z2  <  z1) { 
        
            console.log("ERROR: not expecting inverted coordinates"); return null 
        }
        
        const brick = { 
        
            "id": id, "x1": x1, "x2": x2, "y1": y1, "y2": y2, "z1": z1, "z2": z2, "holders": [ ], "mounteds": [ ] 
        }
        
        BRICKS[id] = brick
        
        if (z1 > top) { top = z1 }
        if (z2 > top) { top = z2 }          
    }
    return top
}

///////////////////////////////////////////////////////////

function placeBricksOnLevels() {

    for (const brick of Object.values(BRICKS)) { placeBrickOnLevels(brick) }
}

function placeBrickOnLevels(brick) {

    for (let n = brick.z1; n <= brick.z2; n++) {

        LEVELS[n].push(brick)
    }
}

function removeBrickFromLevels(brick) {

    for (let n = brick.z1; n <= brick.z2; n++) {

        const level = LEVELS[n]
        
        const index = level.indexOf(brick)
        
        level.splice(index, 1)
    }
}
       
///////////////////////////////////////////////////////////

function settleBricks() {

    let n = 1
    
    while (true) {

        n += 1
        
        const level = LEVELS[n]
        
        if (level == undefined) { return }
        
        const bricks = level.slice() // necessary!
        
        for (const brick of bricks) { settleBrick(brick, n) }
    }
}

function settleBrick(master, floor) {

    if (master.z1 != floor) { return } // floor does not match the bottom of the (tower) brick

    while (true) {
    
        floor -= 1
        
        const level = LEVELS[floor]
    
        if (level == undefined) { bringBrickDown(master, 1); return } // no holder found        
    
        for (const brick of level) {
        
            if (! bricksMatch(master, brick)) { continue }
            
            master.holders.push(brick.id)
            
            brick.mounteds.push(master.id)            
        }
    
        if (master.holders.length == 0) { continue }
        
        const newFloor = floor + 1
        
        if (master.z1 != newFloor) { bringBrickDown(master, newFloor) }
        
        return
    }
}

function bringBrickDown(brick, newFloor) {

    removeBrickFromLevels(brick)

    const delta = brick.z2 - brick.z1
    
    brick.z1 = newFloor
    
    brick.z2 = brick.z1 + delta

    placeBrickOnLevels(brick) 
}

function bricksMatch(a, b) {

    if (a.x1 > b.x2) { return false }
    if (a.x2 < b.x1) { return false }
    
    if (a.y1 > b.y2) { return false }
    if (a.y2 < b.y1) { return false }

    return true
}

///////////////////////////////////////////////////////////

function countUnneededBricks() {

    let count = 0
    
    for (const candidate of Object.values(BRICKS)) {
    
        if (! isNecessaryBrick(candidate)) { count += 1 }
    }    
    return count
}

function isNecessaryBrick(candidate) {

    for (const id of candidate.mounteds) {
    
        const mounted = BRICKS[id]
        
        if (mounted.holders.length == 1) { return true }    
    }
    return false
}

main()

