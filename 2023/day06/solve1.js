"use strict"

// solving the puzzle takes (my computer) 0.027s

const TIMES = [ ]
const DISTANCES = [ ]


function main() {

    processInput()
    
    let result = 1
    
    while (TIMES.length > 0) { result *= calcWays(TIMES.shift(), DISTANCES.shift()) }
     
    console.log("the answer is", result)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
            
    const lines = input.split("\n")
    
    const stringTimes = lines.shift().split(":").pop().trim().split(" ") // includes white spaces

    const stringDistances = lines.shift().split(":").pop().trim().split(" ") // includes white spaces
    
    for (const token of stringTimes) { 
    
        const time = parseInt(token)
     
        if (! isNaN(time)) { TIMES.push(time) }
    }
    
    for (const token of stringDistances) { 
    
        const distance = parseInt(token)
     
        if (! isNaN(distance)) { DISTANCES.push(distance) }
    }
}

function calcWays(duration, record) {

    let ways = 0

    for (let pressing = 1; pressing < duration; pressing++) {

        const navigationTime = duration - pressing
        
        let distance = navigationTime * pressing
        
        if (distance > record) { ways += 1 }
    }
    return ways
}

main()

