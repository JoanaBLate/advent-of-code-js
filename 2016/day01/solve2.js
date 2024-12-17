"use strict"

// solving the puzzle takes (my computer) 0.023s

var x = 0
    
var y = 0
    
const directions = "north east south west".split(" ")

const locations = { "0~0": 1 } // visited locations

var found = false


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawTokens = rawText.split(" ")
    
    for (const rawToken of rawTokens) { 
    
        if (found) { break }
    
        const token = rawToken.replace(",", "")
        
        walk(token)
    }
    
    console.log("lowest grid steps is", x + y)
}

function  walk(token) {

    const spin = token[0]
    
    const steps = parseInt(token.substr(1))
    
    if (spin == "L") { directions.unshift(directions.pop()) } else { directions.push(directions.shift()) }
    
    const direction = directions[0]
    
    if (direction == "north") { walkY(+1, steps); return }
    
    if (direction == "south") { walkY(-1, steps); return }
    
    if (direction == "east")  { walkX(+1, steps); return }
    
    walkX(-1, steps) // west
}

function walkX(step, steps) {

    while (steps > 0) { 
    
        x += step
        
        steps -= 1
        
        checkLocation()
        
        if (found) { return }
    }
}

function walkY(step, steps) {

    while (steps > 0) { 
    
        y += step
        
        steps -= 1
        
        checkLocation()
        
        if (found) { return }
    }
}
        
function checkLocation() {

    const location = x + "~" + y
    
    if (locations[location] != undefined) { found = true; return }

    locations[location] = 1
}

main()

