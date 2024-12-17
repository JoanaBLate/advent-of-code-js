"use strict"

// solving the puzzle takes (my computer) 0.050s

var DATA = [ ]

function main() {

    processInput()
     
    console.log("the answer is", findBestTime())
}

///////////////////////////////////////////////////////////

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        let s = line.replace("position=<", "")
        
        let index = s.indexOf(",")
        
        const posX = parseInt(s.substr(0, index))
        
        s = s.substr(index + 1)
        
        index = s.indexOf(">")

        const posY = parseInt(s.substr(0, index))
        
        s = s.substr(index + 1)
        
        s = s.replace("velocity=<", "")

        const tokens = s.split(",")
        
        const speedX = parseInt(tokens.shift())
        
        const speedY = parseInt(tokens.shift())
        
        DATA.push({ "posX": posX, "posY": posY, "speedX": speedX, "speedY": speedY })
    }
}

///////////////////////////////////////////////////////////

function findBestTime() {

    let time = 0
    
    let lastSize = 0
    
    while (true) {
    
        time += 1
        const rect = updateStars(1)
                
        const width = rect.right - rect.left + 1
        const height = rect.top - rect.bottom + 1
        
        const size = width * height
        
        if (lastSize == 0) { lastSize = size; continue }
        
        if (size > lastSize) { return time - 1 }
        
        if (size < lastSize) { lastSize = size }
    }
}

function updateStars(time) {

    const big = 999999 * 999999
    
    let left = big
    let right = -big

    let top = -big
    let bottom = big
    
    for (const data of DATA) {
        
        data.posX += time * data.speedX
        data.posY += time * data.speedY
        
        const x = data.posX
        const y = data.posY

        if (x < left)  { left  = x }
        if (x > right) { right = x }
        
        if (y > top)    { top = y }
        if (y < bottom) { bottom = y }
    }
    
    return { "left": left, "top": top, "right": right, "bottom": bottom }
}

///////////////////////////////////////////////////////////

main()

