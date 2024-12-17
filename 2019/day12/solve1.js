"use strict"

// solving the puzzle takes (my computer) 0.025s

const moons = [ ]


function main() {

    processInput()
    
//    console.log(moons)

    for (let n = 0; n < 1000; n++) {
    
        applyGravityGeneral()
        moveGeneral()    
    }
    
    let totalEnergy = 0
    
    for (const moon of moons) {
    
        const potentialEnergy = Math.abs(moon.posX) + Math.abs(moon.posY) + Math.abs(moon.posZ)
        
        const kineticEnergy = Math.abs(moon.speedX) + Math.abs(moon.speedY) + Math.abs(moon.speedZ)
        
        totalEnergy += potentialEnergy * kineticEnergy
    }
     
    console.log("the answer is", totalEnergy)
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const x = parseInt(tokens.shift().replace("<x=", ""))
        
        const y = parseInt(tokens.shift().replace("y=", ""))
        
        const z = parseInt(tokens.shift().replace("z=", ""))
        
        moons.push(createMoon(x, y, z))
    }
}

function createMoon(x, y, z) {

    return { "posX": x, "posY": y, "posZ": z, "speedX": 0, "speedY": 0, "speedZ": 0 }        
}

///////////////////////////////////////////////////////////

function applyGravityGeneral() {

    const a = moons[0]
    const b = moons[1]
    const c = moons[2]
    const d = moons[3]
    
    applyGravity(a, b)
    applyGravity(a, c)
    applyGravity(a, d)
    applyGravity(b, c)
    applyGravity(b, d)
    applyGravity(c, d)
}
    
function applyGravity(a, b) {
    
    if (a.posX < b.posX) {
    
        a.speedX += 1; b.speedX -= 1
    }
    else if (a.posX > b.posX) {
    
        a.speedX -= 1; b.speedX += 1    
    }
    
    if (a.posY < b.posY) {
    
        a.speedY += 1; b.speedY -= 1
    }
    else if (a.posY > b.posY) {
    
        a.speedY -= 1; b.speedY += 1    
    }
    
    if (a.posZ < b.posZ) {
    
        a.speedZ += 1; b.speedZ -= 1
    }
    else if (a.posZ > b.posZ) {
    
        a.speedZ -= 1; b.speedZ += 1    
    }
}

function moveGeneral() {

    for (const moon of moons) {
        
        moon.posX += moon.speedX
        moon.posY += moon.speedY
        moon.posZ += moon.speedZ
    }
}

main()

