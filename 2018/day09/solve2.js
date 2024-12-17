"use strict"

// solving the puzzle takes (my computer) 0.150s

// circlePad and excedent length of the circle array
// are used for efficient rotation:
// V8 is very slow, even breaks, at manipulation of big lists

var circle = null // will start as [ 0 ] 

var circleLength = 1

var circlePad = 0

const players = [ ] // the points

var maxPlayer = 0

var currentPlayer = -1

var maxMarble = 0

var currentMarble = 0 // current marble position is always the first in the circle


function main() {

    processInput()
    
    circle = new Uint32Array(3 * maxMarble)
    
    circlePad = circle.length - maxMarble - 1000
    
    for (let n = 0; n <= maxPlayer; n++) { players.push(0) }
    
    while (true) {
    
        currentMarble += 1
        
        if (currentMarble > maxMarble) { break }
        
        currentPlayer += 1
        
        if (currentPlayer > maxPlayer) { currentPlayer = 0 }
    
        if (currentMarble % 23 == 0) { playSpecialMarble() } else { playStandardMarble() }
    }

    let greatest = 0
    
    for (const points of players) { if (points > greatest) { greatest = points } }
         
    console.log("the answer is", greatest)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const tokens = input.split(" ")

    maxPlayer = parseInt(tokens.shift()) - 1

    tokens.pop() // points

    maxMarble = 100 * parseInt(tokens.pop())
}

///////////////////////////////////////////////////////////

function playStandardMarble() {
        
    rotateRight(1)

    circlePushHead(currentMarble)
}

function playSpecialMarble() {

    rotateLeft(7)

    players[currentPlayer] += currentMarble + circlePopHead()

    rotateRight(1)
}

///////////////////////////////////////////////////////////

function rotateLeft(count) {

    while (count > 0) { count -= 1; rotateLeftOnce() }
}

function rotateLeftOnce() {

    if (circlePad > circle.length - 1000) { decreaseCirclePad() }
    
    const first = circle[circlePad + 0]

    const indexAfterLast = circlePad + circleLength 

    circle[indexAfterLast] = first
    
    circlePad += 1
}

///////////////////////////////////////////////////////////

function rotateRight(count) {

    while (count > 0) { count -= 1; rotateRightOnce() }
}

function rotateRightOnce() { 

    if (circlePad < 1000) { increaseCirclePad() }
    
    const indexOfLast = circlePad + circleLength - 1
    
    const last = circle[indexOfLast]
    
    circlePad -= 1

    circle[circlePad] = last
}

///////////////////////////////////////////////////////////

function circlePopHead() {

    const first = circle[circlePad]
    
    circlePad += 1

    circleLength -= 1
    
    return first
}

function circlePushHead(value) {

    if (circlePad < 1000) { increaseCirclePad() }

    circlePad -= 1

    circle[circlePad] = value

    circleLength += 1    
}

///////////////////////////////////////////////////////////

function increaseCirclePad() {
    
    const newCirclePad = circle.length - 1000 - circleLength
    
    for (let index = circleLength - 1; index > -1; index--) {
    
        circle[newCirclePad + index] = circle[circlePad + index]    
    }
    circlePad = newCirclePad
}

function decreaseCirclePad() {
    
    for (let index = 0; index < circleLength; index++) {
    
        circle[1000 + index] = circle[circlePad + index]    
    }
    circlePad = 1000
}

///////////////////////////////////////////////////////////

function circleShow(label) {

    if (label) { console.log(label) }

    console.log(circle.slice(circlePad, circlePad + circleLength))
}

main()

