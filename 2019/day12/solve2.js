"use strict"

// solving the puzzle takes (my computer) 0.060s


// we must find repeating patterns
// the trick is checking each axis independently

const arquive = [ ]

var moons = null


function main() {

    processInput()
    
    moons = structuredClone(arquive)
    
    let xLoop = 0
    let yLoop = 0
    let zLoop = 0

    let n = 0
    
    while (true) {
        
        n += 1
    
        applyGravityGeneral()
        moveGeneral() 
        
        if (repeatsX()) { xLoop = n }
        if (repeatsY()) { yLoop = n }
        if (repeatsZ()) { zLoop = n }
        
        if (xLoop == 0) { continue }
        if (yLoop == 0) { continue }
        if (zLoop == 0) { continue }
        
        break
    }
     
    console.log("the answer is", lowestCommonMultiple(xLoop, yLoop, zLoop))
}

function processInput() {

    const input = Deno.readTextFileSync("input.txt").trim()
        
    const lines = input.split("\n")
    
    for (const line of lines) { 
    
        const tokens = line.trim().split(" ")
        
        const x = parseInt(tokens.shift().replace("<x=", ""))
        
        const y = parseInt(tokens.shift().replace("y=", ""))
        
        const z = parseInt(tokens.shift().replace("z=", ""))
        
        arquive.push(createMoon(x, y, z))
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

///////////////////////////////////////////////////////////

function repeatsX() {

    for (let n = 0; n < 4; n++) {
    
        if (moons[n].posX != arquive[n].posX) { return false }
        
        if (moons[n].speedX != arquive[n].speedX) { return false }
    }
    return true
}

function repeatsY() {

    for (let n = 0; n < 4; n++) {
    
        if (moons[n].posY != arquive[n].posY) { return false }
        
        if (moons[n].speedY != arquive[n].speedY) { return false }
    }
    return true
}

function repeatsZ() {

    for (let n = 0; n < 4; n++) {
    
        if (moons[n].posZ != arquive[n].posZ) { return false }
        
        if (moons[n].speedZ != arquive[n].speedZ) { return false }
    }
    return true
}

///////////////////////////////////////////////////////////

function lowestCommonMultiple(a, b, c) {

    const gcd = greatestCommonDivisor(a, b, c)
    
    const A = a / gcd
    const B = b / gcd
    const C = c / gcd
    
    return lowestCommonMultiple2(A, B, C)
}

function lowestCommonMultiple2(a, b, c) {

    let multiple = Math.min(a, b, c)
    
    multiple = lcm(multiple, a)
    multiple = lcm(multiple, b)
    multiple = lcm(multiple, c)
    
    return multiple

    function lcm(a, b) { return (a * b) / gcd(a, b) }

    function gcd(a, b) { return (b == 0) ? a : gcd(b, a % b) }
}

function greatestCommonDivisor(a, b, c) {

    let divisor = 1
    
    let n = Math.min(a, b, c) + 1
    
    while (true) {
        
        n -= 1
        
        if (n == 1) { return divisor }
    
        if (a % n != 0) { if (divisor == 1) { continue } else { return divisor } }
        if (b % n != 0) { if (divisor == 1) { continue } else { return divisor } }
        if (c % n != 0) { if (divisor == 1) { continue } else { return divisor } }

        if (divisor == 1) { divisor = n }
    }
}

main()

