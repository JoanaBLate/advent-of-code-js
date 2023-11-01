"use strict"

// solving the puzzle takes (my computer) 0.025s

const allBots = [ ]

var strongestBot = null


function main() {

    processInput()
     
    console.log("the answer is", calcStrength())
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    let greatestRadius = 0
    
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const parts = line.trim().split(">, r=")
        
        const radius = parseInt(parts.pop())
        
        const tokens = parts.shift().replace("pos=<", "").split(",")
        
        const x = parseInt(tokens.shift())
        const y = parseInt(tokens.shift())
        const z = parseInt(tokens.shift())
        
        const bot = { "radius": radius, "x": x, "y": y, "z": z }
        
        allBots.push(bot)
        
        if (radius > greatestRadius) { greatestRadius = radius; strongestBot = bot }
    }
}

function calcStrength() {

    let strength = 0
    
    for (const bot of allBots) {
    
        const deltaX = bot.x - strongestBot.x
        const deltaY = bot.y - strongestBot.y
        const deltaZ = bot.z - strongestBot.z
    
        const distance = Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaZ)
        
        if (strongestBot.radius >= distance) { strength += 1 }       
    }
    return strength
}

main()

