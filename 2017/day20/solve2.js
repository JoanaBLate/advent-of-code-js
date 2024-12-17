"use strict"

// solving the puzzle takes (my computer) 0.330s

const particles = [ ]

const NUMBER_OF_TURNS = 1000

function main() {

    const rawText = Deno.readTextFileSync("input.txt").trim()
        
    const rawLines = rawText.split("\n")
    
    for (const rawLine of rawLines) { 
    
        fillParticlesOnce(rawLine.trim())
    }     
        
    for (let n = 0; n < NUMBER_OF_TURNS; n++) { updateAll(); checkCollision() }
            
    console.log("number of left particles is", particles.length)
}

///////////////////////////////////////////////////////////

function updateAll() {

    for (let index = particles.length - 1; index > -1; index--) { 
    
        const particle = particles[index]
        
        if (particle.alive) { updateThis(particle); continue }
        
        particles.splice(index, 1)
    }
}

function updateThis(particle) {

    particle.vX += particle.aX
    particle.vY += particle.aY
    particle.vZ += particle.aZ
    
    particle.pX += particle.vX
    particle.pY += particle.vY
    particle.pZ += particle.vZ
}

///////////////////////////////////////////////////////////

function checkCollision() {

    const off = particles.length

    for (let indexA = 0; indexA < off; indexA++) {
    
        const particleA = particles[indexA]

        for (let indexB = indexA + 1; indexB < off; indexB++) {
                    
            const particleB = particles[indexB]
            
            if (particleA.pX != particleB.pX) { continue }
            if (particleA.pY != particleB.pY) { continue }
            if (particleA.pZ != particleB.pZ) { continue }
            
            particleA.alive = false
            particleB.alive = false
        }
    }            
}
    
///////////////////////////////////////////////////////////

function fillParticlesOnce(line) {
    
    line = line.replace("p=<", "")
    
    let index = line.indexOf(">")
    
    const segmentP = line.substr(0, index)
    
    line = line.replace(segmentP, "")
    line = line.replace(">, v=<", "")
    
    index = line.indexOf(">")
    
    const segmentV = line.substr(0, index)
    
    line = line.replace(segmentV, "")
    line = line.replace(">, a=<", "")
    
    const segmentA = line.replace(">", "")


    const tokensP = segmentP.split(",")

    const pX = parseInt(tokensP.shift())
    const pY = parseInt(tokensP.shift())
    const pZ = parseInt(tokensP.shift())
    
    const tokensV = segmentV.split(",")

    const vX = parseInt(tokensV.shift())
    const vY = parseInt(tokensV.shift())
    const vZ = parseInt(tokensV.shift())
    
    const tokensA = segmentA.split(",")

    const aX = parseInt(tokensA.shift())
    const aY = parseInt(tokensA.shift())
    const aZ = parseInt(tokensA.shift())
    
    const particle = { "pX": pX, "pY": pY, "pZ": pZ, 
                       "vX": vX, "vY": vY, "vZ": vZ, 
                       "aX": aX, "aY": aY, "aZ": aZ,
                       
                       "alive": true }
    
    particles.push(particle)
}

main()

