"use strict"

// solving the puzzle takes (my computer) 0.023s

var x = 0
    
var y = 0
    
const directions = "north east south west".split(" ")


function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
    
    const rawTokens = rawText.split(" ")
    
    for (const rawToken of rawTokens) { 
    
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
    
    if (direction == "north") { y += steps; return }
    
    if (direction == "south") { y -= steps; return }
    
    if (direction == "east")  { x += steps; return }
    
    x -= steps // west
}

main()

