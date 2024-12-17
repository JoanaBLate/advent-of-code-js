// solution for https://adventofcode.com/2024/day/14 part 2

// this puzzle is stupid, because we have no hint about the xmas tree, does it take the whole area?
// is it a simple geometric figure or is sofisticated? does it have borders? etc.
// THE TREE ONLY APPEARS IN AN EXACT MOMENT (AFTER THOUSANDS OF SECONDS); one second less or more
// and it vanishes without a trace :(

// this solution searchs the moment when *no robot clashes* and prints the map so you can check if
// there is a xmas tree there - MAY NOT WORK FOR YOUR INPUT!!!

"use strict"

const input = Deno.readTextFileSync("day14-input.txt").trim()

const width = 101
const height = 103

const map = [ ]

const allGuards = [ ]

var time = 0


function main() {

    processInput()

    setMap()
    
    while (true) {
        
        time += 1    
        const clashes = moveGuards()

        if (! clashes) { showMap(); break }
    }    
    
    console.log("If there is a xmas tree in the picture above, the answer is", time)        
}

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" ")
        
        const tokensP = parts.shift().substr(2).split(",")
        const tokensV = parts.shift().substr(2).split(",")
        
        const posX = parseInt(tokensP.shift())
        const posY = parseInt(tokensP.shift())
        const velX = parseInt(tokensV.shift())
        const velY = parseInt(tokensV.shift())
        
        const guard = { "posX": posX, "posY": posY, "velX": velX, "velY": velY }
        
        Object.freeze(guard) // will not be edited
        
        allGuards.push(guard)
    }
}

function setMap() {

    for (let row = 0; row < height; row++) { 

        const line = [ ]
        map.push(line)

        for (let col = 0; col < height; col++) { line.push(0) }
    }
}

///////////////////////////////////////////////////////////////////////////////

function moveGuards() {

    for (const guard of allGuards) { 
    
        const clashes = moveGuard(guard)
        
        if (clashes) { return true } 
    }
    return false
}

function moveGuard(guard) { 
                
    const bruteX = guard.posX + (time * guard.velX)
    const bruteY = guard.posY + (time * guard.velY)
    
    let finalX = bruteX % width
    if (finalX < 0) { finalX += width }
    
    let finalY = bruteY % height
    if (finalY < 0) { finalY += height }
        
    if (map[finalY][finalX] == time) { return true }
    
    map[finalY][finalX] = time
    
    return false
}

function showMap() {

    console.log("")
    
    for (const line of map) { 
    
        let s = ""
        for (const number of line) { s += number == time ? "X" : "." }    
        console.log(s)
    }
    console.log("")
}

console.time("execution time")
main()
console.timeEnd("execution time") // 30ms

