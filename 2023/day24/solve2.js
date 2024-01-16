"use strict"

// solving the puzzle takes (my computer) 0.025s

/*/

    this program is an adaptation of a Ruby program linked in Reddit/AOC

    it is heavily based on math (I thought it was Advent of CODE, right?) 

    I could not understand it

    I was developing a programmer solution, but it was too slow,
    
    if I am able to run it under 15 seconds, I will publish it
    
    
    IMPORTANT: this program may give a slightly wrong result for YOUR INPUT because 
    
    the code should be using BigInt (I will not fix this - I hated this solution)

/*/

const input = Deno.readTextFileSync("input.txt").trim() 

const stones = [ ]


function main() {

    processInput()
    
    const arrayXY = elim(mat(0, 1, 3, 4))
    
    const x = arrayXY.shift().at(-1)
    const y = arrayXY.shift().at(-1)
    
    const arrayZ = elim(mat(2, 1, 5, 4))
    
    const z = arrayZ.shift().at(-1)

    console.log("the answer is", x + y + z)
}

///////////////////////////////////////////////////////////

function processInput() {
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(" @ ")
        
        const positions = parts.shift().split(",")

        const pX = parseInt(positions.shift())
        const pY = parseInt(positions.shift())
        const pZ = parseInt(positions.shift())

        const speeds = parts.shift().split(",")

        const vX = parseInt(speeds.shift())
        const vY = parseInt(speeds.shift())
        const vZ = parseInt(speeds.shift())
        
        stones.push([ pX, pY, pZ, vX, vY, vZ ])        
    }
}

///////////////////////////////////////////////////////////////////////

function mat(_x, _y, _dx, _dy) { // also works for XZ and YZ, just need arguments change

    const m = [ ]
    
    for (const stone of stones) {
    
        const x = stone[_x]
        const y = stone[_y]
        const dx = stone[_dx]
        const dy = stone[_dy]
        
        const list = [ -dy, dx, y, -x, (y * dx - x * dy) ]
        
        m.push(list)
    }
   
    const last = m.at(-1)

    const result = [ ]    

    for (let n = 0; n < 4; n++) { 
    
        const list = m[n]
        
        for (let m = 0; m < 5; m++) { list[m] -= last[m] }
        
        result.push(list)
    }
    
    return result
}

///////////////////////////////////////////////////////////

function elim(m) {

    for (let i = 0; i < m.length; i++) {
    
        const t = m[i][i]
        
        m[i] = m[i].map(function (x) { return x / t })
        
        for (let j = i + 1; j < m.length; j++) {
        
            const t = m[j][i]
            
            m[j] = m[j].map(function (x, k) { return x - t * m[i][k] })
        }
    }
    
    for (let i = m.length - 1; i >= 0; i--) {
    
        for (let j = 0; j < i; j++) {
        
            const t = m[j][i]
            
            m[j] = m[j].map(function (x, k) { return x - t * m[i][k] })
        }
    }
    
    return m    
}

main()

