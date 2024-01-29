"use strict"

// solving the puzzle takes (my computer) 0.030s

//                                                                     //
// *WARNING* not expecting input with negative X or positive Y values  //
//                                                                     //

const input = Deno.readTextFileSync("input.txt").trim()

var Xa = 0
var Xb = 0
var Ya = 0
var Yb = 0

const XSpeeds = [ ] 
const YSpeeds = [ ]


function main() {

    processInput()
    
    fillXSpeeds()    
    fillYSpeeds()
    
    console.log("the answer is", countValidCombinations())
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const parts = input.replace("target area: ", "").split(", ")
    
    const tokensX = parts.shift().substr(2).split("..")
    const tokensY = parts.shift().substr(2).split("..")
    
    Xa = parseInt(tokensX.shift())
    Xb = parseInt(tokensX.shift())
    Ya = parseInt(tokensY.shift())
    Yb = parseInt(tokensY.shift())
    
    if (Xa > Xb) { const temp = Xa; Xa = Xb; Xb = temp }
    if (Ya < Yb) { const temp = Ya; Ya = Yb; Yb = temp } // for negative values
}

///////////////////////////////////////////////////////////

function fillXSpeeds() {

    for (let speed = 1; speed <= Xb; speed++) { tryXSpeed(speed) }
}

function tryXSpeed(speedAtStart) {

    let speed = speedAtStart
    
    let x = 0

    while (true) {
    
        x += speed
        
        if (x < Xa) { 
        
            speed -= 1 
            
            if (speed == 0) { return } else { continue }
        }
        
        if (x <= Xb) { XSpeeds.push(speedAtStart) }
        
        return
    }
}

///////////////////////////////////////////////////////////

/*

GOING UPWARDS (example):

    level 0 speed 3  (standing)
    level 3 speed 2  (after step 1)
    level 5 speed 1  (after step 2)
    level 6 speed 0  (after step 3)
    level 6 speed -1 (after step 4)
    level 5 speed -2 (after step 5)
    level 3 speed -3 (after step 6)
    level 0 speed -4 (after step 7)

    1) always comes back to level zero
    2) speed at level zero: -(original_speed + 1)
    3) if speed at level zero is smaller than the bottom of the target area: 
       this speed fails
       all speeds greater than this will fail
*/

function fillYSpeeds() {

    // may exist a gap in the middle of the range of positive good speeds //

    const minSpeed = Yb // negative speed

    const maxSpeed = Math.abs(Yb)
    
    for (let speed = minSpeed; speed <= maxSpeed; speed++) { tryYSpeed(speed) }
}

function tryYSpeed(speedAtStart) {

    let speed = speedAtStart
    
    let y = 0

    while (true) {
    
        y += speed
        
        if (y > Ya) { speed -= 1 ; continue } // negative ys

        if (y >= Yb) { YSpeeds.push(speedAtStart) }
        
        return 
    }
}

///////////////////////////////////////////////////////////

function countValidCombinations() {

    let count = 0
    
    for (const speedX of XSpeeds) {
    
        for (const speedY of YSpeeds) { 
        
            if (gotMatch(speedX, speedY)) { count += 1 }
        }
    }
    
    return count
}
    
function gotMatch(speedX, speedY) {

    let x = 0
    let y = 0

    while (true) {

        x += speedX
        if (speedX > 0) { speedX -= 1 }
        
        y += speedY
        speedY -= 1 
        
        if (x < Xa) { continue }
        if (y > Ya) { continue }     // negative ys
        
        if (x > Xb) { return false }
        if (y < Yb) { return false } // negative ys

        return true
    }
}
 
main()

