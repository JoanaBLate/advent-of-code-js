"use strict"

// solving the puzzle takes (my computer) 0.064s

const input = Deno.readTextFileSync("input.txt").trim()

const EMPTY = 0

const FALLING = 1

const STATIC = 2

const WIDTH = 7

const CHAMBER = new Uint8Array(WIDTH * 1000 * 1000)

var lastRock = "E"

var JETS = ""

var jetIndex = -1

var jetMax = 0

var staticTop = 0

var fallingBottom = 0

var rockHeight = 0

var playedRounds = 0


function main() {

    processInput()
    
    const roundsPerCycle = findRepeatingPattern()

    //
    
    const top = staticTop
    
    for (let n = 0; n < roundsPerCycle; n++) { playRound() }
    
    const deltaStaticTop = staticTop - top
    
    //    
    const trillion = 1000 * 1000 * 1000 * 1000
    
    const missingRounds = trillion - playedRounds
    
    const fullCycles = Math.floor(missingRounds / roundsPerCycle)
    
    const marginCycles = missingRounds - (fullCycles * roundsPerCycle)
    
    //
    
    for (let n = 0; n < marginCycles; n++) { playRound() }
    
    const result = staticTop + (fullCycles * deltaStaticTop)
        
    console.log("the answer is", result)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    JETS = input
    
    jetMax = JETS.length - 1
}

///////////////////////////////////////////////////////////
//                 create rock                           //
///////////////////////////////////////////////////////////

function createRock() {

    if (lastRock == "E") { createRockA(); return }
    if (lastRock == "A") { createRockB(); return }
    if (lastRock == "B") { createRockC(); return }
    if (lastRock == "C") { createRockD(); return }
    
    createRockE()
}

function createRockA() {

    lastRock = "A"

    rockHeight = 1
    
    fallingBottom = staticTop + 3

    let index = fallingBottom * WIDTH     
    CHAMBER[index + 2] = FALLING
    CHAMBER[index + 3] = FALLING
    CHAMBER[index + 4] = FALLING
    CHAMBER[index + 5] = FALLING
}

function createRockB() {

    lastRock = "B"

    rockHeight = 3
    
    fallingBottom = staticTop + 3
    
    let index = fallingBottom * WIDTH    
    CHAMBER[index + 3] = FALLING
    
    index += WIDTH    
    CHAMBER[index + 2] = FALLING
    CHAMBER[index + 3] = FALLING
    CHAMBER[index + 4] = FALLING
    
    index += WIDTH    
    CHAMBER[index + 3] = FALLING
}

function createRockC() {

    lastRock = "C"

    rockHeight = 3
    
    fallingBottom = staticTop + 3
    
    let index = fallingBottom * WIDTH  
    CHAMBER[index + 2] = FALLING
    CHAMBER[index + 3] = FALLING 
    CHAMBER[index + 4] = FALLING
    
    index += WIDTH    
    CHAMBER[index + 4] = FALLING
    
    index += WIDTH    
    CHAMBER[index + 4] = FALLING    
}

function createRockD() {

    lastRock = "D"

    rockHeight = 4
    
    fallingBottom = staticTop + 3
    
    let index = fallingBottom * WIDTH    
    CHAMBER[index + 2] = FALLING
 
    index += WIDTH
    CHAMBER[index + 2] = FALLING
  
    index += WIDTH
    CHAMBER[index + 2] = FALLING

    index += WIDTH
    CHAMBER[index + 2] = FALLING
}

function createRockE() {

    lastRock = "E"

    rockHeight = 2
    
    fallingBottom = staticTop + 3
    
    let index = fallingBottom * WIDTH    
    CHAMBER[index + 2] = FALLING 
    CHAMBER[index + 3] = FALLING
    
    index += WIDTH    
    CHAMBER[index + 2] = FALLING    
    CHAMBER[index + 3] = FALLING
}

///////////////////////////////////////////////////////////
//                 move rock                             //
///////////////////////////////////////////////////////////

function moveRight() {

    if (! mayMoveRight()) { return }

    moveRightRow(fallingBottom)

    if (rockHeight == 1) { return }
    
    moveRightRow(fallingBottom + 1)

    if (rockHeight == 2) { return }
    
    moveRightRow(fallingBottom + 2)

    if (rockHeight == 3) { return }
    
    moveRightRow(fallingBottom + 3)
}

function moveRightRow(row) {

    const first = row * WIDTH
    
    if (CHAMBER[first + 5] == FALLING) { CHAMBER[first + 5] = EMPTY; CHAMBER[first + 6] = FALLING }
    if (CHAMBER[first + 4] == FALLING) { CHAMBER[first + 4] = EMPTY; CHAMBER[first + 5] = FALLING }
    if (CHAMBER[first + 3] == FALLING) { CHAMBER[first + 3] = EMPTY; CHAMBER[first + 4] = FALLING }
    if (CHAMBER[first + 2] == FALLING) { CHAMBER[first + 2] = EMPTY; CHAMBER[first + 3] = FALLING }
    if (CHAMBER[first + 1] == FALLING) { CHAMBER[first + 1] = EMPTY; CHAMBER[first + 2] = FALLING }
    if (CHAMBER[first]     == FALLING) { CHAMBER[first]     = EMPTY; CHAMBER[first + 1] = FALLING }
}

///////////////////////////////////////////////////////////

function mayMoveRight() {

    if (! mayMoveRightRow(fallingBottom))     { return false }

    if (rockHeight == 1) { return true }
    
    if (! mayMoveRightRow(fallingBottom + 1)) { return false }

    if (rockHeight == 2) { return true }
    
    if (! mayMoveRightRow(fallingBottom + 2)) { return false }

    if (rockHeight == 3) { return true }
    
    return mayMoveRightRow(fallingBottom + 3)
}

function mayMoveRightRow(row) {

    const first = row * WIDTH
        
    if (CHAMBER[first + 6] == FALLING) { return false }    
    if (CHAMBER[first + 5] == FALLING) { return CHAMBER[first + 6] != STATIC }
    if (CHAMBER[first + 4] == FALLING) { return CHAMBER[first + 5] != STATIC }
    if (CHAMBER[first + 3] == FALLING) { return CHAMBER[first + 4] != STATIC }
    if (CHAMBER[first + 2] == FALLING) { return CHAMBER[first + 3] != STATIC }
    if (CHAMBER[first + 1] == FALLING) { return CHAMBER[first + 2] != STATIC }
    if (CHAMBER[first]     == FALLING) { return CHAMBER[first + 1] != STATIC }
}

///////////////////////////////////////////////////////////

function moveLeft() {

    if (! mayMoveLeft()) { return }

    moveLeftRow(fallingBottom)

    if (rockHeight == 1) { return }
    
    moveLeftRow(fallingBottom + 1)

    if (rockHeight == 2) { return }
    
    moveLeftRow(fallingBottom + 2)

    if (rockHeight == 3) { return }
    
    moveLeftRow(fallingBottom + 3)
}

function moveLeftRow(row) {

    const first = row * WIDTH 
    
    if (CHAMBER[first + 1] == FALLING) { CHAMBER[first + 1] = EMPTY; CHAMBER[first] = FALLING }
    if (CHAMBER[first + 2] == FALLING) { CHAMBER[first + 2] = EMPTY; CHAMBER[first + 1] = FALLING }
    if (CHAMBER[first + 3] == FALLING) { CHAMBER[first + 3] = EMPTY; CHAMBER[first + 2] = FALLING }
    if (CHAMBER[first + 4] == FALLING) { CHAMBER[first + 4] = EMPTY; CHAMBER[first + 3] = FALLING }
    if (CHAMBER[first + 5] == FALLING) { CHAMBER[first + 5] = EMPTY; CHAMBER[first + 4] = FALLING }
    if (CHAMBER[first + 6] == FALLING) { CHAMBER[first + 6] = EMPTY; CHAMBER[first + 5] = FALLING }
}

///////////////////////////////////////////////////////////

function mayMoveLeft() {

    if (! mayMoveLeftRow(fallingBottom))     { return false }

    if (rockHeight == 1) { return true }
    
    if (! mayMoveLeftRow(fallingBottom + 1)) { return false }

    if (rockHeight == 2) { return true }
    
    if (! mayMoveLeftRow(fallingBottom + 2)) { return false }

    if (rockHeight == 3) { return true }
    
    return mayMoveLeftRow(fallingBottom + 3)
}

function mayMoveLeftRow(row) {

    const first = row * WIDTH
    
    if (CHAMBER[first] == FALLING) { return false }
    
    if (CHAMBER[first + 1] == FALLING) { return CHAMBER[first]     == EMPTY }
    if (CHAMBER[first + 2] == FALLING) { return CHAMBER[first + 1] == EMPTY }
    if (CHAMBER[first + 3] == FALLING) { return CHAMBER[first + 2] == EMPTY }
    if (CHAMBER[first + 4] == FALLING) { return CHAMBER[first + 3] == EMPTY }
    if (CHAMBER[first + 5] == FALLING) { return CHAMBER[first + 4] == EMPTY }
    if (CHAMBER[first + 6] == FALLING) { return CHAMBER[first + 5] == EMPTY }
}

///////////////////////////////////////////////////////////

function moveDown() {

    if (! mayMoveDown()) { return false }

    moveDownRow(fallingBottom)

    if (rockHeight == 1) { fallingBottom -= 1; return true }
    
    moveDownRow(fallingBottom + 1)

    if (rockHeight == 2) { fallingBottom -= 1; return true }
    
    moveDownRow(fallingBottom + 2)

    if (rockHeight == 3) { fallingBottom -= 1; return true }
    
    moveDownRow(fallingBottom + 3)
    
    fallingBottom -= 1; return true
}

function moveDownRow(row) {

    const over = row * WIDTH

    const under = (row - 1) * WIDTH
    
    if (CHAMBER[over] == FALLING) { CHAMBER[over] = EMPTY; CHAMBER[under] = FALLING }
    if (CHAMBER[over + 1] == FALLING) { CHAMBER[over + 1] = EMPTY; CHAMBER[under + 1] = FALLING }
    if (CHAMBER[over + 2] == FALLING) { CHAMBER[over + 2] = EMPTY; CHAMBER[under + 2] = FALLING }
    if (CHAMBER[over + 3] == FALLING) { CHAMBER[over + 3] = EMPTY; CHAMBER[under + 3] = FALLING }
    if (CHAMBER[over + 4] == FALLING) { CHAMBER[over + 4] = EMPTY; CHAMBER[under + 4] = FALLING }
    if (CHAMBER[over + 5] == FALLING) { CHAMBER[over + 5] = EMPTY; CHAMBER[under + 5] = FALLING }
    if (CHAMBER[over + 6] == FALLING) { CHAMBER[over + 6] = EMPTY; CHAMBER[under + 6] = FALLING }    
}

///////////////////////////////////////////////////////////

function mayMoveDown() {

    if (fallingBottom == 0) { return false }

    if (! mayMoveDownRow(fallingBottom))     { return false }

    if (rockHeight == 1) { return true }
    
    if (! mayMoveDownRow(fallingBottom + 1)) { return false }

    if (rockHeight == 2) { return true }
    
    if (! mayMoveDownRow(fallingBottom + 2)) { return false }

    if (rockHeight == 3) { return true }
    
    return mayMoveDownRow(fallingBottom + 3)
}

function mayMoveDownRow(row) {

    const over = row * WIDTH

    const under = (row - 1) * WIDTH
    
    if (CHAMBER[over] == FALLING  &&  CHAMBER[under] == STATIC) { return false }
    if (CHAMBER[over + 1] == FALLING  &&  CHAMBER[under + 1] == STATIC) { return false }
    if (CHAMBER[over + 2] == FALLING  &&  CHAMBER[under + 2] == STATIC) { return false }
    if (CHAMBER[over + 3] == FALLING  &&  CHAMBER[under + 3] == STATIC) { return false }
    if (CHAMBER[over + 4] == FALLING  &&  CHAMBER[under + 4] == STATIC) { return false }
    if (CHAMBER[over + 5] == FALLING  &&  CHAMBER[under + 5] == STATIC) { return false }
    if (CHAMBER[over + 6] == FALLING  &&  CHAMBER[under + 6] == STATIC) { return false }
    
    return true
}

///////////////////////////////////////////////////////////
//                   play round                          //
///////////////////////////////////////////////////////////

function playRound() {

    playedRounds += 1

    createRock()
    
    while (true) {
    
        if (getJet() == "<") { moveLeft() } else { moveRight() }
        
        if (! moveDown()) { break }
    }
    
    freeze()
}

function getJet() {

    jetIndex += 1
    
    if (jetIndex > jetMax) { jetIndex = 0 }
    
    return JETS[jetIndex]
}

///////////////////////////////////////////////////////////

function freeze() {

    staticTop = Math.max(staticTop, fallingBottom + rockHeight)

    freezeRow(fallingBottom)

    if (rockHeight == 1) { return }
    
    freezeRow(fallingBottom + 1)

    if (rockHeight == 2) { return }
    
    freezeRow(fallingBottom + 2)

    if (rockHeight == 3) { return }
    
    freezeRow(fallingBottom + 3)
    
    return true
}

function freezeRow(row) {

    const first = row * WIDTH
    
    if (CHAMBER[first] == FALLING) { CHAMBER[first] = STATIC }
    if (CHAMBER[first + 1] == FALLING) { CHAMBER[first + 1] = STATIC }
    if (CHAMBER[first + 2] == FALLING) { CHAMBER[first + 2] = STATIC }
    if (CHAMBER[first + 3] == FALLING) { CHAMBER[first + 3] = STATIC }
    if (CHAMBER[first + 4] == FALLING) { CHAMBER[first + 4] = STATIC }
    if (CHAMBER[first + 5] == FALLING) { CHAMBER[first + 5] = STATIC }
    if (CHAMBER[first + 6] == FALLING) { CHAMBER[first + 6] = STATIC }
}

///////////////////////////////////////////////////////////
//                     deltas                            //
///////////////////////////////////////////////////////////

function createState() { // last rock and top 5 static rows

    const index = (staticTop - 5) * WIDTH
    
    return CHAMBER.slice(index, index + 35).join("") + lastRock
}

function findRepeatingPattern() {
    
    for (let n = 1; n <= 1000; n++) { playRound() } // warming and giving room for 'staticTop - 5'
    
    const targetState = createState()
    
    let lastMatchingRound = 1000
    
    const deltas = [ ]
    
    let n = 1000
    
    while (true) {
    
        n += 1
    
        playRound()
                
        const state = createState()
        
        if (state != targetState) { continue }
        
        deltas.push(n - lastMatchingRound)
        
        lastMatchingRound = n
        
        const pattern = findPatternInDeltas(deltas)
        
        if (pattern != 0) { return pattern }
    }
}

function findPatternInDeltas(deltas) {

    if (deltas.length < 6) { return 0 }
    
    const max = Math.floor(deltas.length / 3)
    
    for (let size = 1; size <= max; size++) {
    
        const segment = deltas.slice(0, size)
        
        const found = segmentOccursThreeTimes(deltas.slice(), segment) 
        
        if (! found) { continue }
        
        // console.log(segment)
                
        let pattern = 0
        
        for (const item of segment) { pattern += item }
            
        return pattern
    }    
    return 0
}    

function segmentOccursThreeTimes(deltas, segment) {

    for (let n = 0; n < 3; n++) {

        for (const item of segment) {
        
            if (item != deltas.shift()) { return false }    
        }
    }
    
    return true
}

///////////////////////////////////////////////////////////

function show(top) {

    top = top || 0
    
    const thick = 26
    
    if (top < thick) { top = thick }
    
    const bottom = top - thick

    console.log("") 
    
    for (let row = top; row >= bottom; row--) {

        let s = "  |"
        
        for (let col = 0; col < WIDTH; col++) { 

            const index = row * WIDTH + col
             
            if (CHAMBER[index] == EMPTY)   { s += "." }
            if (CHAMBER[index] == FALLING) { s += "@" }
            if (CHAMBER[index] == STATIC)  { s += "#" }
        }

        console.log(s + "|")
    }
    console.log("  " + "|".repeat(WIDTH + 2))
    
    console.log("from", bottom, "to", top) 
} 

main()

